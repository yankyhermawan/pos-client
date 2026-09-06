import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductStore } from './store'
import Form from '../components/form/Form'
import { productSchema } from './schema'
import type z from 'zod'
import FormTextInput from '../components/form_input/Text'
import { Stack } from '@mui/material'
import FormNumberInput from '../components/form_input/Number'
import { Card } from '../components/card/Card'
import { CompositionField } from './component/CompositionField'
import { setCookiesValue } from '../utility/local_storage'
import { useBpspParam } from '../bpsp/store'
import FormUpload from '../components/form_input/Upload'
import { error } from '../components/notification/Notification'
import { useStorageStore } from '../storage/store'
import { Button } from '../components/button/Button'

const AddEditView = () => {
  const { identifier = '', path = '' } = useParams()
  const navigate = useNavigate()
  const id = Number(identifier)
  const {
    isActionLoading,
    isActionSuccess,
    getProduct,
    product,
    reset,
    updateProduct,
  } = useProductStore()
  const { bpsps, getBpsps } = useBpspParam()
  const { files, uploadFiles, resetFiles } = useStorageStore()
  const existingFiles = product?.product_images?.map((dt) => dt.image_url) ?? []
  const [deletedFiles, setDeletedFiles] = useState<string[]>([])

  const fileList = [...existingFiles, ...files].filter((file) => {
    const currSplitted = file.split('/')
    const currFileName = currSplitted[currSplitted.length - 1]
    return deletedFiles.every((dt) => !dt.includes(currFileName))
  })

  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    if (values.id) {
      updateProduct({
        ...values,
        compositions: values.compositions.map((dt) => ({
          ...dt,
          product_id: values.id,
        })),
        id: values.id,
        product_images: fileList.map((dt) => ({ image_url: dt })),
      })
    }
  }

  useEffect(() => {
    getBpsps({
      limit: 10,
      offset: 0,
      sort: [
        {
          by: 'id',
          order: 'ASC',
        },
      ],
    })

    return () => {
      reset()
      resetFiles()
    }
  }, [])

  useEffect(() => {
    if (id) {
      getProduct(false)(id)
    }
  }, [id])

  useEffect(() => {
    if (product) {
      const { store_id } = product
      setCookiesValue('store_id', store_id)
    }
  }, [product])

  useEffect(() => {
    if (!isActionLoading && isActionSuccess) {
      navigate('/product')
    }
  }, [isActionLoading, isActionSuccess])

  const handleUploadFile = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const files = e.target.files || ({} as FileList)
    const length = e.target.files?.length || 0
    if (length > 5) {
      e.preventDefault()
      error('Maximal 5 File')
      return
    }
    const formData = new FormData()
    for (let i = 0; i <= length; i++) {
      const file = files.item(i)
      if (!file) continue
      formData.append('files', file)
    }
    uploadFiles('product', formData)
  }

  const handleDeleteFile = (key: string) => {
    setDeletedFiles((prev) => prev.concat(key))
  }

  const disabled = path.toLowerCase() === 'view'

  return (
    <Form
      existingValue={product}
      schema={productSchema}
      onSubmit={handleSubmit}
    >
      <Stack spacing={2}>
        <Stack direction='row' spacing={2}>
          <FormTextInput disabled={disabled} label='Nama Product' name='name' />
          <FormNumberInput disabled={disabled} label='Harga' name='price' />
          <FormNumberInput
            disabled={disabled}
            label='Quantity'
            name='stock_qty'
          />
        </Stack>
        <FormUpload
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          disabled={disabled}
          fileList={fileList}
          multiple
          label='Input gan'
          name='image_url'
          onChange={handleUploadFile}
          onDelete={handleDeleteFile}
        />
        <Card title='Komposisi'>
          <CompositionField bpsps={bpsps} disabled={disabled} />
        </Card>
        <Button disabled={disabled} type='submit' variant='contained'>
          Submit
        </Button>
      </Stack>
    </Form>
  )
}

export default AddEditView
