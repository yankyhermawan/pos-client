export const formatPrice = (
  price: number | string | null | undefined,
  useSign = true,
) => {
  let opt: object = {
    currency: 'IDR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }
  if (useSign) {
    opt = { ...opt, style: 'currency' }
  }

  if (!price) return Number(0).toLocaleString('id-id', opt)

  const value =
    typeof price === 'number' ? price : Number(price.replace(/,/g, '.'))
  return value.toLocaleString('id-id', opt)
}

// price_cents from the API is 1/PRICE_SCALE of the displayed currency unit
export const PRICE_SCALE = 100

export const toCents = (price: number) => Math.round(price * PRICE_SCALE)

export const fromCents = (cents: number) => cents / PRICE_SCALE

export const formatCents = (cents: number | null | undefined, useSign = true) =>
  formatPrice(fromCents(cents || 0), useSign)
