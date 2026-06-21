import { Box } from '@mui/material'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

export const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { pathname, search } = location
  const context = {
    location,
    navigate,
    params,
    pathname,
    search,
  }
  return (
    <Box className='flex justify-center'>
      <Box className='max-w-3xl'>
        <Outlet context={context} />
      </Box>
    </Box>
  )
}

export default Layout
