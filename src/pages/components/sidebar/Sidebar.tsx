import { Fragment, useState, type JSX } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {
  adminProgramList,
  type GroupProgramListProps,
} from '../../common/adminProgram'
import type { SidebarIcon } from './interface'
import HomeIcon from '@mui/icons-material/Home'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { useLocation, useNavigate } from 'react-router-dom'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import { Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useWindowWidth } from '../../utility/custom_hooks'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export default function SideBar({
  children,
  header,
}: {
  children: JSX.Element | JSX.Element[]
  header: JSX.Element | JSX.Element[]
}) {
  const navigate = useNavigate()
  const theme = useTheme()
  const windowWidth = useWindowWidth()
  const [open, setOpen] = useState(windowWidth >= 768)
  const location = useLocation()
  const [currSelected, setCurrSelected] = useState(
    location.pathname.split('/')[1],
  )
  const [childOpen, setChildOpen] = useState<string[]>([])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const getSidebarIcon = (icon: SidebarIcon): React.JSX.Element => {
    if (icon === 'home') {
      return <HomeIcon />
    }
    if (icon === 'inventory') {
      return <Inventory2Icon />
    }
    return <TableRowsIcon />
  }

  const handleSidebarClick = (pathName: string) => {
    navigate(pathName)
    setCurrSelected(pathName)
  }

  const handleToggleSidebarAccordion = (pathName: string) => {
    if (childOpen.includes(pathName)) {
      setChildOpen((prev) => prev.filter((dt) => dt !== pathName))
      return
    }
    setChildOpen((prev) => prev.concat(pathName))
  }

  const renderSidebarAccordion = (
    program: GroupProgramListProps,
    Icon: JSX.Element,
  ) => {
    const isDefaultOpen =
      program.children.filter((dt) => dt.path === currSelected).length > 0
    const isOpen = childOpen.includes(program.group) || isDefaultOpen
    return (
      <Fragment key={program.group}>
        <ListItem disablePadding key={program.group}>
          <ListItemButton
            onClick={() => handleToggleSidebarAccordion(program.group)}
          >
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={program.group} />
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <List disablePadding>
            {program.children.map((child) => (
              <ListItem key={child.path} disablePadding>
                <ListItemButton
                  onClick={() => handleSidebarClick(child.path)}
                  selected={currSelected === child.path.split('/')[1]}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{getSidebarIcon(child.icon)}</ListItemIcon>
                  <ListItemText primary={child.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Fragment>
    )
  }

  const renderSidebarPrograms = () => {
    return adminProgramList.map((program, key) => {
      const Icon = getSidebarIcon(program.icon)
      if ('group' in program) {
        return renderSidebarAccordion(program, Icon)
      }
      return (
        <ListItem key={key} disablePadding>
          <ListItemButton
            onClick={() => handleSidebarClick(program.path)}
            selected={currSelected === program.path.split('/')[1]}
          >
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={program.name} />
          </ListItemButton>
        </ListItem>
      )
    })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {header}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{renderSidebarPrograms()}</List>
        {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}
