import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRScanner from '../components/QRScanner'
import Cart from '../components/Cart'
import { useCart } from '../context/CartContext'
import { getProductByQr } from '../api/productApi'
import { createSale } from '../api/saleApi'
import styles from './Home.module.css'

function Home() {
  const { cart, dispatch } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastScanned, setLastScanned] = useState(null)

  const handleScan = async (qrCode) => {
    if (lastScanned === qrCode) return
    setLastScanned(qrCode)
    setTimeout(() => setLastScanned(null), 1500)

    try {
      const { data: product } = await getProductByQr(qrCode)
      dispatch({ type: 'ADD_ITEM', payload: product })
      setError('')
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Producto no encontrado para el QR escaneado: "${qrCode}"`)
      } else {
        setError('Error al buscar el producto.')
      }
    }
  }

  const handleConfirmSale = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
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
    </div>
  )
}

export default Home
