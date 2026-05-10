import { useState } from 'react'
import styles from './QrExportModal.module.css'

function QrExportModal({ products, onClose, onExport }) {
  const [quantities, setQuantities] = useState(() => {
    const init = {}
    for (const product of products) {
      for (const variant of product.variants ?? []) {
        if (variant.qrCode) {
          init[variant.id] = variant.stockQuantity ?? 0
        }
      }
    }
    return init
  })
  const [exporting, setExporting] = useState(false)

  const set = (variantId, raw) => {
    const qty = Math.max(0, Math.min(999, parseInt(raw) || 0))
    setQuantities((prev) => ({ ...prev, [variantId]: qty }))
  }

  const handleExport = async () => {
    const items = []
    for (const product of products) {
      for (const variant of product.variants ?? []) {
        if (!variant.qrCode) continue
        const qty = quantities[variant.id] ?? 0
        if (qty > 0) {
          items.push({
            qrCode: variant.qrCode,
            size: variant.size,
            color: variant.color,
            productName: product.name,
            quantity: qty,
          })
        }
      }
    }
    if (items.length === 0) return
    setExporting(true)
    await onExport(items)
    setExporting(false)
  }

  const total = Object.values(quantities).reduce((s, q) => s + q, 0)

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Configurar etiquetas QR</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p className={styles.subtitle}>
          Indicá cuántas etiquetas imprimir por variante. Por defecto se usa el stock actual.
        </p>

        <div className={styles.body}>
          {products.map((product) => {
            const variants = (product.variants ?? []).filter((v) => v.qrCode)
            if (variants.length === 0) return null
            return (
              <div key={product.id} className={styles.productSection}>
                <h3 className={styles.productName}>{product.name}</h3>
                {variants.map((variant) => (
                  <div key={variant.id} className={styles.variantRow}>
                    <div className={styles.variantLabel}>
                      {variant.size && <span className="badge badge-gray">{variant.size}</span>}
                      {variant.color && <span className="badge badge-gray">{variant.color}</span>}
                    </div>
                    <div className={styles.qtyControl}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => set(variant.id, (quantities[variant.id] ?? 0) - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        className={styles.qtyInput}
                        value={quantities[variant.id] ?? 0}
                        onChange={(e) => set(variant.id, e.target.value)}
                      />
                      <button
                        className={styles.qtyBtn}
                        onClick={() => set(variant.id, (quantities[variant.id] ?? 0) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className={styles.footer}>
          <span className={styles.totalLabel}>
            {total} etiqueta{total !== 1 ? 's' : ''} · {Math.ceil(total / 12)} pág.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={exporting}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={total === 0 || exporting}
            >
              {exporting ? 'Generando...' : 'Generar PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrExportModal
