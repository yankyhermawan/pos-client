import { useEffect } from 'react'
import { useRawMaterialStore } from '../store'
import Form from '../../components/form/Form'
import { rawMaterialFormSchema, type RawMaterialForm } from '../interface'
import FormTextInput from '../../components/form_input/Text'
import { FormAutoCompleteInput } from '../../components/form_input/AutoComplete'
import { Modal } from '../../components/modal/Modal'
import { Button } from '../../components/button/Button'
import { useUnitMeasurementStore } from '../../unit_measurement/store'
import { getOptions } from '../../utility/get_options'
import { Stack, Typography } from '@mui/material'

export type RawMaterialFormMode = 'add' | 'edit' | 'view'

type RawMaterialFormModalProps = {
  id?: number
  mode: RawMaterialFormMode
  onClose: () => void
  onSuccess: () => void
}

const titles: Record<RawMaterialFormMode, string> = {
  add: 'Tambah Bahan Baku',
  edit: 'Edit Bahan Baku',
  view: 'Detail Bahan Baku',
}

export const RawMaterialFormModal = ({
  id,
  mode,
  onClose,
  onSuccess,
}: RawMaterialFormModalProps) => {
  const {
    rawMaterial,
    createRawMaterial,
    getRawMaterial,
    isActionLoading,
    isActionSuccess,
    reset,
    updateRawMaterial,
  } = useRawMaterialStore()
  const { getUnitMeasurements, unitMeasurements } = useUnitMeasurementStore()
  const unitOptions = getOptions({
    label: 'value',
    options: unitMeasurements,
    selectedValues: [],
    value: 'id',
  })
  const disabled = mode === 'view'

  const handleSubmit = ({ id, ...values }: RawMaterialForm) => {
    if (id) {
      updateRawMaterial({ ...values, id })
      return
    }
    createRawMaterial(values)
  }

  useEffect(() => {
    getUnitMeasurements()

    return () => {
      reset()
    }
  }, [])

  useEffect(() => {
    if (id) {
      getRawMaterial(id)
    }
  }, [id])

  useEffect(() => {
    if (!isActionLoading && isActionSuccess) {
      onSuccess()
    }
  }, [isActionLoading, isActionSuccess])

  return (
    <Modal open onClose={onClose}>
      <Form
        existingValue={rawMaterial}
        schema={rawMaterialFormSchema}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          <Typography variant='h5'>{titles[mode]}</Typography>
          <FormTextInput
            disabled={disabled}
            label='Nama Bahan Baku'
            name='name'
          />
          <FormAutoCompleteInput
            disabled={disabled}
            label='Satuan'
            name='unit_measurement_id'
            options={unitOptions}
          />
          <Stack direction='row' spacing={2}>
            <Button onClick={onClose} variant='outlined'>
              {disabled ? 'Tutup' : 'Batal'}
            </Button>
            <Button
              disabled={disabled || isActionLoading}
              type='submit'
              variant='contained'
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Modal>
  )
}
