import { useState, useCallback } from 'react'

export function usePagination(defaultPageSize = 20) {
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const applyResponse = useCallback((data) => {
    setTotalPages(data.totalPages)
    setTotalElements(data.totalElements)
  }, [])

  return { page, setPage, totalPages, totalElements, pageSize: defaultPageSize, applyResponse }
}
