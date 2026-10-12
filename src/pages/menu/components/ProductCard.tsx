import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Card } from '../../components/card/Card'
import type { ProductListing } from '../../product/interface'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { getFullUrl } from '../../utility/get_full_url'
import { formatCents } from '../../utility/format_price'
import { getStartingPrice, isSimpleProduct } from '../../product/helpers'
import { Button } from '../../components/button/Button'
import type { Cart } from '../interface'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

type ProductCartProps = {
  lines: Cart[]
  onClickAdd: (product_id: number, value_ids: number[], isAdd: boolean) => void
  onClickDetail: () => void
  onClickOptions: () => void
  product: ProductListing
}

export const ProductCard = ({
  lines,
  onClickAdd,
  onClickDetail,
  onClickOptions,
  product,
}: ProductCartProps) => {
  const image = product.product_images[0]?.image_url
  const isSimple = isSimpleProduct(product)
  const defaultValue = product.variants[0]?.values[0]
  const totalQty = lines.reduce((sum, line) => sum + line.qty, 0)

  const renderButton = () => {
    if (!isSimple || !defaultValue) {
      return (
        <Button onClick={onClickOptions} variant='contained'>
          {totalQty > 0 ? `Pilih (${totalQty})` : 'Pilih'}
        </Button>
      )
    }
    const valueIds = [defaultValue.id]
    if (totalQty <= 0) {
      return (
        <Button
          onClick={() => onClickAdd(product.id, valueIds, true)}
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
        <IconButton onClick={() => onClickAdd(product.id, valueIds, false)}>
          <RemoveCircleOutlineOutlinedIcon />
        </IconButton>
        <Typography>{totalQty}</Typography>
        <IconButton onClick={() => onClickAdd(product.id, valueIds, true)}>
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Stack>
    )
  }

  return (
    <Card
      sx={{
        maxHeight: 'fit-content',
        padding: 0,
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
        <Typography>
          {isSimple
            ? formatCents(defaultValue?.price_cents)
            : `Mulai ${formatCents(getStartingPrice(product))}`}
        </Typography>
        {renderButton()}
      </Stack>
    </Card>
  )
}
