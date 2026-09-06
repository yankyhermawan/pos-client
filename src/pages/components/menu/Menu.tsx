import * as React from 'react'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Button } from '../button/Button'

type MenuProps = {
  label: React.ReactNode
  options: {
    label: string
    onClick: () => void
  }[]
}

export default function Menu(props: MenuProps) {
  const { label, options } = props
  const id = React.useId()
  const buttonId = `${id}-button`
  const menuId = `${id}-menu`
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const renderOptions = () =>
    options.map((opt, key) => {
      const handleClickLabel = () => {
        opt.onClick()
        handleClose()
      }
      return (
        <MenuItem className='min-w-16' key={key} onClick={handleClickLabel}>
          {opt.label}
        </MenuItem>
      )
    })

  return (
    <div>
      <Button
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup='true'
        aria-expanded={open}
        onClick={handleClick}
        sx={{
          minWidth: 'unset',
          padding: 0,
        }}
      >
        {label}
      </Button>
      <MuiMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': buttonId,
          },
        }}
      >
        {renderOptions()}
      </MuiMenu>
    </div>
  )
}
