import { useState } from 'react'
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { Button } from '../../components/button/Button'
import { Modal } from '../../components/modal/Modal'
import { getSelectionPrice, isRequiredVariant } from '../../product/helpers'
import type { ProductListing, VariantListing } from '../../product/interface'
import { formatCents } from '../../utility/format_price'
import type { Cart } from '../interface'

type ProductOptionsProps = {
  lines: Cart[]
  onChange: (valueIds: number[], isAdd: boolean) => void
  onClose: () => void
  product: ProductListing
}

// a required single choice starts on its first value, everything else starts empty
const getInitialSelection = (product: ProductListing) =>
  Object.fromEntries(
    product.variants.map((variant) => [
      variant.id,
      isRequiredVariant(variant) &&
      variant.max_selected === 1 &&
      variant.values[0]
        ? [variant.values[0].id]
        : [],
    ]),
  ) as Record<number, number[]>

const getRuleLabel = (variant: VariantListing) => {
  const { max_selected: max, min_selected: min } = variant
  if (!isRequiredVariant(variant)) {
    return max === 1 ? 'Opsional' : `Opsional, maksimal ${max}`
  }
  if (min === max) return `Pilih ${max}`
  return `Pilih ${min} sampai ${max}`
}

export const ProductOptions = ({
  lines,
  onChange,
  onClose,
  product,
}: ProductOptionsProps) => {
  const [selected, setSelected] = useState(() => getInitialSelection(product))
  const valueIds = Object.values(selected)
    .flat()
    .sort((a, b) => a - b)
  const valueNames = new Map(
    product.variants.flatMap((variant) =>
      variant.values.map((value) => [value.id, value.value] as const),
    ),
  )
  const unmetVariants = product.variants.filter(
    (variant) => (selected[variant.id]?.length ?? 0) < variant.min_selected,
  )

  const handleSelect = (
    variant: VariantListing,
    valueId: number | null,
    checked: boolean,
  ) => {
    setSelected((prev) => {
      const current = prev[variant.id] ?? []
      if (valueId === null) {
        return { ...prev, [variant.id]: [] }
      }
      if (variant.max_selected === 1) {
        return { ...prev, [variant.id]: [valueId] }
      }
      if (!checked) {
        return { ...prev, [variant.id]: current.filter((id) => id !== valueId) }
      }
      if (current.length >= variant.max_selected) return prev
      return { ...prev, [variant.id]: [...current, valueId] }
    })
  }

  const renderVariant = (variant: VariantListing) => {
    const current = selected[variant.id] ?? []
    const getLabel = (value: VariantListing['values'][number]) =>
      `${value.value} (${formatCents(value.price_cents)})`

    return (
      <Box key={variant.id}>
        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
          <Typography>{variant.name}</Typography>
          {isRequiredVariant(variant) && (
            <Chip color='primary' label='Wajib' size='small' />
          )}
        </Stack>
        <Typography color='text.secondary' variant='caption'>
          {getRuleLabel(variant)}
        </Typography>
        {variant.max_selected === 1 ? (
          <RadioGroup
            onChange={(_, val) =>
              handleSelect(variant, val === '' ? null : Number(val), true)
            }
            value={current[0] ?? ''}
          >
            {!isRequiredVariant(variant) && (
              <FormControlLabel
                control={<Radio />}
                label='Tidak ada'
                value=''
              />
            )}
            {variant.values.map((value) => (
              <FormControlLabel
                control={<Radio />}
                key={value.id}
                label={getLabel(value)}
                value={value.id}
              />
            ))}
          </RadioGroup>
        ) : (
          <FormGroup>
            {variant.values.map((value) => {
              const checked = current.includes(value.id)
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      disabled={
                        !checked && current.length >= variant.max_selected
                      }
                      onChange={(_, isChecked) =>
                        handleSelect(variant, value.id, isChecked)
                      }
                    />
                  }
                  key={value.id}
                  label={getLabel(value)}
                />
              )
            })}
          </FormGroup>
        )}
      </Box>
    )
  }

  const renderLines = () => {
    if (lines.length === 0) return null
    return (
      <Stack spacing={1}>
        <Typography>Di keranjang</Typography>
        {lines.map((line) => (
          <Stack
            direction='row'
            key={line.value_ids.join('-')}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography>
                {line.value_ids
                  .map((id) => valueNames.get(id))
                  .filter(Boolean)
                  .join(', ') || 'Tanpa pilihan'}
              </Typography>
              <Typography color='text.secondary' variant='caption'>
                {formatCents(getSelectionPrice(product, line.value_ids))}
              </Typography>
            </Box>
            <Stack direction='row' sx={{ alignItems: 'center' }}>
              <IconButton onClick={() => onChange(line.value_ids, false)}>
                <RemoveCircleOutlineOutlinedIcon />
              </IconButton>
              <Typography>{line.qty}</Typography>
              <IconButton onClick={() => onChange(line.value_ids, true)}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
    )
  }

  return (
    <Modal open onClose={onClose}>
      <Stack spacing={2}>
        <Typography variant='h5'>{product.name}</Typography>
        <Stack spacing={2} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {product.variants.map(renderVariant)}
          {renderLines()}
        </Stack>
        {unmetVariants.length > 0 && (
          <Typography color='error' variant='caption'>
            Lengkapi pilihan: {unmetVariants.map((dt) => dt.name).join(', ')}
          </Typography>
        )}
        <Stack
          direction='row'
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography>
            {formatCents(getSelectionPrice(product, valueIds))}
          </Typography>
          <Stack direction='row' spacing={2}>
            <Button onClick={onClose} variant='outlined'>
              Tutup
            </Button>
            <Button
              disabled={unmetVariants.length > 0}
              onClick={() => onChange(valueIds, true)}
              variant='contained'
            >
              Tambah ke keranjang
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  )
}
