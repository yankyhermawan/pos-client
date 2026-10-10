import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput } from '../../utility/global_interface'
import { Input } from '../input/Input'
import { DIGIT_REGEX } from '../../utility/regex'

const FormNumberInput = ({ disabled, label, name }: BaseFormInput) => {
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
          helperText={fieldState.error?.message}
          label={label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            field.onChange(handleChange(e))
          }
          slotProps={{
            inputLabel: { shrink: true },
          }}
          type='number'
        />
      )}
      rules={{ required: true }}
    />
  )
}

export default FormNumberInput
