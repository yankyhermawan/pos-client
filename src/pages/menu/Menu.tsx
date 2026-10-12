import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'
import { QS_DEFAULT_PARSE } from '../common/constant'
import { useEffect, useState } from 'react'
import { useProductStore } from '../product/store'
import { useCategoryStore } from '../category/store'
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
import type { ProductListing } from '../product/interface'
import { ProductDetail } from './components/ProductDetail'
import { ProductOptions } from './components/ProductOptions'
import { ALL_CATEGORY_ID, CategoryTabs } from './components/CategoryTabs'

type MenuParams = {
  storeId: string
}

const isSameLine = (line: Cart, productId: number, valueIds: number[]) =>
  line.product_id === productId &&
  line.value_ids.length === valueIds.length &&
  line.value_ids.every((id) => valueIds.includes(id))

const getStoreCart = (storeId: string) =>
  (getLocalStorage<StoreCart[]>('cart') || [])
    .find((dt) => dt.store_id === Number(storeId))
    ?.cart.filter((line) => Array.isArray(line.value_ids)) || []

const Menu = () => {
  const location = useLocation()
  const { storeId } = qs.parse(location.search, QS_DEFAULT_PARSE) as MenuParams
  const navigate = useNavigate()
  const { getProducts, products = [] } = useProductStore()
  const { categories, getCategories } = useCategoryStore()
  const [selection, setSelection] = useState({
    categoryId: ALL_CATEGORY_ID,
    storeId,
  })
  // a selection only counts for the store it was made in
  const categoryId =
    selection.storeId === storeId ? selection.categoryId : ALL_CATEGORY_ID
  const [cart, setCart] = useState<Cart[]>(() => getStoreCart(storeId))
  const [selectedProduct, setSelectedProduct] = useState<
    ProductListing | undefined
  >()
  const [optionsProduct, setOptionsProduct] = useState<
    ProductListing | undefined
  >()
  const totalItems = cart.reduce((sum, n) => sum + n.qty, 0)

  const handleClickAddSub = (
    product_id: number,
    value_ids: number[],
    isAdd: boolean,
  ) => {
    const selected = cart.find((dt) => isSameLine(dt, product_id, value_ids))
    const selectedQty = Math.max(selected?.qty || 0, 0)
    const newQty = isAdd ? selectedQty + 1 : selectedQty - 1
    if (newQty <= 0) {
      setCart(cart.filter((dt) => !isSameLine(dt, product_id, value_ids)))
      return
    }
    if (selected) {
      setCart(
        cart.map((dt) =>
          isSameLine(dt, product_id, value_ids) ? { ...dt, qty: newQty } : dt,
        ),
      )
      return
    }
    setCart([...cart, { product_id, qty: newQty, value_ids }])
  }

  useEffect(() => {
    const listener = () => {
      setCart(getStoreCart(storeId))
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
    if (!numbered) return
    getCategories(true)(numbered)
  }, [storeId])

  useEffect(() => {
    const numbered = Number(storeId)
    if (!numbered) {
      navigate('/404')
      return
    }
    getProducts(true)({
      ...(categoryId !== ALL_CATEGORY_ID ? { category_id: categoryId } : {}),
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
  }, [storeId, categoryId, navigate])

  return (
    <>
      <ProductDetail
        handleClose={() => setSelectedProduct(undefined)}
        product={selectedProduct}
      />
      {optionsProduct && (
        <ProductOptions
          key={optionsProduct.id}
          lines={cart.filter((dt) => dt.product_id === optionsProduct.id)}
          onChange={(valueIds, isAdd) =>
            handleClickAddSub(optionsProduct.id, valueIds, isAdd)
          }
          onClose={() => setOptionsProduct(undefined)}
          product={optionsProduct}
        />
      )}
      <Container
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          minWidth: '320px',
          '&.MuiContainer-maxWidthLg': {
            '@media (min-width: 1200px)': {
              maxWidth: '768px',
            },
          },
        }}
      >
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            onChange={(id) => setSelection({ categoryId: id, storeId })}
            value={categoryId}
          />
        )}
        <Stack
          direction='row'
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
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
                lines={cart.filter((dt) => dt.product_id === product.id)}
                onClickAdd={handleClickAddSub}
                onClickDetail={() => setSelectedProduct(product)}
                onClickOptions={() => setOptionsProduct(product)}
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
