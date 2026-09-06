import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Card } from '../../components/card/Card'
import type { Product } from '../../product/interface'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { getFullUrl } from '../../utility/get_full_url'
import { formatPrice } from '../../utility/format_price'
import { Button } from '../../components/button/Button'
import type { Cart } from '../interface'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

type ProductCartProps = {
  cart: Cart | undefined
  onClickAdd: (product_id: number, isAdd: boolean) => void
  onClickDetail: () => void
  product: Product
}

export const ProductCard = ({
  cart,
  onClickAdd,
  onClickDetail,
  product,
}: ProductCartProps) => {
  const image = product.product_images[0]?.image_url

  const renderButton = () => {
    if (!cart || cart.qty <= 0) {
      return (
        <Button
          onClick={() => onClickAdd(product.id, true)}
          variant='contained'
        >
          Tambah
        </Button>
      )
    }
    return (
      <Stack
        direction='row'
        sx={{
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <IconButton onClick={() => onClickAdd(product.id, false)}>
          <RemoveCircleOutlineOutlinedIcon />
        </IconButton>
        <Typography>{cart.qty}</Typography>
        <IconButton onClick={() => onClickAdd(product.id, true)}>
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Stack>
    )
  }

  return (
    <Card
      sx={{
        padding: 0,
        height: '100%',
      }}
    >
      <Stack direction='column' sx={{ alignItems: 'center', gap: '8px' }}>
        <Box
          sx={{
            alignItems: 'center',
            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {image ? (
            <Box
              onClick={onClickDetail}
              sx={{
                aspectRatio: '1 / 1',
                backgroundImage: `url(${getFullUrl(image)})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: '100%',
              }}
            />
          ) : (
            <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
          )}
        </Box>
        <Typography>{product.name}</Typography>
        <Typography>{formatPrice(product.price)}</Typography>
        {renderButton()}
      </Stack>
    </Card>
  )
}
