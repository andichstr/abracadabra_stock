import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Stock from './pages/Stock'
import StockDetail from './pages/StockDetail'
import SalesHistory from './pages/SalesHistory'
import SaleDetail from './pages/SaleDetail'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/:id" element={<StockDetail />} />
          <Route path="/sales" element={<SalesHistory />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
