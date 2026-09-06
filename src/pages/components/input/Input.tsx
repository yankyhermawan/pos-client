import { TextField, type TextFieldProps } from '@mui/material'

export const Input = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      sx={{
        '& .MuiInputBase-root.Mui-disabled .MuiInputBase-input': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
        },
      }}
    />
  )
}
