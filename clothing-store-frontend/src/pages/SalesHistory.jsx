import { useState, useEffect, useCallback, useRef } from 'react'
import FilterBar from '../components/FilterBar'
import SaleCard from '../components/SaleCard'
import Pagination from '../components/Pagination'
import { getSales } from '../api/saleApi'
import { usePagination } from '../hooks/usePagination'
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
  const { page, setPage, totalPages, totalElements, pageSize, applyResponse } = usePagination()
  const debounceRef = useRef(null)

  const fetchSales = useCallback((f, p) => {
    setLoading(true)
    setError('')
    getSales(f, p, pageSize)
      .then(({ data }) => {
        setSales(data.content)
        applyResponse(data)
      })
      .catch(() => setError('Error al cargar las ventas.'))
      .finally(() => setLoading(false))
  }, [pageSize, applyResponse])

  // Filter changes: debounced, resets to page 0
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      fetchSales(filters, 0)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [filters, fetchSales, setPage])

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
    fetchSales(filters, newPage)
  }, [filters, fetchSales, setPage])

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

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default SalesHistory
