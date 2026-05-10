import styles from './Pagination.module.css'

function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className={styles.container}>
      <span className={styles.info}>
        {totalElements} resultado{totalElements !== 1 ? 's' : ''}
      </span>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          title="Primera página"
        >
          «
        </button>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          title="Página anterior"
        >
          ‹
        </button>

        <span className={styles.pages}>
          {page + 1} <span className={styles.separator}>de</span> {totalPages}
        </span>

        <button
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages - 1}
          title="Página siguiente"
        >
          ›
        </button>
        <button
          className={styles.btn}
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
          title="Última página"
        >
          »
        </button>
      </div>
    </div>
  )
}

export default Pagination
