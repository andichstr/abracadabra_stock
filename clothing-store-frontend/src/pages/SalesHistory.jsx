import { useState, useEffect, useCallback, useRef } from 'react'
import FilterBar from '../components/FilterBar'
import SaleCard from '../components/SaleCard'
import { getSales } from '../api/saleApi'
import styles from './SalesHistory.module.css'

const INITIAL_FILTERS = {
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
}

function SalesHistory() {
  const [sales, setSales] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef(null)

  const fetchSales = useCallback((f) => {
    setLoading(true)
    setError('')
    getSales(f)
      .then(({ data }) => setSales(data))
      .catch(() => setError('Error al cargar las ventas.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSales(filters), 400)
    return () => clearTimeout(debounceRef.current)
  }, [filters, fetchSales])

  return (
    <div>
      <h1 className="page-title">Historial de ventas</h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && <p className="error-msg">{error}</p>}
      {loading && <p className="loading">Cargando...</p>}

      {!loading && sales.length === 0 && !error && (
        <p className="empty-state">No se encontraron ventas.</p>
      )}

      <div className={styles.list}>
        {sales.map((sale) => (
          <SaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  )
}

export default SalesHistory
