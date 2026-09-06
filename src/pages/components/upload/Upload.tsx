import { CardMedia, IconButton, Stack, styled } from '@mui/material'
import CloudIconUpload from '@mui/icons-material/CloudUpload'
import type { MimeType } from '../../utility/global_interface'
import { Card } from '../card/Card'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '../button/Button'
import { useState } from 'react'
import { getFullUrl } from '../../utility/get_full_url'
import { Modal } from '../modal/Modal'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const Upload = ({
  accept,
  disabled,
  fileList = [],
  label = 'Upload File',
  multiple,
  onChange,
  onDelete,
}: {
  accept: MimeType[]
  disabled?: boolean
  fileList: string[]
  label: string
  multiple?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onDelete: (key: string) => void
}) => {
  const [url, setUrl] = useState('')

  const renderImageList = () => {
    return fileList.map((file, key) => {
      const fullUrl = getFullUrl(file)
      return (
        <Card
          key={key}
          sx={{ position: 'relative', width: 250, height: 250, boxShadow: 3 }}
        >
          <CardMedia
            alt='Selected preview'
            component='img'
            image={fullUrl}
            onClick={() => setUrl(fullUrl)}
            sx={{
              cursor: 'pointer',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {!disabled ? (
            <IconButton
              onClick={() => onDelete(file)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              color='error'
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <></>
          )}
        </Card>
      )
    })
  }

  const renderModal = () => {
    return (
      <Modal open={!!url} onClose={() => setUrl('')}>
        <img src={url} />
      </Modal>
    )
  }

  return (
    <>
      {renderModal()}
      <Stack direction='column' spacing={2}>
        <Stack direction='row' spacing={2}>
          {renderImageList()}
        </Stack>
        <Button
          component='label'
          disabled={disabled}
          startIcon={<CloudIconUpload />}
          variant='contained'
        >
          {label}
          <VisuallyHiddenInput
            accept={accept.join(', ')}
            onChange={onChange}
            type='file'
            multiple={multiple}
          />
        </Button>
      </Stack>
    </>
  )
}

export default Upload
