import { CardContent, CardHeader, Card as MuiCard } from '@mui/material'
import type { JSX } from 'react/jsx-runtime'

type CardProps = {
  children: JSX.Element[] | JSX.Element
  title?: string
}

export const Card = ({ children, title }: CardProps) => {
  return (
    <MuiCard raised sx={{ borderRadius: '12px', padding: '1em' }}>
      <CardHeader title={title} />
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  )
}