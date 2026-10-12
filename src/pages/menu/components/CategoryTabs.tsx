import { Box, Tab, Tabs } from '@mui/material'
import type { Category } from '../../category/interface'

type CategoryTabsProps = {
  categories: Category[]
  onChange: (categoryId: number) => void
  value: number
}

// 0 is the client-only "all" item, real category ids start at 1
export const ALL_CATEGORY_ID = 0

export const CategoryTabs = ({
  categories,
  onChange,
  value,
}: CategoryTabsProps) => {
  const isKnown =
    value === ALL_CATEGORY_ID || categories.some((dt) => dt.id === value)

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        borderBottom: 1,
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 10,
      }}
    >
      <Tabs
        allowScrollButtonsMobile
        onChange={(_, val: number) => onChange(val)}
        scrollButtons='auto'
        value={isKnown ? value : ALL_CATEGORY_ID}
        variant='scrollable'
      >
        <Tab label='Semua' value={ALL_CATEGORY_ID} />
        {categories.map((category) => (
          <Tab key={category.id} label={category.name} value={category.id} />
        ))}
      </Tabs>
    </Box>
  )
}
