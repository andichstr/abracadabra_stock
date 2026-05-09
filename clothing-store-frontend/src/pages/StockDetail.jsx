import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, deleteProduct } from '../api/productApi'
import styles from './StockDetail.module.css'

function StockDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/stock')} style={{ marginBottom: 20 }}>
        ← Volver al stock
      </button>

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.noImage}>Sin imagen</div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className="page-title" style={{ marginBottom: 12 }}>{product.name}</h1>

          {product.description && <p className={styles.description}>{product.description}</p>}

          <div className={styles.grid}>
            <Field label="Categoría" value={product.categoryName || '—'} />
            <Field label="Talle" value={product.size || '—'} />
            <Field label="Color" value={product.color || '—'} />
            <Field label="Stock disponible" value={product.stockQuantity} highlight={product.stockQuantity === 0 ? 'red' : 'green'} />
            <Field label="Precio de venta" value={`$${product.salePrice?.toFixed(2)}`} />
            <Field label="Precio de costo" value={`$${product.costPrice?.toFixed(2)}`} />
            <Field label="Fecha de ingreso" value={product.entryDate} />
            <Field label="Código QR" value={product.qrCode || '—'} />
          </div>

          <div className={styles.actions}>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar producto
            </button>
          </div>
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
