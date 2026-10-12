import { useEffect, useState } from 'react'
import { useRawMaterialStore } from './store'
import Table from '../components/table/Table'
import { columns, rowActions } from './config'
import { useEffectSkipFirst, useRefresh } from '../utility/custom_hooks'
import { type GridRenderCellParams } from '@mui/x-data-grid'
import TableRowActions from '../components/table/TableRowActions'
import type { TableRowActionType } from '../utility/global_interface'
import {
  RawMaterialFormModal,
  type RawMaterialFormMode,
} from './components/RawMaterialFormModal'

type ModalState = { id?: number; mode: RawMaterialFormMode }

const RawMaterial = () => {
  const {
    rawMaterials = [],
    count,
    getRawMaterials,
    isLoading,
  } = useRawMaterialStore()
  const [page, setPage] = useState({ page: 0, pageSize: 10 })
  const [modal, setModal] = useState<ModalState | null>(null)

  const handleGetData = () => {
    const limit = page.pageSize
    const offset = page.page * page.pageSize

    getRawMaterials({
      limit,
      offset,
      sort: [{ by: 'id', order: 'DESC' }],
    })
  }

  const handleActions = (type: TableRowActionType, id: number) => {
    if (type === 'edit' || type === 'view') {
      setModal({ id, mode: type })
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

  useEffectSkipFirst(() => {
    handleGetData()
  }, [page])

  useRefresh({ handler: handleGetData })

  return (
    <>
      <Table
        columns={columns(renderActions)}
        handleClickPagination={setPage}
        loading={isLoading}
        pagination={page}
        rowCount={count}
        rows={rawMaterials}
        tableButtons={[
          {
            onClick: () => setModal({ mode: 'add' }),
            text: 'Tambah Data',
            type: 'add',
          },
        ]}
      />
      {modal && (
        <RawMaterialFormModal
          {...modal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}

export default RawMaterial
