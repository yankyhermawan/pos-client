import {
  GridActionsCell,
  GridActionsCellItem,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import type { TableRowActionType } from '../../utility/global_interface'
import { Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ViewIcon from '@mui/icons-material/Visibility'
import { Button } from '../button/Button'

export type RowActions = {
  label: string
  onClick: (type: TableRowActionType, id: number) => void
  type: TableRowActionType
}

type TableRowActionProps = GridRenderCellParams & {
  rowActions: RowActions[]
}

const TableRowActions = (params: TableRowActionProps) => {
  const { rowActions, ...props } = params

  if (rowActions.length <= 2) {
    const renderButtons = () =>
      rowActions.map((row, key) => {
        return (
          <Button
            color='primary'
            key={key}
            onClick={() => row.onClick(row.type, props.row.id)}
            size='small'
            variant='outlined'
          >
            {row.label}
          </Button>
        )
      })
    return <Box className='w-full flex justify-between'>{renderButtons()}</Box>
  }

  const getIcon = (type: TableRowActionType) => {
    if (type === 'delete') {
      return <DeleteIcon />
    }
    if (type === 'edit') {
      return <EditIcon />
    }
    return <ViewIcon />
  }

  const renderRowActions = () =>
    rowActions.map((row, key) => (
      <GridActionsCellItem
        icon={getIcon(row.type)}
        key={key}
        label={row.label}
        onClick={() => row.onClick(row.type, props.row.id)}
        showInMenu={key + 1 > 2}
      />
    ))

  return <GridActionsCell {...params}>{renderRowActions()}</GridActionsCell>
}

export default TableRowActions
