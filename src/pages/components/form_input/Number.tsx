import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput } from '../../utility/global_interface'
import { Input } from '../input/Input'

const FormNumberInput = ({ disabled, label, name }: BaseFormInput) => {
  const { control } = useFormContext()

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
          onChange={(e) => {
            field.onChange(
              Number(e.target.value) ? Number(e.target.value) : undefined,
            )
          }}
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
