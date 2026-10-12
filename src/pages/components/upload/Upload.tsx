import { CardMedia, Chip, IconButton, Stack, styled } from '@mui/material'
import CloudIconUpload from '@mui/icons-material/CloudUpload'
import type { MimeType } from '../../utility/global_interface'
import { Card } from '../card/Card'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
  onReorder,
}: {
  accept: MimeType[]
  disabled?: boolean
  fileList: string[]
  label: string
  multiple?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onDelete: (key: string) => void
  onReorder?: (from: number, to: number) => void
}) => {
  const [url, setUrl] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const canReorder = !disabled && !!onReorder && fileList.length > 1

  const resetDrag = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  const handleDrop = (to: number) => {
    if (dragIndex !== null && dragIndex !== to) {
      onReorder?.(dragIndex, to)
    }
    resetDrag()
  }

  const arrowSx = {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
    bottom: 8,
    position: 'absolute',
  }

  const renderImageList = () => {
    return fileList.map((file, key) => {
      const fullUrl = getFullUrl(file)
      return (
        <Card
          draggable={canReorder}
          key={file}
          onDragEnd={resetDrag}
          onDragOver={(e) => {
            if (dragIndex === null) return
            e.preventDefault()
            setOverIndex(key)
          }}
          onDragStart={() => setDragIndex(key)}
          onDrop={(e) => {
            e.preventDefault()
            handleDrop(key)
          }}
          sx={{
            boxShadow: 3,
            height: 250,
            opacity: dragIndex === key ? 0.4 : 1,
            outline:
              overIndex === key && dragIndex !== key
                ? '3px dashed #4F46E5'
                : 'none',
            position: 'relative',
            width: 250,
          }}
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
          {key === 0 && fileList.length > 1 ? (
            <Chip
              color='primary'
              label='Utama'
              size='small'
              sx={{ left: 8, position: 'absolute', top: 8 }}
            />
          ) : (
            <></>
          )}
          {canReorder ? (
            <>
              <IconButton
                aria-label='Geser ke kiri'
                disabled={key === 0}
                onClick={() => onReorder?.(key, key - 1)}
                size='small'
                sx={{ ...arrowSx, left: 8 }}
              >
                <ArrowBackIcon fontSize='small' />
              </IconButton>
              <IconButton
                aria-label='Geser ke kanan'
                disabled={key === fileList.length - 1}
                onClick={() => onReorder?.(key, key + 1)}
                size='small'
                sx={{ ...arrowSx, right: 8 }}
              >
                <ArrowForwardIcon fontSize='small' />
              </IconButton>
            </>
          ) : (
            <></>
          )}
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
        <Stack direction='row' spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
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
