import {
  CardContent,
  CardHeader,
  Card as MuiCard,
  type CardProps,
} from '@mui/material'
import type { JSX } from 'react/jsx-runtime'

type ModifiedCardProps = CardProps & {
  children: JSX.Element[] | JSX.Element
  title?: string
}

export const Card = ({ children, title, ...props }: ModifiedCardProps) => {
  const sx = {
    borderRadius: '12px',
    padding: '1em',
    ...props.sx,
  }
  return (
    <MuiCard {...props} raised sx={sx}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  )
}
