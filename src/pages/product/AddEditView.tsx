import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductStore } from './store'
import Form from '../components/form/Form'
import { productFormSchema, type ProductForm } from './interface'
import { toProductForm, toProductRequest } from './mapper'
import FormTextInput from '../components/form_input/Text'
import { Box, Stack } from '@mui/material'
import { Card } from '../components/card/Card'
import { VariantField } from './component/VariantField'
import { getCookiesValue, setCookiesValue } from '../utility/local_storage'
import { useBpspParam } from '../bpsp/store'
import { useRawMaterialStore } from '../raw_material/store'
import { useCategoryStore } from '../category/store'
import { FormMultiAutoCompleteInput } from '../components/form_input/MultiAutoComplete'
import { getOptions } from '../utility/get_options'
import FormUpload from '../components/form_input/Upload'
import { error } from '../components/notification/Notification'
import { useStorageStore } from '../storage/store'
import { Button } from '../components/button/Button'
import { compactCardSx, responsiveButtonSx } from './component/styles'

const AddEditView = () => {
  const { identifier = '', path = '' } = useParams()
  const navigate = useNavigate()
  const id = Number(identifier)
  const {
    createProduct,
    isActionLoading,
    isActionSuccess,
    getProduct,
    product,
    reset,
    updateProduct,
  } = useProductStore()
  const { getBpsps } = useBpspParam()
  const { getRawMaterials } = useRawMaterialStore()
  const { categories, getCategories } = useCategoryStore()
  const { files, uploadFiles, resetFiles } = useStorageStore()
  const existingFiles = product?.product_images?.map((dt) => dt.image_url) ?? []
  const [deletedFiles, setDeletedFiles] = useState<string[]>([])
  const [imageOrder, setImageOrder] = useState<string[]>([])

  const availableFiles = [...existingFiles, ...files].filter((file) => {
    const currSplitted = file.split('/')
    const currFileName = currSplitted[currSplitted.length - 1]
    return deletedFiles.every((dt) => !dt.includes(currFileName))
  })

  // dragged order first, anything uploaded afterwards goes to the end
  const fileList = [
    ...imageOrder.filter((file) => availableFiles.includes(file)),
    ...availableFiles.filter((file) => !imageOrder.includes(file)),
  ]

  const categoryOptions = getOptions({
    label: 'name',
    options: categories,
    selectedValues: [],
    value: 'id',
  })

  const existingValue = useMemo(
    () => (product ? toProductForm(product) : undefined),
    [product],
  )

  const handleSubmit = (values: ProductForm) => {
    const body = toProductRequest(values, fileList)
    if (values.id) {
      updateProduct(body)
      return
    }
    createProduct({ ...body, store_id: getCookiesValue<number>('store_id') })
  }

  useEffect(() => {
    const params = {
      limit: 50,
      offset: 0,
      sort: [{ by: 'id', order: 'ASC' as const }],
    }
    getBpsps(params)
    getRawMaterials(params)
    getCategories(false)()

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

  const handleReorderFile = (from: number, to: number) => {
    const next = [...fileList]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setImageOrder(next)
  }

  const handleDeleteFile = (key: string) => {
    setDeletedFiles((prev) => prev.concat(key))
  }

  const disabled = path.toLowerCase() === 'view'

  return (
    <Form
      existingValue={existingValue}
      schema={productFormSchema}
      onSubmit={handleSubmit}
    >
      <Stack spacing={2}>
        <FormTextInput disabled={disabled} label='Nama Product' name='name' />
        <FormMultiAutoCompleteInput
          disabled={disabled}
          label='Kategori'
          name='category_ids'
          options={categoryOptions}
        />
        <FormUpload
          accept={['.jpeg', '.jpg', '.png', '.webp']}
          disabled={disabled}
          fileList={fileList}
          multiple
          label='Input gan'
          name='image_url'
          onChange={handleUploadFile}
          onDelete={handleDeleteFile}
          onReorder={handleReorderFile}
        />
        <Card sx={compactCardSx} title='Varian, Harga & Stok'>
          <VariantField disabled={disabled} />
        </Card>
        {!disabled && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              bottom: 0,
              position: { sm: 'static', xs: 'sticky' },
              py: 1,
              zIndex: 10,
            }}
          >
            <Button sx={responsiveButtonSx} type='submit' variant='contained'>
              Submit
            </Button>
          </Box>
        )}
      </Stack>
    </Form>
  )
}

export default AddEditView
