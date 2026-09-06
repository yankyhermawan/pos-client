import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'
import { QS_DEFAULT_PARSE } from '../common/constant'
import { useEffect, useState } from 'react'
import { useProductStore } from '../product/store'
import {
  Badge,
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { ProductCard } from './components/ProductCard'
import type { Cart, StoreCart } from './interface'
import { getLocalStorage, setLocalStorage } from '../utility/local_storage'
import { useEffectSkipFirst } from '../utility/custom_hooks'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import type { Product } from '../product/interface'
import { ProductDetail } from './components/ProductDetail'

type MenuParams = {
  storeId: string
}

const Menu = () => {
  const location = useLocation()
  const { storeId } = qs.parse(location.search, QS_DEFAULT_PARSE) as MenuParams
  const navigate = useNavigate()
  const { getProducts, products = [] } = useProductStore()
  const storage =
    (getLocalStorage<StoreCart[]>('cart') || []).find(
      (dt) => dt.store_id === Number(storeId),
    )?.cart || []
  const [cart, setCart] = useState<Cart[]>(storage)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const totalItems = cart.reduce((sum, n) => sum + n.qty, 0)

  const handleClickAddSub = (product_id: number, isAdd: boolean) => {
    const copied = [...cart]
    const selected = copied.find((dt) => dt.product_id === product_id)
    const selectedQty = Math.max(selected?.qty || 0, 0)
    const newQty = isAdd ? selectedQty + 1 : selectedQty - 1
    const notSelected = copied.filter((dt) => dt.product_id !== product_id)
    if (newQty > 0) {
      setCart([...notSelected, { product_id, qty: newQty }])
    } else {
      setCart(notSelected)
    }
  }

  useEffect(() => {
    const listener = () => {
      const storageCart = getLocalStorage<StoreCart[]>('cart') || []
      const filtered = storageCart.find((dt) => dt.store_id === Number(storeId))
      setCart(filtered?.cart || [])
    }

    window.addEventListener('storage', listener)

    return () => window.removeEventListener('storage', listener)
  }, [])

  useEffectSkipFirst(() => {
    const storageStoreCart = [...(getLocalStorage<StoreCart[]>('cart') || [])]
    const others = storageStoreCart.filter(
      (dt) => dt.store_id !== Number(storeId),
    )
    const toSet: StoreCart[] = [
      ...others,
      {
        cart,
        store_id: Number(storeId),
      },
    ]
    setLocalStorage('cart', toSet)
  }, [cart])

  useEffect(() => {
    const numbered = Number(storeId)
    if (!numbered) {
      navigate('/404')
      return
    }
    getProducts(true)({
      store_id: numbered,
      limit: 0,
      offset: 0,
      sort: [
        {
          by: 'id',
          order: 'ASC',
        },
      ],
    })
  }, [storeId, navigate])

  return (
    <>
      <ProductDetail
        handleClose={() => setSelectedProduct(undefined)}
        product={selectedProduct}
      />
      <Container
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          minHeight: '100dvh',
          justifyContent: 'center',
          minWidth: '320px',
          '&.MuiContainer-maxWidthLg': {
            '@media (min-width: 1200px)': {
              maxWidth: '768px',
            },
          },
        }}
      >
        <Stack
          direction='row'
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {products.map((product) => (
            <Container
              key={product.id}
              sx={{
                padding: '1em',
                width: '50%',
                '&.MuiContainer-maxWidthLg': {
                  '@media (min-width: 1200px)': {
                    width: '50%',
                  },
                },
              }}
            >
              <ProductCard
                cart={cart.find((dt) => dt.product_id === product.id)}
                onClickAdd={handleClickAddSub}
                onClickDetail={() => setSelectedProduct(product)}
                product={product}
              />
            </Container>
          ))}
        </Stack>
        <Box
          sx={{ bottom: '2%', right: '2%', position: 'fixed', zIndex: 1000 }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'primary.main',
              borderRadius: 999,
              display: 'flex',
              justifyContent: 'center',
              minHeight: 48,
              minWidth: 48,
              overflow: 'visible',
            }}
          >
            <IconButton>
              <Badge
                badgeContent={
                  totalItems > 0 ? <Typography>{totalItems}</Typography> : 0
                }
                color='info'
              >
                <ShoppingCartOutlinedIcon
                  sx={{ color: 'background.default', fontSize: 36 }}
                />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Menu
