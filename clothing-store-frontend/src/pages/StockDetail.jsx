import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { getProductById, deleteProduct } from '../api/productApi'
import { useCart } from '../context/CartContext'
import styles from './StockDetail.module.css'

function QrImage({ value }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (!value) return
    QRCode.toDataURL(value, { width: 256, margin: 1, color: { dark: '#4a2244', light: '#ffffff' } })
      .then(setSrc)
  }, [value])
  if (!src) return null
  return <img src={src} alt="QR" className={styles.qrImage} />
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function StockDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartVariant, setCartVariant] = useState(null)

  useEffect(() => {
    getProductById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro que querés eliminar este producto?')) return
    try {
      await deleteProduct(id)
      navigate('/stock')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar el producto.')
    }
  }

  if (loading) return <p className="loading">Cargando...</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!product) return null

  const variants = product.variants ?? []
  const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0)

  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]
  const usedSizes = SIZES.filter((s) => variants.some((v) => v.size === s))

  const colorImageMap = {}
  const variantObjMap = {}
  variants.forEach((v) => {
    if (v.color && v.imageUrl && !colorImageMap[v.color]) colorImageMap[v.color] = v.imageUrl
    variantObjMap[`${v.size}-${v.color}`] = v
  })

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/stock')} style={{ marginBottom: 20 }}>
        ← Volver al stock
      </button>

      <h1 className="page-title" style={{ marginBottom: 16 }}>{product.name}</h1>

      <div className={styles.grid}>
        <Field label="Categoría" value={product.categoryName || '—'} />
        <Field label="Precio de venta" value={`$${product.salePrice?.toFixed(2)}`} />
        <Field label="Precio de costo" value={`$${product.costPrice?.toFixed(2)}`} />
        <Field label="Fecha de ingreso" value={product.entryDate} />
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Código QR</span>
          {product.qrCode ? <QrImage value={product.qrCode} /> : <span className={styles.fieldValue}>—</span>}
        </div>
        <Field
          label="Stock total"
          value={totalStock}
          highlight={totalStock === 0 ? 'red' : 'green'}
        />
      </div>

      {variants.length > 0 && (
        <div className={styles.variantsSection}>
          <h2 className={styles.variantsTitle}>Stock por variante</h2>
          <p className={styles.variantsHint}>Tocá un número para agregar al carrito.</p>

          {colors.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.variantTable}>
                <thead>
                  <tr>
                    <th>Talle</th>
                    {colors.map((c) => (
                      <th key={c}>
                        {colorImageMap[c] ? (
                          <img
                            src={colorImageMap[c]}
                            alt={c}
                            className={styles.colorThumb}
                            title="Ver imagen completa"
                            onClick={() => window.open(colorImageMap[c], '_blank')}
                          />
                        ) : null}
                        <div>{c.toUpperCase()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usedSizes.map((size) => (
                    <tr key={size}>
                      <td className={styles.sizeCell}>{size}</td>
                      {colors.map((color) => {
                        const variant = variantObjMap[`${size}-${color}`]
                        const qty = variant?.stockQuantity
                        const clickable = qty > 0
                        return (
                          <td
                            key={color}
                            className={
                              variant === undefined
                                ? styles.cellEmpty
                                : qty === 0
                                ? styles.cellZero
                                : styles.cellStock
                            }
                            onClick={() => clickable && setCartVariant(variant)}
                            title={clickable ? `Agregar ${size} / ${color} al carrito` : undefined}
                          >
                            {variant === undefined ? '—' : qty}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className={styles.variantList}>
              {variants.map((v) => (
                <li
                  key={v.id}
                  className={styles.variantRow}
                  onClick={() => v.stockQuantity > 0 && setCartVariant(v)}
                  title={v.stockQuantity > 0 ? 'Agregar al carrito' : undefined}
                >
                  <span>{v.size || '—'}</span>
                  <span className={v.stockQuantity === 0 ? styles.stockZero : styles.stockOk}>
                    Stock: {v.stockQuantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button className="btn btn-danger" onClick={handleDelete}>
          Eliminar producto
        </button>
      </div>

      {cartVariant && (
        <AddToCartModal
          product={product}
          variant={cartVariant}
          onClose={() => setCartVariant(null)}
        />
      )}
    </div>
  )
}

function AddToCartModal({ product, variant, onClose }) {
  const { cart, dispatch } = useCart()
  const inCart = cart.find((i) => i.variantId === variant.id)?.quantity ?? 0
  const available = variant.stockQuantity - inCart
  const [qty, setQty] = useState(available > 0 ? 1 : 0)

  const handleAdd = () => {
    if (qty <= 0 || qty > available) return
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        salePrice: product.salePrice,
        quantity: qty,
      },
    })
    onClose()
  }

  const setValidQty = (raw) => {
    const n = parseInt(raw) || 0
    setQty(Math.max(0, Math.min(available, n)))
  }

  const label = [variant.size, variant.color].filter(Boolean).join(' / ')

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Agregar al carrito</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalProduct}>{product.name}</p>
          <p className={styles.modalVariant}>{label}</p>

          {available <= 0 ? (
            <p className={styles.modalNoStock}>
              {inCart > 0
                ? `Ya tenés ${inCart} en el carrito (stock agotado).`
                : 'Sin stock disponible.'}
            </p>
          ) : (
            <>
              {inCart > 0 && (
                <p className={styles.modalInCart}>Ya tenés {inCart} en el carrito.</p>
              )}
              <p className={styles.modalAvailable}>Disponible: {available}</p>
              <div className={styles.modalQtyRow}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <input
                  type="number"
                  min="1"
                  max={available}
                  value={qty}
                  onChange={(e) => setValidQty(e.target.value)}
                  className={styles.qtyInput}
                  autoFocus
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.min(available, q + 1))}
                  disabled={qty >= available}
                >+</button>
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          {available > 0 && (
            <button className="btn btn-primary" onClick={handleAdd} disabled={qty <= 0}>
              Agregar {qty > 1 ? `${qty} unidades` : '1 unidad'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, highlight }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span
        className={styles.fieldValue}
        style={{
          color: highlight === 'red' ? '#c0392b' : highlight === 'green' ? '#1e8449' : undefined,
          fontWeight: highlight ? 700 : undefined,
        }}
      >
        {value}
      </span>
    </div>
  )
}

export default StockDetail
