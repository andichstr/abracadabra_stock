import { useState, useEffect } from 'react'
import { createProduct } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import styles from './ProductFormModal.module.css'

const EMPTY_FORM = {
  name: '',
  description: '',
  costPrice: '',
  salePrice: '',
  stockQuantity: '',
  categoryId: '',
  size: '',
  color: '',
  entryDate: new Date().toISOString().split('T')[0],
  imageUrl: '',
}

function ProductFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (!form.salePrice || isNaN(form.salePrice)) return setError('El precio de venta es obligatorio.')
    if (!form.costPrice || isNaN(form.costPrice)) return setError('El precio de costo es obligatorio.')
    if (!form.entryDate) return setError('La fecha de ingreso es obligatoria.')

    setLoading(true)
    try {
      const payload = {
        ...form,
        costPrice: parseFloat(form.costPrice),
        salePrice: parseFloat(form.salePrice),
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      }
      const { data } = await createProduct(payload)
      onCreated(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el producto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Nuevo producto</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className="error-msg">{error}</p>}

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre *</label>
              <input value={form.name} onChange={handle('name')} placeholder="Ej: Remera básica" />
            </div>
            <div className={styles.field}>
              <label>Categoría</label>
              <select value={form.categoryId} onChange={handle('categoryId')}>
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Descripción</label>
            <textarea
              value={form.description}
              onChange={handle('description')}
              placeholder="Descripción opcional..."
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Precio de costo *</label>
              <input type="number" min="0" step="0.01" value={form.costPrice} onChange={handle('costPrice')} placeholder="0.00" />
            </div>
            <div className={styles.field}>
              <label>Precio de venta *</label>
              <input type="number" min="0" step="0.01" value={form.salePrice} onChange={handle('salePrice')} placeholder="0.00" />
            </div>
            <div className={styles.field}>
              <label>Stock inicial</label>
              <input type="number" min="0" value={form.stockQuantity} onChange={handle('stockQuantity')} placeholder="0" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Talle</label>
              <select value={form.size} onChange={handle('size')}>
                <option value="">-</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Color</label>
              <input value={form.color} onChange={handle('color')} placeholder="Ej: Azul" />
            </div>
            <div className={styles.field}>
              <label>Fecha de ingreso *</label>
              <input type="date" value={form.entryDate} onChange={handle('entryDate')} />
            </div>
          </div>

          <div className={styles.field}>
            <label>URL de imagen</label>
            <input value={form.imageUrl} onChange={handle('imageUrl')} placeholder="https://..." />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
