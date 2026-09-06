import { Stack } from '@mui/material'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import FormNumberInput from '../../components/form_input/Number'
import { FormAutoCompleteInput } from '../../components/form_input/AutoComplete'
import type { Bpsp } from '../../bpsp/interface'
import { getOptions } from '../../utility/get_options'
import Delete from '@mui/icons-material/Delete'
import { Button } from '../../components/button/Button'
import type { Composition } from '../interface'

type CompositionFieldProps = {
  bpsps: Bpsp[]
  disabled: boolean
}

export const CompositionField = ({
  bpsps = [],
  disabled,
}: CompositionFieldProps) => {
  const { control } = useFormContext()
  const compositions: Composition[] =
    useWatch({
      control,
      name: 'compositions',
    }) || []
  const selectedBpspIds = compositions
    .map((dt) => dt.bpsp_id)
    .filter((dt) => typeof dt === 'number')
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'compositions',
    keyName: 'fieldId',
  })

  const bpspOptions = getOptions({
    selectedValues: selectedBpspIds,
    label: 'name',
    options: bpsps,
    value: 'id',
  })

  const handleAddNewField = () =>
    append({
      bpsp_id: null,
      qty: 0,
      raw_material_id: null,
    })

  const renderField = () =>
    fields.map((field, idx) => {
      return (
        <Stack
          direction='row'
          key={field.fieldId}
          spacing={2}
          sx={{
            alignItems: 'center',
          }}
        >
          <FormAutoCompleteInput
            className='w-1/6'
            disabled={disabled}
            label='Bpsp'
            name={`compositions.${idx}.bpsp_id`}
            options={bpspOptions}
          />
          <FormNumberInput
            disabled={disabled}
            label='Quantity'
            name={`compositions.${idx}.qty`}
          />
          {!disabled && (
            <Delete
              className='cursor-pointer hover:bg-gray-200'
              color='error'
              onClick={() => remove(idx)}
            />
          )}
        </Stack>
      )
    })

  return (
    <Stack direction='column' spacing={2}>
      {renderField()}
      <Button
        className='w-fit'
        disabled={disabled}
        onClick={handleAddNewField}
        type='button'
        variant='contained'
      >
        Tambah
      </Button>
    </Stack>
  )
}
