import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { adminProgramList } from './pages/common/adminProgram'
import Add from './pages/common/access/Add'
import Edit from './pages/common/access/Edit'
import View from './pages/common/access/View'

const Login = lazy(() => import('./pages/login/Login'))
const Menu = lazy(() => import('./pages/menu/Menu'))
const NotFoundPage = lazy(() => import('./pages/404'))
const AdminLayout = lazy(() => import('./pages/AdminLayout'))
const Home = lazy(() => import('./pages/home/Home'))
const Layout = lazy(() => import('./pages/Layout'))

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#4F46E5',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#0F172A',
        secondary: '#64748B',
      },
      divider: '#E2E8F0',
    },
    typography: {
      fontFamily: ['"Fredoka"', 'sans-serif'].join(','),
    },
  })

  const mapAdminPrograms = () =>
    adminProgramList.map((dt) => {
      if ('group' in dt) {
        return dt.children.map((child) => (
          <Route Component={child.component} path={child.path} />
        ))
      }
      return <Route Component={dt.component} path={dt.path} />
    })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route Component={Home} path='/' index />
          <Route Component={Layout}>
            <Route Component={Menu} path='/menu' />
          </Route>
          <Route Component={Login} path='/login' />
          <Route Component={AdminLayout}>
            <Route Component={Add} path='/:name/add' />
            <Route Component={Edit} path='/:name/edit/:identifier' />
            <Route Component={View} path='/:name/view/:identifier' />
            {mapAdminPrograms()}
          </Route>
          <Route Component={NotFoundPage} path='/404' />
          <Route Component={NotFoundPage} path='*' />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={2000}
        position='top-right'
        toastStyle={{ fontFamily: 'Fredoka,sans-serif' }}
      />
    </ThemeProvider>
  )
}
