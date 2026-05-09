import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

function Cart({ onConfirm, loading }) {
  const { cart, dispatch } = useCart()

  const total = cart.reduce((sum, i) => sum + i.salePrice * i.quantity, 0)

  if (cart.length === 0) {
    return <p className={styles.empty}>El carrito está vacío. Escaneá un producto para comenzar.</p>
  }

  return (
    <div className={styles.cart}>
      <h2 className={styles.title}>Carrito</h2>
      <ul className={styles.list}>
        {cart.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>${item.salePrice?.toFixed(2)} c/u</span>
            </div>
            <div className={styles.itemActions}>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px' }}
                onClick={() =>
                  item.quantity > 1
                    ? dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, quantity: item.quantity - 1 } })
                    : dispatch({ type: 'REMOVE_ITEM', payload: item.id })
                }
              >
                −
              </button>
              <span className={styles.qty}>{item.quantity}</span>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px' }}
                onClick={() =>
                  dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, quantity: item.quantity + 1 } })
                }
              >
                +
              </button>
              <button
                className="btn btn-danger"
                style={{ padding: '4px 10px' }}
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className={styles.total}>Total: ${total.toFixed(2)}</span>
        <div className={styles.footerActions}>
          <button
            className="btn btn-secondary"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
            disabled={loading}
          >
            Vaciar
          </button>
          <button className="btn btn-success" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar venta'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
