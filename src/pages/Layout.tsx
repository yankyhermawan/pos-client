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
    <Box
      className='flex justify-center'
      sx={{
        backgroundColor: 'rgb(1, 1, 1, 0.1)',
        position: 'relative',
      }}
    >
      <Outlet context={context} />
    </Box>
  )
}

export default Layout
