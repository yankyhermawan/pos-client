import { Autocomplete } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput, Options } from '../../utility/global_interface'
import { Input } from '../input/Input'

type FormMultiAutoCompleteInputProps = BaseFormInput & {
  className?: string
  options: Options[]
}

// the form value is the list of selected option values
export const FormMultiAutoCompleteInput = ({
  className,
  disabled,
  label,
  name,
  options,
}: FormMultiAutoCompleteInputProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const values: (string | number)[] = field.value ?? []
        const selected = options.filter((opt) => values.includes(opt.value))
        return (
          <Autocomplete
            className={className}
            disabled={disabled}
            filterSelectedOptions
            getOptionDisabled={(opt) => opt.disabled}
            getOptionKey={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label ?? ''}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            multiple
            onChange={(_, opts) => field.onChange(opts.map((opt) => opt.value))}
            options={options}
            renderInput={(params) => (
              <Input
                {...params}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                label={label}
              />
            )}
            value={selected}
          />
        )
      }}
    />
  )
}
