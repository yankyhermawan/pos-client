import { useEffect, useState } from 'react'
import { useProductStore } from './store'
import Table from '../components/table/Table'
import { columns, rowActions } from './config'
import { useEffectSkipFirst } from '../utility/custom_hooks'
import type { Product } from './interface'
import { type GridRenderCellParams } from '@mui/x-data-grid'
import TableRowActions from '../components/table/TableRowActions'
import { useNavigate } from 'react-router-dom'
import type { TableRowActionType } from '../utility/global_interface'

const Product = () => {
  const { count, getProducts, isLoading, products = [] } = useProductStore()
  const [page, setPage] = useState({ page: 0, pageSize: 10 })
  const navigate = useNavigate()

  const handleGetData = () => {
    const limit = page.pageSize
    const offset = page.page * page.pageSize

    getProducts({
      limit,
      offset,
      sort: [{ by: 'id', order: 'DESC' }],
      store_id: 1,
    })
  }

  const handleActions = (type: TableRowActionType, id: number) => {
    if (type === 'edit') {
      navigate(`/product/edit/${id}`)
    }

    if (type === 'view') {
      navigate(`/product/view/${id}`)
    }
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

  return (
    <Table
      columns={columns(renderActions)}
      handleClickPagination={setPage}
      loading={isLoading}
      pagination={page}
      rowCount={count}
      rows={products}
    />
  )
}

export default Product
