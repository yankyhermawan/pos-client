import { Box, Modal as MuiModal, type ModalProps } from '@mui/material'

export const Modal = ({ children, ...props }: ModalProps) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxWidth: '80vw',
  }

  return (
    <MuiModal {...props}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  )
}
