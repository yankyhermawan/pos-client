import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import type { ReactNode } from 'react'
import type { RowActions } from '../components/table/TableRowActions'
import type { TableRowActionType } from '../utility/global_interface'

// the API has no delete and no detail endpoint for categories
export const rowActions = (
  handleActions: (type: TableRowActionType, id: number) => void,
): RowActions[] => [
  {
    label: 'Edit',
    onClick: handleActions,
    type: 'edit',
  },
]

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
    headerName: 'Nama Kategori',
  },
  {
    field: 'action',
    type: 'actions',
    headerName: 'Actions',
    width: 125,
    renderCell: (params) => renderActions(params),
  },
]
