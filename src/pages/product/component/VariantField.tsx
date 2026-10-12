import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import Delete from '@mui/icons-material/Delete'
import { Button } from '../../components/button/Button'
import { Card } from '../../components/card/Card'
import FormNumberInput from '../../components/form_input/Number'
import FormTextInput from '../../components/form_input/Text'
import { isSimpleVariants } from '../helpers'
import {
  emptyValueForm,
  emptyVariantForm,
  type ProductFormInput,
} from '../interface'
import { ValueRow } from './ValueRow'
import { flatCardSx, responsiveButtonSx } from './styles'

type VariantFieldProps = {
  disabled: boolean
}

type VariantValuesProps = VariantFieldProps & {
  index: number
}

const VariantValues = ({ disabled, index }: VariantValuesProps) => {
  const { control } = useFormContext()
  const variantName: string = useWatch({
    control,
    name: `variants.${index}.name`,
  })
  const { append, fields, remove } = useFieldArray({
    control,
    name: `variants.${index}.values`,
    keyName: 'fieldId',
  })

  return (
    <Stack spacing={2}>
      {fields.map((field, idx) => (
        <Stack key={field.fieldId} spacing={1.5}>
          {idx > 0 && <Divider />}
          <Stack
            direction='row'
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography color='text.secondary' variant='subtitle2'>
              {variantName?.trim() || 'Value'} {idx + 1}
            </Typography>
            {!disabled && fields.length > 1 && (
              <IconButton
                aria-label='Hapus value'
                color='error'
                onClick={() => remove(idx)}
                size='large'
              >
                <Delete />
              </IconButton>
            )}
          </Stack>
          <ValueRow
            disabled={disabled}
            prefix={`variants.${index}.values.${idx}`}
          />
        </Stack>
      ))}
      <Button
        disabled={disabled}
        onClick={() => append(emptyValueForm)}
        sx={responsiveButtonSx}
        type='button'
        variant='outlined'
      >
        Tambah Value
      </Button>
    </Stack>
  )
}

export const VariantField = ({ disabled }: VariantFieldProps) => {
  const { control } = useFormContext()
  const variants: NonNullable<ProductFormInput['variants']> =
    useWatch({ control, name: 'variants' }) || []
  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: 'variants',
    keyName: 'fieldId',
  })
  const isSimple = isSimpleVariants(variants)

  const handleAddVariant = () => {
    // an unsaved default variant is only a placeholder, so it gets replaced
    if (isSimple && !variants[0].id) {
      replace(emptyVariantForm)
      return
    }
    append(emptyVariantForm)
  }

  const addButton = (
    <Button
      disabled={disabled}
      onClick={handleAddVariant}
      sx={responsiveButtonSx}
      type='button'
      variant='contained'
    >
      Tambah Varian
    </Button>
  )

  if (isSimple) {
    return (
      <Stack spacing={2}>
        <ValueRow
          disabled={disabled}
          prefix='variants.0.values.0'
          showName={false}
        />
        {addButton}
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      {fields.map((field, idx) => (
        <Card
          key={field.fieldId}
          sx={flatCardSx}
          title={variants[idx]?.name || `Varian ${idx + 1}`}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                alignItems: 'start',
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: {
                  sm: 'minmax(0, 2fr) repeat(2, minmax(0, 1fr)) auto',
                  xs: 'repeat(2, minmax(0, 1fr)) auto',
                },
              }}
            >
              <Box sx={{ gridColumn: { sm: 'auto', xs: '1 / -1' } }}>
                <FormTextInput
                  disabled={disabled}
                  fullWidth
                  label='Nama Varian'
                  name={`variants.${idx}.name`}
                />
              </Box>
              <FormNumberInput
                disabled={disabled}
                fullWidth
                inputMode='numeric'
                label='Min. Pilihan'
                name={`variants.${idx}.min_selected`}
              />
              <FormNumberInput
                disabled={disabled}
                fullWidth
                inputMode='numeric'
                label='Maks. Pilihan'
                name={`variants.${idx}.max_selected`}
              />
              {!disabled && fields.length > 1 && (
                <IconButton
                  aria-label='Hapus varian'
                  color='error'
                  onClick={() => remove(idx)}
                  size='large'
                  sx={{ mt: 0.5 }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            <Typography color='text.secondary' variant='caption'>
              Min. Pilihan 0 = opsional, 1 atau lebih = wajib dipilih
            </Typography>
            <VariantValues disabled={disabled} index={idx} />
          </Stack>
        </Card>
      ))}
      {addButton}
    </Stack>
  )
}
