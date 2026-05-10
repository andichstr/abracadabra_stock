import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logo from '../assets/logo.jpg'
import styles from './Navbar.module.css'

function Navbar() {
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Abracadabra Woman & Kids" className={styles.logo} />
      </div>
      <ul className={styles.links}>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/vender" className={({ isActive }) => isActive ? styles.active : ''}>
            Vender {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
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
