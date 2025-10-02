import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  FaAddressBook,
  FaBars,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaCog,
  FaDiceD6,
  FaHandshake,
  FaUser,
  FaIndustry,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { fetchData } from './FetchData'
import { ProfileUrl } from '../services/ApiUrls'
import { Header1 } from './FetchData'
import OrganizationModal from '../pages/organization/OrganizationModal'
import Leads from '../pages/leads/Leads'
import AddContacts from '../pages/contacts/AddContacts'
import { EditLead } from '../pages/leads/EditLead'
import LeadDetails from '../pages/leads/LeadDetails'
import Contacts from '../pages/contacts/Contacts'
import EditContact from '../pages/contacts/EditContacts'
import ContactDetails from '../pages/contacts/ContactDetails'
import Users from '../pages/users/Users'
import Opportunities from '../pages/opportunities/Opportunities'
import Cases from '../pages/cases/Cases'
import { AddLeads } from '../pages/leads/AddLeads'
import Accounts from '../pages/accounts/Accounts'
import { AddAccount } from '../pages/accounts/AddAccount'
import { EditAccount } from '../pages/accounts/EditAccount'
import { AccountDetails } from '../pages/accounts/AccountDetails'
import { AddUsers } from '../pages/users/AddUsers'
import { EditUser } from '../pages/users/EditUser'
import UserDetails from '../pages/users/UserDetails'
import { AddOpportunity } from '../pages/opportunities/AddOpportunity'
import { EditOpportunity } from '../pages/opportunities/EditOpportunity'
import { OpportunityDetails } from '../pages/opportunities/OpportunityDetails'
import { AddCase } from '../pages/cases/AddCase'
import { EditCase } from '../pages/cases/EditCase'
import { CaseDetails } from '../pages/cases/CaseDetails'
import { MyProfile } from '../pages/profile/MyProfile'
import logo from '../assets/images/auth/img_logo.png'
import { StyledListItemButton, StyledListItemText } from '../styles/CssStyled'
import MyContext from '../context/Context'
import Dashboard from '../pages/dashboard/Dashboard'
import { hasAccess } from '../utils/permissions'
import { ROLE_PERMISSIONS } from '../constants/role_permissions'
import { allNavList } from '../constants/navigation_modules'
import NotFounded from  '../pages/NotFounded'
import ProtectedRoute from "../components/ProtectedRoute";
import Company from '../pages/company/Company'
import AddCompany from '../pages/company/AddCompany'
import EditCompany from '../pages/company/EditCompany'
import CompanyDetails from '../pages/company/CompanyDetails'

export default function Sidebar(props: any) {
  const navigate = useNavigate()
  const location = useLocation()
  const [screen, setScreen] = useState('contacts')
  const [drawerWidth, setDrawerWidth] = useState(200)
  const [headerWidth, setHeaderWidth] = useState(drawerWidth)
  const [userDetail, setUserDetail] = useState('')
  const [organizationModal, setOrganizationModal] = useState(false)

  const email = localStorage.getItem('email') || 'No email'
  const role = localStorage.getItem('role') || 'SALES'

  const organizationModalClose = () => {
    setOrganizationModal(false)
  }



const toggleScreen = () => {
  const path = location.pathname.split("/")[2] || "dashboard";

  const PATH_MODULE_MAP: Record<string, string> = {
    dashboard: "dashboard",
    leads: "leads",
    contacts: "contacts",
    opportunities: "opportunities",
    accounts: "accounts",
    companies: "companies",
    users: "users",
    cases: "cases",
  };

  const module = PATH_MODULE_MAP[path];

  if (module && hasAccess(role, module)) {
    setScreen(module);
  } else {
    setScreen("dashboard");
  }
};

useEffect(() => {
  toggleScreen();
}, [navigate, location.pathname, role]);



  const userProfile = () => {
    const Header1 = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
    }
    fetchData(`${ProfileUrl}/`, 'GET', null as any, Header1)
      .then((res: any) => {
        console.log('API response:', res) // logs entire response
        console.log('User object:', res?.user_obj) // logs user_obj specifically
        if (res?.user_obj) {
          setUserDetail(res.user_obj)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }


  // forming list of menu items with icons which are allowed for this role
  // only include modules allowed for this role
  const navList = allNavList.filter((module) => ROLE_PERMISSIONS[role]?.includes(module))

  // Map module names to icons
  const MODULE_ICONS: Record<string, JSX.Element> = {
    leads: <FaUsers />,
    contacts: <FaAddressBook />,
    opportunities: <FaHandshake />,
    accounts: <FaBuilding />,
    users: <FaUserFriends />,
    cases: <FaBriefcase />,
  }

  // Function to return icon, with highlight if active
  const navIcons = (module: string, activeModule: string): JSX.Element => {
    const Icon = MODULE_ICONS[module] || <FaDiceD6 />
    // Clone the icon element and override fill color if active
    return React.cloneElement(Icon, {
      fill: module === activeModule ? '#3e79f7' : undefined,
    })
  }


  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    userProfile()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  // console.log(screen, 'sidebar');
  const context = { drawerWidth: drawerWidth, screen: screen }
  return (
    <>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: '60px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            boxShadow: '1px',
          }}
        >
          <Box>
            <Toolbar>
              {drawerWidth === 60 ? (
                <img
                  src={logo}
                  width={'40px'}
                  style={{
                    transform: 'rotate(270deg)',
                    marginLeft: '-15px',
                    marginRight: '10px',
                  }}
                />
              ) : (
                <img
                  src={logo}
                  width={'100px'}
                  style={{ marginLeft: '-5px', marginRight: '30px' }}
                />
              )}
              <IconButton
                sx={{ ml: '-10px' }}
                onClick={() => setDrawerWidth(drawerWidth === 60 ? 200 : 60)}
              >
                <FaBars style={{ height: '20px' }} />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: 'black',
                  ml: '20px',
                  textTransform: 'capitalize',
                  fontSize: '20px',
                  mt: '5px',
                }}
              >
                {screen}
              </Typography>
            </Toolbar>
          </Box>
          <Box
            style={{
              marginRight: '10px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >

            <Typography
              variant="body2"
              sx={{
                textAlign: 'left',
                mt: 0,
                fontWeight: 'bold',
                color: '#0f3389ff',
                lineHeight: 1,
              }}
            >
              {email.charAt(0).toUpperCase() + email.slice(1)}
            </Typography>
            <IconButton onClick={handleClick} sx={{ mr: 3 }}>
              <Avatar
                sx={{ height: '27px', width: '27px', bgcolor: '#3e79f7' }}
              >
                {email.charAt(0).toUpperCase()} {/* first letter only */}
              </Avatar>
            </IconButton>


            <Popover
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
            >
              <List disablePadding>
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => {
                      localStorage.clear()
                      navigate('/login')
                    }}
                  >
                    <ListItemIcon>
                      {' '}
                      <FaSignOutAlt fill="#3e79f7" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={'Sign out'}
                      sx={{ ml: '-20px', color: '#3e79f7' }}
                    />
                  </StyledListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => setOrganizationModal(!organizationModal)}
                  >
                    <ListItemIcon>
                      {' '}
                      <FaIndustry fill="#3e79f7" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={'Organization'}
                      sx={{ ml: '-20px', color: '#3e79f7' }}
                    />
                  </StyledListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => {
                      navigate('/app/profile')
                      handleClose()
                      setScreen('My Profile')
                    }}
                  >
                    <ListItemIcon>
                      {' '}
                      <FaUser fill="#3e79f7" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={'My Profile'}
                      sx={{ ml: '-20px', color: '#3e79f7' }}
                    />
                  </StyledListItemButton>
                </ListItem>
              </List>
            </Popover>
          </Box>
        </AppBar>

        {/*  Creating  of the  left-side menu */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box>
            <List sx={{ pt: '65px' }}>
              {navList.map((text, index) => (
                <ListItem key={text} disablePadding>
                  <StyledListItemButton
                    sx={{ pt: '6px', pb: '6px' }}
                    onClick={() => {
                      navigate(`/app/${text}`)
                      setScreen(text)
                    }}
                    selected={screen === text}
                  >
                    <ListItemIcon sx={{ ml: '5px' }}>
                      {navIcons(text, screen)}
                    </ListItemIcon>
                    <StyledListItemText
                      primary={text}
                      sx={{ ml: -2, textTransform: 'capitalize' }}
                    />
                  </StyledListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <MyContext.Provider value={context}>
          {/* <Box sx={{ width: drawerWidth === 60 ? '1380px' : '1240px', ml: drawerWidth === 60 ? '60px' : '200px', overflowX: 'hidden' }}> */}
          <Box
            sx={{
              width: 'auto',
              ml: drawerWidth === 60 ? '60px' : '200px',
              overflowX: 'hidden',
            }}
          >

            <Routes>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              <Route path="/app/dashboard" element={<Dashboard />} />

              {/* Leads */}
              <Route
                path="/app/leads"
                element={
                  <ProtectedRoute role={role} module="leads">
                    <Leads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/leads/add-leads"
                element={
                  <ProtectedRoute role={role} module="leads">
                    <AddLeads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/leads/edit-lead"
                element={
                  <ProtectedRoute role={role} module="leads">
                    <EditLead />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/leads/lead-details"
                element={
                  <ProtectedRoute role={role} module="leads">
                    <LeadDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/leads/lead-details/:leadId"
                element={
                  <ProtectedRoute role={role} module="leads">
                    <LeadDetails />
                  </ProtectedRoute>
                }
              />

              {/* Companies */}
              <Route
                path="/app/companies"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <Company />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/companies/add-company"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <AddCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/companies/edit-company"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <EditCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/companies/edit-company/:id"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <EditCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/companies/company-details"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <CompanyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/companies/company-details/:id"
                element={
                  <ProtectedRoute role={role} module="companies">
                    <CompanyDetails />
                  </ProtectedRoute>
                }
              />

              {/* Contacts */}
              <Route
                path="/app/contacts"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/contacts/add-contacts"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <AddContacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/contacts/contact-details"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <ContactDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/contacts/contact-details/:id"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <ContactDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/contacts/edit-contact"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <EditContact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/contacts/edit-contact/:id"
                element={
                  <ProtectedRoute role={role} module="contacts">
                    <EditContact />
                  </ProtectedRoute>
                }
              />

              {/* Accounts */}
              <Route
                path="/app/accounts"
                element={
                  <ProtectedRoute role={role} module="accounts">
                    <Accounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/accounts/add-account"
                element={
                  <ProtectedRoute role={role} module="accounts">
                    <AddAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/accounts/edit-account"
                element={
                  <ProtectedRoute role={role} module="accounts">
                    <EditAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/accounts/account-details"
                element={
                  <ProtectedRoute role={role} module="accounts">
                    <AccountDetails />
                  </ProtectedRoute>
                }
              />

              {/* Users */}
              <Route
                path="/app/users"
                element={
                  <ProtectedRoute role={role} module="users">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/users/add-users"
                element={
                  <ProtectedRoute role={role} module="users">
                    <AddUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/users/edit-user"
                element={
                  <ProtectedRoute role={role} module="users">
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/users/user-details"
                element={
                  <ProtectedRoute role={role} module="users">
                    <UserDetails />
                  </ProtectedRoute>
                }
              />

              {/* Opportunities */}
              <Route
                path="/app/opportunities"
                element={
                  <ProtectedRoute role={role} module="opportunities">
                    <Opportunities />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/opportunities/add-opportunity"
                element={
                  <ProtectedRoute role={role} module="opportunities">
                    <AddOpportunity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/opportunities/opportunity-details"
                element={
                  <ProtectedRoute role={role} module="opportunities">
                    <OpportunityDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/opportunities/edit-opportunity"
                element={
                  <ProtectedRoute role={role} module="opportunities">
                    <EditOpportunity />
                  </ProtectedRoute>
                }
              />

              {/* Cases */}
              <Route
                path="/app/cases"
                element={
                  <ProtectedRoute role={role} module="cases">
                    <Cases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/cases/add-case"
                element={
                  <ProtectedRoute role={role} module="cases">
                    <AddCase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/cases/edit-case"
                element={
                  <ProtectedRoute role={role} module="cases">
                    <EditCase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/cases/case-details"
                element={
                  <ProtectedRoute role={role} module="cases">
                    <CaseDetails />
                  </ProtectedRoute>
                }
              />

              {/* My Profile */}
              <Route path="/app/profile" element={<MyProfile />} />

              {/* Not Found */}
              <Route path="/not-found" element={<NotFounded />} />
              <Route path="*" element={<NotFounded />} />
            </Routes>


          </Box>
        </MyContext.Provider>
        <OrganizationModal
          open={organizationModal}
          handleClose={organizationModalClose}
        />
      </Box>
    </>
  )
}
