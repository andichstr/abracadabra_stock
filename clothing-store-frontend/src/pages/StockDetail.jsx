import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, deleteProduct } from '../api/productApi'
import styles from './StockDetail.module.css'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

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

  const variants = product.variants ?? []
  const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0)

  // Build grid: unique colors (preserve order of first appearance), sizes from SIZES constant
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]
  const usedSizes = SIZES.filter((s) => variants.some((v) => v.size === s))
  const variantMap = {}
  const colorImageMap = {}
  variants.forEach((v) => {
    variantMap[`${v.size}-${v.color}`] = v.stockQuantity
    if (v.color && v.imageUrl && !colorImageMap[v.color]) colorImageMap[v.color] = v.imageUrl
  })

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/stock')} style={{ marginBottom: 20 }}>
        ← Volver al stock
      </button>

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          {colors.filter((c) => colorImageMap[c]).length > 0 ? (
            <div className={styles.colorGallery}>
              {colors.filter((c) => colorImageMap[c]).map((c) => (
                <div key={c} className={styles.galleryItem}>
                  <img src={colorImageMap[c]} alt={c} className={styles.image} />
                  <span className={styles.galleryLabel}>{c}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImage}>Sin imagen</div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className="page-title" style={{ marginBottom: 12 }}>{product.name}</h1>

          <div className={styles.grid}>
            <Field label="Categoría" value={product.categoryName || '—'} />
            <Field label="Precio de venta" value={`$${product.salePrice?.toFixed(2)}`} />
            <Field label="Precio de costo" value={`$${product.costPrice?.toFixed(2)}`} />
            <Field label="Fecha de ingreso" value={product.entryDate} />
            <Field label="Código QR" value={product.qrCode || '—'} />
            <Field
              label="Stock total"
              value={totalStock}
              highlight={totalStock === 0 ? 'red' : 'green'}
            />
          </div>

          {variants.length > 0 && (
            <div className={styles.variantsSection}>
              <h2 className={styles.variantsTitle}>Stock por variante</h2>
              {colors.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.variantTable}>
                    <thead>
                      <tr>
                        <th>Talle</th>
                        {colors.map((c) => (
                          <th key={c}>
                            {colorImageMap[c] && (
                              <img src={colorImageMap[c]} alt={c} className={styles.colorThumb} />
                            )}
                            <div>{c}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {usedSizes.map((size) => (
                        <tr key={size}>
                          <td className={styles.sizeCell}>{size}</td>
                          {colors.map((color) => {
                            const qty = variantMap[`${size}-${color}`]
                            return (
                              <td key={color} className={qty === undefined ? styles.cellEmpty : qty === 0 ? styles.cellZero : styles.cellStock}>
                                {qty === undefined ? '—' : qty}
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
                    <li key={v.id} className={styles.variantRow}>
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
