import { Button as MuiButton, type ButtonProps } from '@mui/material'

export const Button = (params: ButtonProps) => {
  const { sx, ...props } = params
  const baseStyle = {
    maxWidth: 'fit-content',
    '&.Mui-disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'unset',
    },
  }
  const merged = {
    ...baseStyle,
    ...sx,
  }
  return <MuiButton {...props} sx={merged} />
}
