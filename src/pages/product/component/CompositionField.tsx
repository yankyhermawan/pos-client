import { Box, IconButton, Stack } from '@mui/material'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import FormNumberInput from '../../components/form_input/Number'
import { FormAutoCompleteInput } from '../../components/form_input/AutoComplete'
import { useBpspParam } from '../../bpsp/store'
import { useRawMaterialStore } from '../../raw_material/store'
import { getOptions } from '../../utility/get_options'
import Delete from '@mui/icons-material/Delete'
import { Button } from '../../components/button/Button'
import type { Composition } from '../interface'
import { responsiveButtonSx } from './styles'

type CompositionFieldProps = {
  disabled: boolean
  name: string
}

export const CompositionField = ({ disabled, name }: CompositionFieldProps) => {
  const { control } = useFormContext()
  const { bpsps } = useBpspParam()
  const { rawMaterials } = useRawMaterialStore()
  const compositions: Composition[] =
    useWatch({
      control,
      name,
    }) || []
  const { append, fields, remove } = useFieldArray({
    control,
    name,
    keyName: 'fieldId',
  })

  const bpspOptions = getOptions({
    selectedValues: compositions
      .map((dt) => dt.bpsp_id)
      .filter((dt) => typeof dt === 'number'),
    label: 'name',
    options: bpsps,
    value: 'id',
  })
  const rawMaterialOptions = getOptions({
    selectedValues: compositions
      .map((dt) => dt.raw_material_id)
      .filter((dt) => typeof dt === 'number'),
    label: 'name',
    options: rawMaterials,
    value: 'id',
  })

  const handleAddNewField = (source: Composition['source']) =>
    append({
      bpsp_id: null,
      qty: 0,
      raw_material_id: null,
      source,
    })

  const getUnit = (idx: number) => {
    const { bpsp_id, raw_material_id, source } = compositions[idx] ?? {}
    if (source === 'raw_material') {
      return rawMaterials.find((dt) => dt.id === raw_material_id)
        ?.unit_measurement.value
    }
    return bpsps.find((dt) => dt.id === bpsp_id)?.unit_measurement.value
  }

  const renderSource = (idx: number) => {
    if (compositions[idx]?.source === 'raw_material') {
      return (
        <FormAutoCompleteInput
          disabled={disabled}
          label='Bahan Baku'
          name={`${name}.${idx}.raw_material_id`}
          options={rawMaterialOptions}
        />
      )
    }
    return (
      <FormAutoCompleteInput
        disabled={disabled}
        label='Bpsp'
        name={`${name}.${idx}.bpsp_id`}
        options={bpspOptions}
      />
    )
  }

  const renderField = () =>
    fields.map((field, idx) => {
      return (
        <Box
          key={field.fieldId}
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              sm: 'minmax(0, 1fr) minmax(0, 1fr) auto',
              xs: 'minmax(0, 1fr) auto',
            },
          }}
        >
          <Box sx={{ gridColumn: { sm: 'auto', xs: '1 / -1' } }}>
            {renderSource(idx)}
          </Box>
          <FormNumberInput
            disabled={disabled}
            fullWidth
            inputMode='numeric'
            label='Quantity'
            name={`${name}.${idx}.qty`}
            prefix={getUnit(idx)}
          />
          {!disabled && (
            <IconButton
              aria-label='Hapus komposisi'
              color='error'
              onClick={() => remove(idx)}
              size='large'
              sx={{ mt: 0.5 }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      )
    })

  return (
    <Stack direction='column' spacing={2}>
      {renderField()}
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2}>
        <Button
          disabled={disabled}
          onClick={() => handleAddNewField('bpsp')}
          sx={responsiveButtonSx}
          type='button'
          variant='contained'
        >
          Tambah BPSP
        </Button>
        <Button
          disabled={disabled}
          onClick={() => handleAddNewField('raw_material')}
          sx={responsiveButtonSx}
          type='button'
          variant='contained'
        >
          Tambah Bahan Baku
        </Button>
      </Stack>
    </Stack>
  )
}
