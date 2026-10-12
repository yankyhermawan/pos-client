import { useEffect } from 'react'
import { useCategoryStore } from '../store'
import Form from '../../components/form/Form'
import {
  categoryFormSchema,
  type Category,
  type CategoryForm,
} from '../interface'
import FormTextInput from '../../components/form_input/Text'
import { Modal } from '../../components/modal/Modal'
import { Button } from '../../components/button/Button'
import { Stack, Typography } from '@mui/material'

type CategoryFormModalProps = {
  category?: Category
  onClose: () => void
  onSuccess: () => void
}

export const CategoryFormModal = ({
  category,
  onClose,
  onSuccess,
}: CategoryFormModalProps) => {
  const {
    createCategory,
    isActionLoading,
    isActionSuccess,
    reset,
    updateCategory,
  } = useCategoryStore()

  const handleSubmit = ({ id, ...values }: CategoryForm) => {
    if (id) {
      updateCategory({ ...values, id })
      return
    }
    createCategory(values)
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [])

  useEffect(() => {
    if (!isActionLoading && isActionSuccess) {
      onSuccess()
    }
  }, [isActionLoading, isActionSuccess])

  return (
    <Modal open onClose={onClose}>
      <Form
        existingValue={category}
        schema={categoryFormSchema}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          <Typography variant='h5'>
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </Typography>
          <FormTextInput label='Nama Kategori' name='name' />
          <Stack direction='row' spacing={2}>
            <Button onClick={onClose} variant='outlined'>
              Batal
            </Button>
            <Button
              disabled={isActionLoading}
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
