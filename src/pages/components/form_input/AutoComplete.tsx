import { Autocomplete, type UseAutocompleteProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput, Options } from '../../utility/global_interface'
import { Input } from '../input/Input'

type FormAutoCompleteInput = BaseFormInput & {
  className?: string
  options: UseAutocompleteProps<Options, false, false, false>['options']
}

export const FormAutoCompleteInput = ({
  className,
  disabled,
  label,
  name,
  options,
}: FormAutoCompleteInput) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected =
          options.find((opt) => opt.value === field.value) ?? null
        return (
          <Autocomplete
            className={className}
            disabled={disabled}
            getOptionDisabled={(opt) => opt.disabled}
            getOptionKey={(options) => options.value}
            getOptionLabel={(options) => (options.label ? options.label : '')}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            onChange={(_, opt) => {
              field.onChange(opt?.value ?? '')
            }}
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
      rules={{ required: true }}
    />
  )
}
