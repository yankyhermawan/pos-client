import { lazy, type JSX } from 'react'
import type { SidebarIcon } from '../../components/sidebar/interface'

export type ProgramListProps = {
  addComponent?: React.LazyExoticComponent<() => JSX.Element>
  editComponent?: React.LazyExoticComponent<() => JSX.Element>
  viewComponent?: React.LazyExoticComponent<() => JSX.Element>
  component: React.LazyExoticComponent<() => JSX.Element>
  name: string
  icon: SidebarIcon
  path: `/${string}`
}

export type GroupProgramListProps = {
  children: ProgramListProps[]
  icon: SidebarIcon
  group: string
}

export const adminProgramList: (GroupProgramListProps | ProgramListProps)[] = [
  {
    component: lazy(() => import('../../dashboard/Dashboard')),
    icon: 'home',
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    children: [
      {
        addComponent: lazy(() => import('../../product/AddEditView')),
        editComponent: lazy(() => import('../../product/AddEditView')),
        viewComponent: lazy(() => import('../../product/AddEditView')),
        component: lazy(() => import('../../product/Product')),
        icon: 'inventory',
        name: 'Product',
        path: '/product',
      },
    ],
    icon: 'table',
    group: 'Master',
  },
]
