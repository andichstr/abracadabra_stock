import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const navigate = useNavigate()

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
          {product.size && <span className="badge badge-gray">{product.size}</span>}
          {product.color && <span className="badge badge-gray">{product.color}</span>}
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>${product.salePrice?.toFixed(2)}</span>
          <span className={product.stockQuantity > 0 ? 'badge badge-green' : 'badge badge-red'}>
            Stock: {product.stockQuantity}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
