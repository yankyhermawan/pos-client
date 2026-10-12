import { formatCents } from '../utility/format_price'
import type { ProductListing } from './interface'

export const isSimpleVariants = (
  variants: { is_default?: boolean; values: unknown[] }[],
) =>
  variants.length === 1 &&
  !!variants[0].is_default &&
  variants[0].values.length === 1

export const isSimpleProduct = (product: ProductListing) =>
  isSimpleVariants(product.variants)

const getAllValues = (product: ProductListing) =>
  product.variants.flatMap((variant) => variant.values)

export const getPriceRange = (product: ProductListing) => {
  const prices = getAllValues(product).map((value) => value.price_cents)
  if (prices.length === 0) return { max: 0, min: 0 }
  return { max: Math.max(...prices), min: Math.min(...prices) }
}

export const formatPriceRange = (product: ProductListing) => {
  const { max, min } = getPriceRange(product)
  if (min === max) return formatCents(min)
  return `${formatCents(min)} - ${formatCents(max)}`
}

export const isRequiredVariant = (variant: { min_selected: number }) =>
  variant.min_selected >= 1

// only required variants count, each at its cheapest min_selected values
export const getStartingPrice = (product: ProductListing) =>
  product.variants.reduce((sum, variant) => {
    if (!isRequiredVariant(variant)) return sum
    const cheapest = variant.values
      .map((value) => value.price_cents)
      .sort((a, b) => a - b)
      .slice(0, variant.min_selected)
    return sum + cheapest.reduce((total, price) => total + price, 0)
  }, 0)

export const getSelectionPrice = (
  product: ProductListing,
  valueIds: number[],
) =>
  getAllValues(product)
    .filter((value) => valueIds.includes(value.id))
    .reduce((sum, value) => sum + value.price_cents, 0)

// exactly one of qty > 0 or compositions is allowed per value, so qty 0 means composition
export const getStockLabel = (product: ProductListing) => {
  const values = getAllValues(product)
  const manual = values.filter((value) => value.qty > 0)
  if (manual.length === 0) return 'Komposisi'
  if (manual.length < values.length) return 'Campuran'
  return String(manual.reduce((sum, value) => sum + value.qty, 0))
}

export const getVariantSummary = (product: ProductListing) =>
  product.variants
    .filter((variant) => !variant.is_default)
    .map((variant) => `${variant.name} (${variant.values.length})`)
    .join(', ') || '-'
