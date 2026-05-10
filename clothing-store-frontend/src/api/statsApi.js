import axiosInstance from './axiosInstance'

export const getSalesTodayByCategory  = () => axiosInstance.get('/stats/sales/today-by-category')
export const getSalesMonthByCategory  = () => axiosInstance.get('/stats/sales/month-by-category')
export const getSalesDaily            = (days = 30) => axiosInstance.get('/stats/sales/daily', { params: { days } })
