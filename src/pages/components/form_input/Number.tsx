import { InputAdornment } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput } from '../../utility/global_interface'
import { Input } from '../input/Input'
import { DIGIT_REGEX } from '../../utility/regex'

type FormNumberInputProps = BaseFormInput & {
  fullWidth?: boolean
  inputMode?: 'decimal' | 'numeric'
  prefix?: string
}

const FormNumberInput = ({
  disabled,
  fullWidth,
  inputMode = 'decimal',
  label,
  name,
  prefix,
}: FormNumberInputProps) => {
  const { control } = useFormContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isNumber = DIGIT_REGEX.test(e.target.value)
    if (isNumber) return Number(e.target.value)
    return undefined
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          disabled={disabled}
          error={!!fieldState.error}
          fullWidth={fullWidth}
          helperText={fieldState.error?.message}
          label={label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            field.onChange(handleChange(e))
          }
          slotProps={{
            htmlInput: { inputMode },
            inputLabel: { shrink: true },
            input: prefix
              ? {
                  endAdornment: (
                    <InputAdornment position='start'>{prefix}</InputAdornment>
                  ),
                }
              : undefined,
          }}
          type='number'
        />
      )}
      rules={{ required: true }}
    />
  )
}

export default FormNumberInput
