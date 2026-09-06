import { Controller, useFormContext } from 'react-hook-form'
import type { BaseFormInput, MimeType } from '../../utility/global_interface'
import Upload from '../upload/Upload'

type FormUploadProps = BaseFormInput & {
  accept: MimeType[]
  fileList: string[]
  multiple?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onDelete: (key: string) => void
}

const FormUpload = ({
  accept,
  disabled,
  fileList,
  label = '',
  name,
  multiple,
  onChange,
  onDelete,
}: FormUploadProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <Upload
          accept={accept}
          disabled={disabled}
          fileList={fileList}
          label={label}
          multiple={multiple}
          onChange={onChange}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default FormUpload
