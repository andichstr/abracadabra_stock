import { useState, useEffect, useRef } from 'react'
import { createProduct } from '../api/productApi'
import { getCategories } from '../api/categoryApi'
import { uploadImage } from '../api/uploadApi'
import styles from './ProductFormModal.module.css'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const EMPTY_FORM = {
  name: '',
  costPrice: '',
  salePrice: '',
  categoryId: '',
}

let colorIdCounter = 1

function ProductFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cameraColorId, setCameraColorId] = useState(null)
  const [colors, setColors] = useState([{ id: colorIdCounter++, name: '' }])
  const [grid, setGrid] = useState({})
  const [colorImages, setColorImages] = useState({}) // colorId → imageUrl
  const [uploadingColorId, setUploadingColorId] = useState(null)

  const colorFileRef = useRef(null)
  const uploadingColorIdRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (cameraColorId !== null && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraColorId])

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  // ── Variant grid ──────────────────────────────────────────────────────────

  const addColor = () => {
    setColors((c) => [...c, { id: colorIdCounter++, name: '' }])
  }

  const updateColorName = (id, name) => {
    setColors((c) => c.map((col) => (col.id === id ? { ...col, name } : col)))
  }

  const removeColor = (id) => {
    setColors((c) => c.filter((col) => col.id !== id))
    setGrid((g) => {
      const next = { ...g }
      SIZES.forEach((s) => delete next[`${s}-${id}`])
      return next
    })
    setColorImages((imgs) => {
      const next = { ...imgs }
      delete next[id]
      return next
    })
  }

  const setCell = (size, colorId, value) => {
    setGrid((g) => ({ ...g, [`${size}-${colorId}`]: value }))
  }

  const buildVariants = () => {
    const variants = []
    for (const size of SIZES) {
      for (const col of colors) {
        if (!col.name.trim()) continue
        const val = grid[`${size}-${col.id}`]
        if (val === undefined || val === '') continue
        variants.push({
          size,
          color: col.name.trim(),
          stockQuantity: parseInt(val) || 0,
          imageUrl: colorImages[col.id] || null,
        })
      }
    }
    return variants
  }

  // ── Color image upload ────────────────────────────────────────────────────

  const handleColorImageClick = (colorId) => {
    uploadingColorIdRef.current = colorId
    setUploadingColorId(colorId)
    colorFileRef.current.value = ''
    colorFileRef.current.click()
  }

  const handleColorImageFile = async (e) => {
    const file = e.target.files[0]
    const colorId = uploadingColorIdRef.current
    setUploadingColorId(null)
    uploadingColorIdRef.current = null
    if (!file || colorId === null) return
    try {
      const { data } = await uploadImage(file)
      setColorImages((imgs) => ({ ...imgs, [colorId]: data.imageUrl }))
    } catch {
      setError('Error al subir la imagen del color.')
    } finally {
      e.target.value = ''
    }
  }

  // ── Color camera ──────────────────────────────────────────────────────────

  const openColorCamera = async (colorId) => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraColorId(colorId)
    } catch {
      setError('No se pudo acceder a la cámara. Verificá los permisos del navegador.')
    }
  }

  const closeColorCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraColorId(null)
  }

  const captureColorPhoto = async () => {
    const colorId = cameraColorId
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    closeColorCamera()
    setUploadingColorId(colorId)
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      const { data } = await uploadImage(file)
      setColorImages((imgs) => ({ ...imgs, [colorId]: data.imageUrl }))
    } catch {
      setError('Error al subir la imagen.')
    } finally {
      setUploadingColorId(null)
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (!form.salePrice || isNaN(form.salePrice)) return setError('El precio de venta es obligatorio.')
    if (!form.costPrice || isNaN(form.costPrice)) return setError('El precio de costo es obligatorio.')

    const variants = buildVariants()
    if (variants.length === 0) return setError('Agregá al menos una variante con talle y color.')

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        costPrice: parseFloat(form.costPrice),
        salePrice: parseFloat(form.salePrice),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        variants,
      }
      const { data } = await createProduct(payload)
      onCreated(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el producto.')
    } finally {
      setLoading(false)
    }
  }

  const namedColors = colors.filter((c) => c.name.trim())

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

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Precio de costo *</label>
              <input type="number" min="0" step="0.01" value={form.costPrice} onChange={handle('costPrice')} placeholder="0.00" />
            </div>
            <div className={styles.field}>
              <label>Precio de venta *</label>
              <input type="number" min="0" step="0.01" value={form.salePrice} onChange={handle('salePrice')} placeholder="0.00" />
            </div>
          </div>

          {/* ── Variant grid ── */}
          <div className={styles.field}>
            <label>Stock por talle y color *</label>
            <div className={styles.variantGrid}>
              {/* Hidden file input reused for all color image uploads */}
              <input
                ref={colorFileRef}
                type="file"
                accept="image/*"
                onChange={handleColorImageFile}
                style={{ display: 'none' }}
              />
              <div className={styles.tableWrapper}>
                <table className={styles.variantTable}>
                  <thead>
                    <tr>
                      <th className={styles.sizeHeader}>Talle</th>
                      {colors.map((col) => (
                        <th key={col.id} className={styles.colorHeader}>
                          <div className={styles.colorNameRow}>
                            <input
                              className={styles.colorInput}
                              value={col.name}
                              onChange={(e) => updateColorName(col.id, e.target.value)}
                              placeholder="Color"
                            />
                            {colors.length > 1 && (
                              <button
                                type="button"
                                className={styles.removeColorBtn}
                                onClick={() => removeColor(col.id)}
                                title="Quitar color"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th>
                        <button type="button" className={styles.addColorBtn} onClick={addColor}>
                          + Color
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZES.map((size) => (
                      <tr key={size}>
                        <td className={styles.sizeCell}>{size}</td>
                        {colors.map((col) => (
                          <td key={col.id} className={styles.stockCell}>
                            <input
                              type="number"
                              min="0"
                              className={styles.stockInput}
                              value={grid[`${size}-${col.id}`] ?? ''}
                              onChange={(e) => setCell(size, col.id, e.target.value)}
                              placeholder="—"
                              disabled={!col.name.trim()}
                            />
                          </td>
                        ))}
                        <td />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.variantHint}>
                Dejá una celda vacía si esa combinación no existe. Solo se guardan las celdas con valor.
              </p>
            </div>
          </div>

          {/* ── Fotos por color ── */}
          {namedColors.length > 0 && (
            <div className={styles.field}>
              <label>Fotos por color</label>
              <div className={styles.colorPhotoList}>
                {namedColors.map((col) => (
                  <div key={col.id} className={styles.colorPhotoRow}>
                    <span className={styles.colorPhotoName}>{col.name}</span>
                    {colorImages[col.id] ? (
                      <div className={styles.colorPhotoPreviewWrap}>
                        <a href={colorImages[col.id]} target="_blank" rel="noreferrer">
                          <img src={colorImages[col.id]} alt={col.name} className={styles.colorPhotoPreview} />
                        </a>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setColorImages((imgs) => { const n = { ...imgs }; delete n[col.id]; return n })}
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <div className={styles.colorPhotoButtons}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleColorImageClick(col.id)}
                          disabled={uploadingColorId !== null}
                        >
                          {uploadingColorId === col.id ? 'Subiendo...' : 'Elegir archivo'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => openColorCamera(col.id)}
                          disabled={uploadingColorId !== null}
                        >
                          Sacar foto
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {cameraColorId !== null && (
                  <div className={styles.cameraOverlay}>
                    <video ref={videoRef} autoPlay playsInline className={styles.cameraVideo} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className={styles.cameraControls}>
                      <button type="button" className="btn btn-primary" onClick={captureColorPhoto}>Capturar</button>
                      <button type="button" className="btn btn-secondary" onClick={closeColorCamera}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
