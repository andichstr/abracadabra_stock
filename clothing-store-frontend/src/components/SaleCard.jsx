import { useNavigate } from 'react-router-dom'
import styles from './SaleCard.module.css'

function SaleCard({ sale }) {
  const navigate = useNavigate()
  const date = new Date(sale.saleDate)

  return (
    <div className={`card ${styles.saleCard}`} onClick={() => navigate(`/sales/${sale.id}`)}>
      <div className={styles.header}>
        <span className={styles.id}>Venta #{sale.id}</span>
        <span className={styles.total}>${sale.totalAmount?.toFixed(2)}</span>
      </div>
      <div className={styles.meta}>
        <span>{date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        <span>{date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="badge badge-blue">{sale.items?.length} producto(s)</span>
      </div>
    </div>
  )
}

export default SaleCard
