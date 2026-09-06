import {
  DataGrid,
  type GridCallbackDetails,
  type GridColDef,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { Container } from '@mui/material'

type Rows = {
  [x: string]: string | number | object
}

type PaginationModel = {
  page: number
  pageSize: number
}

type TableProps = {
  columns: GridColDef[]
  handleClickPagination: (
    model: GridPaginationModel,
    details: GridCallbackDetails<'pagination'>,
  ) => void
  loading?: boolean
  pagination: PaginationModel
  rowCount: number
  rows: Rows[]
}

const Table = ({
  columns,
  loading,
  handleClickPagination,
  pagination,
  rowCount,
  rows,
}: TableProps) => {
  const getColumnWidth = ({
    calculatedWidth,
    idx,
    isAction,
    totalCol,
    width,
  }: {
    calculatedWidth: number
    idx: number
    isAction: boolean
    totalCol: number
    width: number
  }): {
    minWidth: GridColDef['minWidth']
    width: GridColDef['width']
  } => {
    if (idx === 0) {
      return {
        minWidth: 0,
        width: 50,
      }
    }
    if (idx + 1 === totalCol && isAction) {
      return {
        minWidth: 0,
        width: 150,
      }
    }
    if (width > 0) {
      return {
        minWidth: 0,
        width,
      }
    }
    return {
      minWidth: 200,
      width: calculatedWidth,
    }
  }

  const renderColumns = (): GridColDef[] => {
    const totalCol = columns.length
    const widthExist = columns.filter(
      (dt, key) =>
        dt.width && dt.width > 0 && key !== 0 && key + 1 !== totalCol,
    )
    const totalWidthExist = widthExist.reduce(
      (sum, n) => sum + (n.width || 0),
      0,
    )
    const totalAutoWidth =
      (1150 - totalWidthExist - 50 - 150) / (totalCol - 2 - widthExist.length)
    return columns.map((col, key) => ({
      ...col,
      ...getColumnWidth({
        calculatedWidth: totalAutoWidth,
        idx: key,
        isAction: col.field === 'action',
        totalCol,
        width: col.width || 0,
      }),
      headerAlign: 'center',
    }))
  }

  return (
    <Container>
      <Paper>
        <DataGrid
          columns={renderColumns()}
          disableColumnFilter
          disableColumnSorting
          disableColumnSelector
          initialState={{ pagination: { paginationModel: pagination } }}
          loading={loading}
          onPaginationModelChange={handleClickPagination}
          paginationModel={pagination}
          rows={rows}
          rowCount={rowCount}
          showCellVerticalBorder
          showColumnVerticalBorder
          sx={{
            '& .MuiDataGrid-cell': {
              borderColor: '#e0e0e0', // Inner cell border color
            },
            '& .MuiDataGrid-columnHeader': {
              borderColor: '#e0e0e0', // Header border color
            },
          }}
          paginationMode='server'
        />
      </Paper>
    </Container>
  )
}

export default Table
