import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput } from '../../utility/global_interface'
import { Input } from '../input/Input'

type FormTextInputProps = BaseFormInput & {
  fullWidth?: boolean
  type?: string
}

const FormTextInput = ({
  disabled,
  fullWidth,
  label,
  name,
  type = '',
}: FormTextInputProps) => {
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
          fullWidth={fullWidth}
          helperText={fieldState.error?.message}
          label={label}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          type={type}
        />
      )}
      rules={{ required: true }}
    />
  )
}

export default FormTextInput
