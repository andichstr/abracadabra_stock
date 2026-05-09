import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>👔 Tienda de Ropa</div>
      <ul className={styles.links}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
            Inicio {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/stock" className={({ isActive }) => isActive ? styles.active : ''}>
            Stock
          </NavLink>
        </li>
        <li>
          <NavLink to="/sales" className={({ isActive }) => isActive ? styles.active : ''}>
            Ventas
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
