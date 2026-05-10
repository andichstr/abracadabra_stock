import { useState, useEffect } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { getSalesTodayByCategory, getSalesMonthByCategory, getSalesDaily } from '../api/statsApi'
import styles from './Dashboard.module.css'

const PALETTE = ['#FF8C42', '#FF6B9D', '#FFA552', '#F7629E', '#FFD1A9', '#FFB3D0', '#E8600A', '#FF9EC4']

const fmt = (v) => `$${Number(v).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`

function fillDailyGaps(data, days) {
  const map = Object.fromEntries(data.map((d) => [d.date, d]))
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().slice(0, 10)
    return map[key] ?? { date: key, totalAmount: 0, saleCount: 0 }
  })
}

function formatDayLabel(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${d}/${m}`
}

function SalesPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalAmount"
          nameKey="categoryName"
          cx="50%"
          cy="45%"
          outerRadius={85}
          label={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [fmt(value), name]}
          contentStyle={{ borderRadius: 8, border: '1px solid #FFE0CC', fontSize: 13 }}
        />
        <Legend
          formatter={(value) => <span style={{ fontSize: 12, color: '#8B3A00' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function SalesBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#FFE0CC" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDayLabel}
          tick={{ fontSize: 11, fill: '#A07855' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => (v === 0 ? '0' : `$${(v / 1000).toFixed(0)}k`)}
          tick={{ fontSize: 11, fill: '#A07855' }}
          width={48}
        />
        <Tooltip
          formatter={(value) => [fmt(value), 'Total']}
          labelFormatter={(label) => {
            const [y, m, d] = label.split('-')
            return `${d}/${m}/${y}`
          }}
          contentStyle={{ borderRadius: 8, border: '1px solid #FFE0CC', fontSize: 13 }}
        />
        <Bar dataKey="totalAmount" fill="#FF8C42" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function ChartCard({ title, subtitle, wide, children }) {
  return (
    <div className={`${styles.card} ${wide ? styles.cardWide : ''}`}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      {children}
    </div>
  )
}

function EmptyState({ text }) {
  return <p className={styles.empty}>{text}</p>
}

function SummaryBadge({ data }) {
  const total = data.reduce((s, d) => s + Number(d.totalAmount), 0)
  const count = data.reduce((s, d) => s + Number(d.saleCount), 0)
  if (total === 0) return null
  return (
    <p className={styles.summary}>
      {fmt(total)} · {count} venta{count !== 1 ? 's' : ''}
    </p>
  )
}

export default function Dashboard() {
  const [today, setToday] = useState([])
  const [month, setMonth] = useState([])
  const [daily, setDaily] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSalesTodayByCategory().then(({ data }) => setToday(data)),
      getSalesMonthByCategory().then(({ data }) => setMonth(data)),
      getSalesDaily(30).then(({ data }) => setDaily(data)),
    ]).finally(() => setLoading(false))
  }, [])

  const filledDaily = fillDailyGaps(daily, 30)
  const hasDaily = daily.some((d) => Number(d.totalAmount) > 0)

  if (loading) return <p className="loading">Cargando...</p>

  return (
    <div>
      <h1 className="page-title">Inicio</h1>

      <div className={styles.grid}>
        <ChartCard title="Ventas de hoy" subtitle="Por categoría">
          <SummaryBadge data={today} />
          {today.length === 0
            ? <EmptyState text="Sin ventas registradas hoy." />
            : <SalesPie data={today} />}
        </ChartCard>

        <ChartCard title="Ventas del mes" subtitle="Por categoría">
          <SummaryBadge data={month} />
          {month.length === 0
            ? <EmptyState text="Sin ventas registradas este mes." />
            : <SalesPie data={month} />}
        </ChartCard>

        <ChartCard title="Últimos 30 días" subtitle="Monto total de ventas por día" wide>
          {!hasDaily
            ? <EmptyState text="Sin ventas en los últimos 30 días." />
            : <SalesBar data={filledDaily} />}
        </ChartCard>
      </div>
    </div>
  )
}
