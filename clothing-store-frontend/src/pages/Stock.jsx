import { useState, useEffect, useCallback, useRef } from 'react'
import FilterBar from '../components/FilterBar'
import ProductCard from '../components/ProductCard'
import ProductFormModal from '../components/ProductFormModal'
import Pagination from '../components/Pagination'
import { getProducts } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import { usePagination } from '../hooks/usePagination'
import { exportQrPdf } from '../utils/qrPdfExport'
import QrExportModal from '../components/QrExportModal'
import styles from './Stock.module.css'

const INITIAL_FILTERS = {
  categoryId: '',
  dateFrom: '',
  dateTo: '',
  priceMin: '',
  priceMax: '',
  size: '',
  color: '',
}

function Stock() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showExportModal, setShowExportModal] = useState(false)
  const { page, setPage, totalPages, totalElements, pageSize, applyResponse } = usePagination()
  const debounceRef = useRef(null)

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  const fetchProducts = useCallback((f, p) => {
    setLoading(true)
    setError('')
    getProducts(f, p, pageSize)
      .then(({ data }) => {
        setProducts(data.content)
        applyResponse(data)
      })
      .catch(() => setError('Error al cargar los productos.'))
      .finally(() => setLoading(false))
  }, [pageSize, applyResponse])

  // Filter changes: debounced, resets to page 0
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      fetchProducts(filters, 0)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [filters, fetchProducts, setPage])

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
    fetchProducts(filters, newPage)
  }, [filters, fetchProducts, setPage])

  const handleProductCreated = () => {
    fetchProducts(filters, 0)
    setPage(0)
    setShowModal(false)
  }

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const exitSelectionMode = () => {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }

  const selectedProducts = products.filter((p) => selectedIds.has(p.id))

  const handleExportQr = () => {
    if (selectedIds.size === 0) return
    setShowExportModal(true)
  }

  const handleConfirmExport = async (variantItems) => {
    await exportQrPdf(variantItems)
    setShowExportModal(false)
    exitSelectionMode()
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Stock</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {selectionMode ? (
            <>
              <button className="btn btn-secondary" onClick={exitSelectionMode}>Cancelar</button>
              <button
                className="btn btn-primary"
                onClick={handleExportQr}
                disabled={selectedIds.size === 0}
              >
                {`Exportar QR (${selectedIds.size})`}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setSelectionMode(true)}>
                Exportar QR
              </button>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Agregar producto
              </button>
            </>
          )}
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} categories={categories} />

      {error && <p className="error-msg">{error}</p>}
      {loading && <p className="loading">Cargando...</p>}

      {!loading && products.length === 0 && !error && (
        <p className="empty-state">No se encontraron productos con los filtros seleccionados.</p>
      )}

      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            selectable={selectionMode}
            selected={selectedIds.has(p.id)}
            onToggle={toggleSelection}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={handlePageChange}
      />

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onCreated={handleProductCreated}
        />
      )}

      {showExportModal && (
        <QrExportModal
          products={selectedProducts}
          onClose={() => setShowExportModal(false)}
          onExport={handleConfirmExport}
        />
      )}
    </div>
  )
}

export default Stock
