import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import styles from './QRScanner.module.css'

// Frames consecutivos sin QR antes de desbloquear el código actual
const MISS_THRESHOLD = 5

function QRScanner({ onScan }) {
  const scannerRef = useRef(null)
  const lockedQrRef = useRef(null)   // QR actualmente bloqueado
  const missCountRef = useRef(0)     // frames consecutivos sin detectar QR
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!active) return

    lockedQrRef.current = null
    missCountRef.current = 0

    const html5QrCode = new Html5Qrcode('qr-reader')
    scannerRef.current = html5QrCode

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        missCountRef.current = 0
        if (lockedQrRef.current === decodedText) return
        lockedQrRef.current = decodedText
        onScan(decodedText)
      },
      () => {
        missCountRef.current++
        if (missCountRef.current >= MISS_THRESHOLD) {
          lockedQrRef.current = null
          missCountRef.current = 0
        }
      }
    ).catch(() => {
      setError('No se pudo acceder a la cámara. Verificá los permisos.')
      setActive(false)
    })

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [active])

  const toggle = () => {
    if (active && scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
      scannerRef.current = null
    }
    setError('')
    setActive((prev) => !prev)
  }

  return (
    <div className={styles.scanner}>
      <button className={`btn ${active ? 'btn-danger' : 'btn-primary'}`} onClick={toggle}>
        {active ? 'Apagar cámara' : 'Escanear QR'}
      </button>
      {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}
      <div
        id="qr-reader"
        className={styles.reader}
        style={{ display: active ? 'block' : 'none' }}
      />
    </div>
  )
}

export default QRScanner
