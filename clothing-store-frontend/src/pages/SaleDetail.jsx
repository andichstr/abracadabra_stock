import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSaleById } from '../api/saleApi'
import styles from './SaleDetail.module.css'

function SaleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sale, setSale] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSaleById(id)
      .then(({ data }) => setSale(data))
      .catch(() => setError('Venta no encontrada.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="loading">Cargando...</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!sale) return null

  const date = new Date(sale.saleDate)

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/sales')} style={{ marginBottom: 20 }}>
        ← Volver al historial
      </button>

      <div className={styles.header}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Venta #{sale.id}</h1>
          <p className={styles.date}>
            {date.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            {' — '}
            {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalAmount}>${sale.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.productName}</td>
                <td>${item.unitPrice?.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.subtotal?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
              <td style={{ fontWeight: 700, color: '#27ae60' }}>${sale.totalAmount?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default SaleDetail
