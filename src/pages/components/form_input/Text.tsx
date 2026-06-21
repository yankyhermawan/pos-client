import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

const FormTextInput = ({ label, name }: { label: string, name: string }) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          label={label}
        />
      )}
      rules={{ required: true }}
    />
  )
}

export default FormTextInput