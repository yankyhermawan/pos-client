import { useEffect, useState } from 'react'
import { useCategoryStore } from './store'
import Table from '../components/table/Table'
import { columns, rowActions } from './config'
import { useRefresh } from '../utility/custom_hooks'
import { type GridRenderCellParams } from '@mui/x-data-grid'
import TableRowActions from '../components/table/TableRowActions'
import type { TableRowActionType } from '../utility/global_interface'
import { CategoryFormModal } from './components/CategoryFormModal'
import type { Category as CategoryType } from './interface'

type ModalState = { category?: CategoryType }

const Category = () => {
  const { categories = [], getCategories, isLoading } = useCategoryStore()
  const [page, setPage] = useState({ page: 0, pageSize: 10 })
  const [modal, setModal] = useState<ModalState | null>(null)

  const handleGetData = () => getCategories(false)()

  // the API returns every category at once, so paging happens here
  const rows = categories.slice(
    page.page * page.pageSize,
    (page.page + 1) * page.pageSize,
  )

  const handleActions = (type: TableRowActionType, id: number) => {
    if (type === 'edit') {
      setModal({ category: categories.find((dt) => dt.id === id) })
    }
  }

  const handleCloseModal = () => setModal(null)

  const handleSuccess = () => {
    handleCloseModal()
    handleGetData()
  }

  const renderActions = (params: GridRenderCellParams) => (
    <TableRowActions {...params} rowActions={rowActions(handleActions)} />
  )

  useEffect(() => {
    handleGetData()
  }, [])

  useRefresh({ handler: handleGetData })

  return (
    <>
      <Table
        columns={columns(renderActions)}
        handleClickPagination={setPage}
        loading={isLoading}
        pagination={page}
        rowCount={categories.length}
        rows={rows}
        tableButtons={[
          {
            onClick: () => setModal({}),
            text: 'Tambah Data',
            type: 'add',
          },
        ]}
      />
      {modal && (
        <CategoryFormModal
          {...modal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}

export default Category
