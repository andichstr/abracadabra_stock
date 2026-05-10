import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const navigate = useNavigate()

  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0) ?? 0
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean) ?? [])]

  return (
    <div className={`card ${styles.productCard}`} onClick={() => navigate(`/stock/${product.id}`)}>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.image}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.tags}>
          {product.categoryName && <span className="badge badge-blue">{product.categoryName}</span>}
          {sizes.map((s) => (
            <span key={s} className="badge badge-gray">{s}</span>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>${product.salePrice?.toFixed(2)}</span>
          <span className={totalStock > 0 ? 'badge badge-green' : 'badge badge-red'}>
            Stock: {totalStock}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
