import axiosInstance from './axiosInstance'

export const getSales = (filters = {}) => {
  const params = {}
  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo) params.dateTo = filters.dateTo
  if (filters.amountMin !== undefined && filters.amountMin !== '') params.amountMin = filters.amountMin
  if (filters.amountMax !== undefined && filters.amountMax !== '') params.amountMax = filters.amountMax
  return axiosInstance.get('/sales', { params })
}

export const getSaleById = (id) => axiosInstance.get(`/sales/${id}`)

export const createSale = (data) => axiosInstance.post('/sales', data)
