import { InputLabel, MenuItem, Select as MuiSelect } from '@mui/material'

type SelectProps = {
  disabled?: boolean
  label: string
  onChange: (e: string | number | null) => void
  options: {
    label: string
    value: string | number
  }[]
  value: string | number | null
}

const Select = (props: SelectProps) => {
  const { disabled, label, onChange, options, value } = props

  const mapOptions = () =>
    options.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))

  return (
    <>
      <InputLabel
        id={`${label}-label`}
        sx={{
          color: 'text.primary',
          '& .Mui-focused': {
            color: 'text.primary',
          },
        }}
      >
        {label}
      </InputLabel>
      <MuiSelect
        disabled={disabled}
        labelId={`${label}-label`}
        id={`${label}-id`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        sx={{
          backgroundColor: 'background.default',
          width: '100%',
          '&.Mui-focused': {
            backgroundColor: 'background.default',
          },
          '&:hover': {
            backgroundColor: 'background.default',
          },
          '&.Mui-disabled .MuiSelect-select': {
            backgroundColor: 'background.default',
            cursor: 'not-allowed',
            pointerEvents: 'unset',
          },
        }}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {mapOptions()}
      </MuiSelect>
    </>
  )
}

export default Select
