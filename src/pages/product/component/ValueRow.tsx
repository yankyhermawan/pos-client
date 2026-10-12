import { useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form'
import FormNumberInput from '../../components/form_input/Number'
import FormTextInput from '../../components/form_input/Text'
import { CompositionField } from './CompositionField'

type ValueRowProps = {
  disabled: boolean
  prefix: string
  showName?: boolean
}

export const ValueRow = ({
  disabled,
  prefix,
  showName = true,
}: ValueRowProps) => {
  const { control, setValue } = useFormContext()
  const compositions: unknown[] =
    useWatch({ control, name: `${prefix}.compositions` }) || []
  const hasCompositions = compositions.length > 0

  // stock and compositions are mutually exclusive, compositions win
  useEffect(() => {
    if (hasCompositions) {
      setValue(`${prefix}.qty`, 0)
    }
  }, [hasCompositions, prefix, setValue])

  return (
    <Stack
      direction={{ md: 'row', xs: 'column' }}
      spacing={2}
      sx={{ alignItems: 'flex-start', flex: 1, width: '100%' }}
    >
      <Box
        sx={{
          display: 'grid',
          flex: 1,
          gap: 2,
          gridTemplateColumns: {
            sm: showName
              ? 'minmax(0, 2fr) repeat(2, minmax(0, 1fr))'
              : 'repeat(2, minmax(0, 1fr))',
            xs: 'repeat(2, minmax(0, 1fr))',
          },
          width: '100%',
        }}
      >
        {showName && (
          <Box sx={{ gridColumn: { sm: 'auto', xs: '1 / -1' } }}>
            <FormTextInput
              disabled={disabled}
              fullWidth
              label='Value'
              name={`${prefix}.value`}
            />
          </Box>
        )}
        <FormNumberInput
          disabled={disabled}
          fullWidth
          label='Harga'
          name={`${prefix}.price`}
        />
        <FormNumberInput
          disabled={disabled || hasCompositions}
          fullWidth
          inputMode='numeric'
          label='Stok'
          name={`${prefix}.qty`}
        />
      </Box>
      <Stack spacing={1} sx={{ flex: 1, width: '100%' }}>
        <Typography color='text.secondary' variant='subtitle2'>
          Komposisi (menggantikan stok)
        </Typography>
        <CompositionField disabled={disabled} name={`${prefix}.compositions`} />
      </Stack>
    </Stack>
  )
}
