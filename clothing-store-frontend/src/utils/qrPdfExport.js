import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import logoUrl from '../assets/logo.jpg'

// A4 layout — 3 columns × 4 rows = 12 labels per page
const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 10
const COLS = 3
const ROWS = 4
const COL_GAP = 5
const ROW_GAP = 5
const LABEL_W = (PAGE_W - 2 * MARGIN - (COLS - 1) * COL_GAP) / COLS  // 60mm
const LABEL_H = (PAGE_H - 2 * MARGIN - (ROWS - 1) * ROW_GAP) / ROWS  // 64.25mm
const PADDING = 4

// Within each label
const LOGO_Y = 3
const LOGO_H = 11
const QR_Y = LOGO_Y + LOGO_H + 3
const QR_SIZE = 36
const NAME_Y = QR_Y + QR_SIZE + 3
const LABEL_Y = NAME_Y + 4.5

async function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg'))
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * @param {Array<{qrCode: string, size: string, color: string, productName: string, quantity: number}>} variantItems
 */
export async function exportQrPdf(variantItems) {
  const logoBase64 = await imageToBase64(logoUrl)

  // Expand: one entry per physical label to print
  const labels = variantItems.flatMap((item) =>
    Array.from({ length: item.quantity }, () => item)
  )
  if (labels.length === 0) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const labelsPerPage = COLS * ROWS

  for (let i = 0; i < labels.length; i++) {
    if (i > 0 && i % labelsPerPage === 0) doc.addPage()

    const pos = i % labelsPerPage
    const col = pos % COLS
    const row = Math.floor(pos / COLS)

    const x = MARGIN + col * (LABEL_W + COL_GAP)
    const y = MARGIN + row * (LABEL_H + ROW_GAP)

    // Dashed cut guide
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.setLineDashPattern([1, 1], 0)
    doc.rect(x, y, LABEL_W, LABEL_H)
    doc.setLineDashPattern([], 0)

    // Logo centered
    const logoW = LABEL_W - 2 * PADDING
    doc.addImage(logoBase64, 'JPEG', x + PADDING, y + LOGO_Y, logoW, LOGO_H, undefined, 'FAST')

    // QR code centered
    const qrDataUrl = await QRCode.toDataURL(labels[i].qrCode, {
      width: 280,
      margin: 1,
      color: { dark: '#4a2244', light: '#ffffff' },
    })
    const qrX = x + (LABEL_W - QR_SIZE) / 2
    doc.addImage(qrDataUrl, 'PNG', qrX, y + QR_Y, QR_SIZE, QR_SIZE)

    // Product name
    const cx = x + LABEL_W / 2
    doc.setFontSize(7)
    doc.setTextColor(74, 34, 68)
    doc.setFont(undefined, 'bold')
    doc.text(labels[i].productName, cx, y + NAME_Y, { align: 'center', maxWidth: LABEL_W - 2 * PADDING })
    doc.setFont(undefined, 'normal')

    // Size / color label
    const label = [labels[i].size, labels[i].color].filter(Boolean).join(' / ')
    doc.setFontSize(7)
    doc.setTextColor(120, 80, 110)
    doc.text(label, cx, y + LABEL_Y, { align: 'center' })
  }

  doc.save('etiquetas-qr-abracadabra.pdf')
}
