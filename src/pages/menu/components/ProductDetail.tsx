import { Modal } from '../../components/modal/Modal'
import type { Product } from '../../product/interface'
import { getFullUrl } from '../../utility/get_full_url'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Box } from '@mui/material'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

type ProductDetailProps = {
  handleClose: () => void
  product: Product | undefined
}

export const ProductDetail = ({ handleClose, product }: ProductDetailProps) => {
  const renderImages = () => {
    if (!product) return null
    return product?.product_images.map((image) => (
      <SwiperSlide style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            aspectRatio: '1 / 1',
            backgroundImage: `url(${getFullUrl(image.image_url)})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '80%',
          }}
        />
      </SwiperSlide>
    ))
  }

  return (
    <Modal open={!!product} onClose={handleClose}>
      <Swiper
        rewind={true}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {renderImages()}
      </Swiper>
    </Modal>
  )
}
