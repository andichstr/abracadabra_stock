import axiosInstance from './axiosInstance'

export const getProducts = (filters = {}) => {
  const params = {}
  if (filters.categoryId) params.categoryId = filters.categoryId
  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo) params.dateTo = filters.dateTo
  if (filters.priceMin !== undefined && filters.priceMin !== '') params.priceMin = filters.priceMin
  if (filters.priceMax !== undefined && filters.priceMax !== '') params.priceMax = filters.priceMax
  if (filters.size) params.size = filters.size
  if (filters.color) params.color = filters.color
  return axiosInstance.get('/products', { params })
}

export const getProductById = (id) => axiosInstance.get(`/products/${id}`)

export const getProductByQr = (qrCode) => axiosInstance.get(`/products/qr/${qrCode}`)

export const createProduct = (data) => axiosInstance.post('/products', data)

export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data)

export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`)
