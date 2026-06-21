import { useEffect, useState } from 'react'
import { getCookiesValue } from './utility/local_storage'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import SideBar from './components/sidebar/Sidebar'
import { useAuthStore } from './auth/store'
import { adminProgramList, type ProgramListProps } from './common/adminProgram'
import { Box, FormControl, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import Select from './components/input/Select'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Menu from './components/menu/Menu'
import { handleLogout } from './utility/requests'

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
  const { data, getMe } = useAuthStore()

  const companyIdFromCookie = Number(Cookies.get('company_id')) || null
  const storeIdFromCookie = Number(Cookies.get('store_id')) || null
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    companyIdFromCookie,
  )
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(
    storeIdFromCookie,
  )

  const getProgramTitle = () => {
    const { pathname } = location
    const flattenPrograms: ProgramListProps[] = []
    adminProgramList.map((dt) => {
      if ('children' in dt) {
        flattenPrograms.push(...dt.children)
        return
      }
      flattenPrograms.push(dt)
    })
    const selected = flattenPrograms.find((dt) => dt.path === pathname)
    const title = selected?.name || ''

    return <Typography variant='h3'>{title}</Typography>
  }

  useEffect(() => {
    getMe()
  }, [])

  useEffect(() => {
    const authCheck = async () => {
      const token = await getCookiesValue('token')
      if (!token) {
        navigate('/login')
      }
    }
    authCheck()
  }, [navigate])

  useEffect(() => {
    if (!selectedCompanyId) {
      Cookies.remove('company_id')
      return
    }
    Cookies.set('company_id', String(selectedCompanyId))
  }, [selectedCompanyId])

  useEffect(() => {
    if (!selectedStoreId) {
      Cookies.remove('store_id')
      return
    }
    Cookies.set('store_id', String(selectedStoreId))
  }, [selectedStoreId])

  const handleChangeCompany = (value: string | number | null) => {
    const valNum = Number(value) || null
    setSelectedCompanyId(valNum)
  }

  const handleChangeStore = (value: string | number | null) => {
    const valNum = Number(value) || null
    setSelectedStoreId(valNum)
  }

  const renderSidebarHeader = () => {
    if (!data) return <></>
    const { companies, stores } = data
    const companiesOptions = companies.map((comp) => ({
      label: comp.name,
      value: comp.id,
    }))

    const storeOptions = stores.map((store) => ({
      label: store.name,
      value: store.id,
    }))

    return (
      <Box className='flex w-full items-center justify-between'>
        <Box className='flex flex-row'>
          <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
            <Select
              label='Company'
              onChange={handleChangeCompany}
              options={companiesOptions}
              value={selectedCompanyId}
            />
          </FormControl>
          <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
            <Select
              label='Store'
              onChange={handleChangeStore}
              options={storeOptions}
              value={selectedStoreId}
            />
          </FormControl>
        </Box>
        <Box className='w-10'>
          <Menu
            label={
              <AccountCircleIcon
                className='hover:cursor-pointer'
                sx={{
                  color: 'background.default',
                  height: '100%',
                  width: '100%',
                }}
              />
            }
            options={[
              {
                label: 'Profile',
                onClick: () => console.log('profile'),
              },
              {
                label: 'Logout',
                onClick: handleLogout,
              },
            ]}
          />
        </Box>
      </Box>
    )
  }

  return (
    <SideBar header={renderSidebarHeader()}>
      <Box className='flex flex-col gap-4'>
        {getProgramTitle()}
        <Outlet context={context} />
      </Box>
    </SideBar>
  )
}

export default Layout
