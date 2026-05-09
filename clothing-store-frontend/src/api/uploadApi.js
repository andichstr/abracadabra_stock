import axiosInstance from './axiosInstance'

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return axiosInstance.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
