import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import type { ReactNode } from 'react'
import type { RowActions } from '../components/table/TableRowActions'
import type { TableRowActionType } from '../utility/global_interface'
import { formatPrice } from '../utility/format_price'

export const rowActions = (
  handleActions: (type: TableRowActionType, id: number) => void,
): RowActions[] => {
  return [
    {
      label: 'View',
      onClick: handleActions,
      type: 'view',
    },
    {
      label: 'Edit',
      onClick: handleActions,
      type: 'edit',
    },
    {
      label: 'Delete',
      onClick: handleActions,
      type: 'delete',
    },
  ]
}

export const columns = (
  renderActions: (params: GridRenderCellParams) => ReactNode,
): GridColDef[] => [
  {
    field: 'id',
    width: 50,
    headerName: 'ID',
  },
  {
    field: 'name',
    headerName: 'Nama Produk',
  },
  {
    field: 'stock_qty',
    headerName: 'Quantity',
  },
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: formatPrice,
  },
  {
    field: 'action',
    type: 'actions',
    headerName: 'Actions',
    width: 125,
    renderCell: (params) => renderActions(params),
  },
]
