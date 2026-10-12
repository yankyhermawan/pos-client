// full width on phones, content width on larger screens
export const responsiveButtonSx = {
  maxWidth: { sm: 'fit-content', xs: 'none' },
  width: { sm: 'auto', xs: '100%' },
}

export const compactCardSx = {
  '& .MuiCardContent-root': {
    '&:last-child': { pb: { sm: 2, xs: 1 } },
    p: { sm: 2, xs: 1 },
  },
  '& .MuiCardHeader-root': { p: { sm: 2, xs: 1 } },
  padding: { sm: '1em', xs: '0.5em' },
}

export const flatCardSx = {
  ...compactCardSx,
  border: 1,
  borderColor: 'divider',
  boxShadow: 'none',
}
