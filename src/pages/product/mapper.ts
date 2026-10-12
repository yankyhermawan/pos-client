import { fromCents, toCents } from '../utility/format_price'
import { isSimpleVariants } from './helpers'
import type {
  Composition,
  ProductDetail,
  ProductForm,
  ProductFormInput,
  ProductRequest,
} from './interface'

export const toProductForm = (product: ProductDetail): ProductFormInput => ({
  category_ids: product.categories.map((category) => category.id),
  id: product.id,
  name: product.name,
  product_images: product.product_images,
  store_id: product.store_id,
  variants: product.variants.map((variant) => ({
    id: variant.id,
    is_default: variant.is_default,
    max_selected: variant.max_selected,
    min_selected: variant.min_selected,
    name: variant.name,
    values: variant.values.map((value) => ({
      compositions: value.compositions.map((composition) => ({
        bpsp_id: composition.bpsp_id,
        qty: composition.qty,
        raw_material_id: composition.raw_material_id,
        source:
          composition.raw_material_id !== null
            ? ('raw_material' as const)
            : ('bpsp' as const),
      })),
      id: value.id,
      price: fromCents(value.price_cents),
      qty: value.qty,
      value: value.value,
    })),
  })),
})

const toCompositionRequest = (composition: Composition) => ({
  ...(composition.bpsp_id !== null ? { bpsp_id: composition.bpsp_id } : {}),
  qty: composition.qty,
  ...(composition.raw_material_id !== null
    ? { raw_material_id: composition.raw_material_id }
    : {}),
})

export const toProductRequest = (
  form: ProductForm,
  imageUrls: string[] = [],
): ProductRequest => {
  const { category_ids, id, name, store_id, variants } = form
  const product_images = imageUrls.map((image_url) => ({ image_url }))

  // the API builds the default variant itself when it only gets top-level fields
  if (!id && isSimpleVariants(variants)) {
    const [value] = variants[0].values
    return {
      category_ids,
      name,
      price_cents: toCents(value.price),
      product_images,
      store_id,
      ...(value.compositions.length > 0
        ? { compositions: value.compositions.map(toCompositionRequest) }
        : { stock_qty: value.qty }),
    }
  }

  return {
    category_ids,
    ...(id ? { id } : {}),
    product_images,
    name,
    store_id,
    variants: variants.map((variant) => ({
      ...(variant.id ? { id: variant.id } : {}),
      max_selected: variant.max_selected,
      min_selected: variant.min_selected,
      name: variant.name,
      values: variant.values.map((value) => ({
        compositions: value.compositions.map(toCompositionRequest),
        ...(value.id ? { id: value.id } : {}),
        price_cents: toCents(value.price),
        qty: value.qty,
        value: value.value,
      })),
    })),
  }
}
