import styles from './FilterBar.module.css'

function FilterBar({ filters, onChange, categories = [] }) {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  return (
    <div className={styles.filterBar}>
      {categories.length > 0 && (
        <div className={styles.field}>
          <label>Categoría</label>
          <select value={filters.categoryId || ''} onChange={handle('categoryId')}>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label>Fecha desde</label>
        <input type="date" value={filters.dateFrom || ''} onChange={handle('dateFrom')} />
      </div>

      <div className={styles.field}>
        <label>Fecha hasta</label>
        <input type="date" value={filters.dateTo || ''} onChange={handle('dateTo')} />
      </div>

      {filters.priceMin !== undefined && (
        <div className={styles.field}>
          <label>Precio mín.</label>
          <input type="number" min="0" value={filters.priceMin} onChange={handle('priceMin')} placeholder="0" />
        </div>
      )}

      {filters.priceMax !== undefined && (
        <div className={styles.field}>
          <label>Precio máx.</label>
          <input type="number" min="0" value={filters.priceMax} onChange={handle('priceMax')} placeholder="∞" />
        </div>
      )}

      {filters.amountMin !== undefined && (
        <div className={styles.field}>
          <label>Monto mín.</label>
          <input type="number" min="0" value={filters.amountMin} onChange={handle('amountMin')} placeholder="0" />
        </div>
      )}

      {filters.amountMax !== undefined && (
        <div className={styles.field}>
          <label>Monto máx.</label>
          <input type="number" min="0" value={filters.amountMax} onChange={handle('amountMax')} placeholder="∞" />
        </div>
      )}

      {filters.size !== undefined && (
        <div className={styles.field}>
          <label>Talle</label>
          <select value={filters.size} onChange={handle('size')}>
            <option value="">Todos</option>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {filters.color !== undefined && (
        <div className={styles.field}>
          <label>Color</label>
          <input type="text" value={filters.color} onChange={handle('color')} placeholder="Ej: rojo" />
        </div>
      )}

      <button
        className="btn btn-secondary"
        style={{ alignSelf: 'flex-end' }}
        onClick={() => onChange(Object.fromEntries(Object.keys(filters).map((k) => [k, ''])))}
      >
        Limpiar
      </button>
    </div>
  )
}

export default FilterBar
