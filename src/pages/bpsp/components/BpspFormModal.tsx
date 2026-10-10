import { useEffect } from 'react'
import { useBpspParam } from '../store'
import Form from '../../components/form/Form'
import { bpspFormSchema, type BpspForm } from '../interface'
import FormTextInput from '../../components/form_input/Text'
import { FormAutoCompleteInput } from '../../components/form_input/AutoComplete'
import { Modal } from '../../components/modal/Modal'
import { Button } from '../../components/button/Button'
import { useUnitMeasurementStore } from '../../unit_measurement/store'
import { getOptions } from '../../utility/get_options'
import { Stack, Typography } from '@mui/material'

export type BpspFormMode = 'add' | 'edit' | 'view'

type BpspFormModalProps = {
  id?: number
  mode: BpspFormMode
  onClose: () => void
  onSuccess: () => void
}

const titles: Record<BpspFormMode, string> = {
  add: 'Tambah BPSP',
  edit: 'Edit BPSP',
  view: 'Detail BPSP',
}

export const BpspFormModal = ({
  id,
  mode,
  onClose,
  onSuccess,
}: BpspFormModalProps) => {
  const {
    bpsp,
    createBpsp,
    getBpsp,
    isActionLoading,
    isActionSuccess,
    reset,
    updateBpsp,
  } = useBpspParam()
  const { getUnitMeasurements, unitMeasurements } = useUnitMeasurementStore()
  const unitOptions = getOptions({
    label: 'value',
    options: unitMeasurements,
    selectedValues: [],
    value: 'id',
  })
  const disabled = mode === 'view'

  const handleSubmit = ({ id, ...values }: BpspForm) => {
    if (id) {
      updateBpsp({ ...values, id })
      return
    }
    createBpsp(values)
  }

  useEffect(() => {
    getUnitMeasurements()

    return () => {
      reset()
    }
  }, [])

  useEffect(() => {
    if (id) {
      getBpsp(id)
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
        existingValue={bpsp}
        schema={bpspFormSchema}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          <Typography variant='h5'>{titles[mode]}</Typography>
          <FormTextInput disabled={disabled} label='Nama BPSP' name='name' />
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
