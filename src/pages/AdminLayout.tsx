import { useEffect, useState } from 'react'
import {
  cookieKeys,
  getCookiesValue,
  removeCookies,
  setCookiesValue,
  type CookieKeys,
} from './utility/local_storage'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import SideBar from './components/sidebar/Sidebar'
import { useAuthStore } from './auth/store'
import { adminProgramList, type ProgramListProps } from './common/adminProgram'
import { Box, FormControl, Typography } from '@mui/material'
import Select from './components/input/Select'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Menu from './components/menu/Menu'
import { handleLogout } from './utility/requests'
import type { Company, Store } from './auth/interface'

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
  const isAddEditView =
    !!params.path && ['add', 'edit', 'view'].includes(params.path.toLowerCase())

  const companiesFromCookie = getCookiesValue<Company[]>('companies') || []
  const storesFromCookie = getCookiesValue<Store[]>('stores') || []
  const companyIdFromCookie =
    Number(getCookiesValue('company_id')) || companiesFromCookie[0]?.id || null
  const storeIdFromCookie =
    Number(getCookiesValue('store_id')) ||
    storesFromCookie.filter((dt) =>
      companyIdFromCookie ? dt.company_id === companyIdFromCookie : true,
    )[0]?.id ||
    null
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

  const checkCookies = () => {
    const keys = ['companies', 'id', 'name', 'stores'] as CookieKeys[]
    return keys.every((key) => getCookiesValue(key))
  }

  useEffect(() => {
    if (!checkCookies()) {
      getMe()
    }
    if (selectedCompanyId || selectedStoreId) return
    if (storesFromCookie && storesFromCookie.length > 0) {
      const filtered = storesFromCookie.filter((dt) =>
        companyIdFromCookie ? dt.company_id === companyIdFromCookie : true,
      )
      setCookiesValue('store_id', filtered[0].id)
      return
    }

    if (companiesFromCookie && companiesFromCookie.length > 0) {
      setCookiesValue('company_id', companiesFromCookie[0].id)
      return
    }
  }, [])

  useEffect(() => {
    if (data) {
      const { companies, id, name, stores } = data
      setCookiesValue('companies', companies)
      setCookiesValue('id', id)
      setCookiesValue('name', name)
      setCookiesValue('stores', stores)
      if (stores && stores.length > 0) {
        setCookiesValue('store_id', stores[0].id)
        return
      }
      if (companies && companies.length > 0) {
        setCookiesValue('company_id', companies[0].id)
        return
      }
    }
  }, [data])

  useEffect(() => {
    const authCheck = () => {
      const token = getCookiesValue('token')
      if (!token) {
        cookieKeys.map((key) => removeCookies(key))
        navigate('/login')
      }
    }
    authCheck()
  }, [navigate])

  useEffect(() => {
    if (!selectedCompanyId) {
      removeCookies('company_id')
      return
    }
    setCookiesValue('company_id', selectedCompanyId)
  }, [selectedCompanyId])

  useEffect(() => {
    if (!selectedStoreId) {
      removeCookies('store_id')
      return
    }
    setCookiesValue('store_id', selectedStoreId)
  }, [selectedStoreId])

  if ('cookieStore' in window) {
    cookieStore.addEventListener('change', (e) => {
      e.changed.forEach((cookie) => {
        if (cookie.name?.toLowerCase() === 'store_id') {
          navigate(0)
        }
      })
    })
  }

  const handleChangeCompany = (value: string | number | null) => {
    const valNum = Number(value) || null
    setSelectedCompanyId(valNum)
    const currStores = storesFromCookie.filter((dt) =>
      valNum ? dt.company_id === valNum : true,
    )
    const currStoreId = currStores[0].id || null
    setSelectedStoreId(currStoreId)
  }

  const handleChangeStore = (value: string | number | null) => {
    const valNum = Number(value) || null
    setSelectedStoreId(valNum)
  }

  const renderSidebarHeader = () => {
    const companies = data ? data.companies : companiesFromCookie
    const stores = data ? data.stores : storesFromCookie
    const companiesOptions = companies.map((comp) => ({
      label: comp.name,
      value: comp.id,
    }))

    const storeOptions = stores
      .filter((store) => {
        if (!selectedCompanyId) return true
        return store.company_id === selectedCompanyId
      })
      .map((store) => ({
        label: store.name,
        value: store.id,
      }))

    return (
      <Box className='flex w-full items-center justify-between'>
        <Box className='flex flex-row'>
          <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
            <Select
              disabled={isAddEditView}
              label='Company'
              onChange={handleChangeCompany}
              options={companiesOptions}
              value={selectedCompanyId}
            />
          </FormControl>
          <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
            <Select
              disabled={isAddEditView}
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
                // eslint-disable-next-line no-console
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
