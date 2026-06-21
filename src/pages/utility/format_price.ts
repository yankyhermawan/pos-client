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
