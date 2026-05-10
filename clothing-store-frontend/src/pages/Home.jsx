import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRScanner from '../components/QRScanner'
import Cart from '../components/Cart'
import { useCart } from '../context/CartContext'
import { getProductByQr, getVariantByQr } from '../api/productApi'
import { createSale } from '../api/saleApi'
import styles from './Home.module.css'

function Home() {
  const { cart, dispatch } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastScanned, setLastScanned] = useState(null)
  const [pendingProduct, setPendingProduct] = useState(null)

  const handleScan = async (qrCode) => {
    if (lastScanned === qrCode) return
    setLastScanned(qrCode)
    setTimeout(() => setLastScanned(null), 1500)
    setError('')

    // Try variant QR first (new format — one QR per variant)
    try {
      const { data: variant } = await getVariantByQr(qrCode)
      if (variant.stockQuantity === 0) {
        const label = [variant.size, variant.color].filter(Boolean).join(' / ')
        setError(`Sin stock: "${variant.productName}"${label ? ` (${label})` : ''}`)
      } else {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            variantId: variant.variantId,
            productId: variant.productId,
            name: variant.productName,
            size: variant.size,
            color: variant.color,
            salePrice: variant.salePrice,
          },
        })
      }
      return
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Error al buscar el producto.')
        return
      }
    }

    // Fallback: product-level QR (legacy format — shows variant selector)
    try {
      const { data: product } = await getProductByQr(qrCode)
      const available = product.variants?.filter((v) => v.stockQuantity > 0) ?? []
      if (available.length === 0) {
        setError(`"${product.name}" no tiene stock disponible.`)
      } else if (available.length === 1) {
        addVariantToCart(product, available[0])
      } else {
        setPendingProduct(product)
      }
    } catch {
      setError(`Producto no encontrado para el QR escaneado: "${qrCode}"`)
    }
  }

  const addVariantToCart = (product, variant) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        salePrice: product.salePrice,
      },
    })
  }

  const handleSelectVariant = (variant) => {
    addVariantToCart(pendingProduct, variant)
    setPendingProduct(null)
  }

  const handleConfirmSale = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }
      const { data: sale } = await createSale(payload)
      dispatch({ type: 'CLEAR_CART' })
      setSuccessMsg(`Venta #${sale.id} registrada por $${sale.totalAmount.toFixed(2)}`)
      setTimeout(() => {
        setSuccessMsg('')
        navigate(`/sales/${sale.id}`)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la venta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Inicio — Nueva venta</h1>

      {error && <p className="error-msg">{error}</p>}
      {successMsg && (
        <p style={{ background: '#d5f5e3', color: '#1e8449', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          {successMsg}
        </p>
      )}

      <div className={styles.layout}>
        <section className={styles.scannerSection}>
          <h2 className={styles.sectionTitle}>Escanear producto</h2>
          <QRScanner onScan={handleScan} />
        </section>

        <section className={styles.cartSection}>
          <Cart onConfirm={handleConfirmSale} loading={loading} />
        </section>
      </div>

      {pendingProduct && (
        <VariantSelector
          product={pendingProduct}
          onSelect={handleSelectVariant}
          onClose={() => setPendingProduct(null)}
        />
      )}
    </div>
  )
}

function VariantSelector({ product, onSelect, onClose }) {
  const available = product.variants.filter((v) => v.stockQuantity > 0)

  return (
    <div className={styles.variantOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.variantModal}>
        <div className={styles.variantHeader}>
          <h3>{product.name}</h3>
          <button onClick={onClose} className={styles.variantClose}>✕</button>
        </div>
        <p className={styles.variantSubtitle}>Seleccioná la variante a agregar al carrito</p>
        <ul className={styles.variantList}>
          {available.map((v) => (
            <li key={v.id}>
              <button className={styles.variantBtn} onClick={() => onSelect(v)}>
                <span className={styles.variantBtnLabel}>
                  {v.size && <span className="badge badge-gray">{v.size}</span>}
                  {v.color && <span className="badge badge-gray">{v.color}</span>}
                </span>
                <span className={styles.variantBtnStock}>Stock: {v.stockQuantity}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home
