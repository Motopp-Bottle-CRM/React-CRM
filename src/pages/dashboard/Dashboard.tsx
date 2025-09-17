import React, { useEffect, useState } from 'react'
import { fetchData } from '../../components/FetchData'
import { DashboardUrl } from '../../services/ApiUrls'
import { Box, Paper, Typography } from '@mui/material'
import { FaBuilding, FaAddressBook, FaUsers, FaHandshake } from 'react-icons/fa'
import { ROLE_PERMISSIONS } from '../../constants/role_permissions'
import { hasAccess } from '../../utils/permissions'
import { Link, useNavigate } from 'react-router-dom';

interface DashboardData {
  accounts_count: number
  contacts_count: number
  leads_count: number
  opportunities_count: number
  accounts: any[]
  contacts: any[]
  leads: any[]
  opportunities: any[]
}

export default function Dashboard() {
  const [dash_data, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    getDashboard()
  }, [])

  const getDashboard = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }

    fetchData(`${DashboardUrl}`, 'GET', null as any, Header)
      .then((data) => setDashboardData(data))
      .catch((error) => console.error('Error fetching dashboard data:', error))
  }
    const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'SALES'  

  const Allstats = [
    { label: 'leads', value: dash_data?.leads_count ?? 0, icon: <FaUsers size={30} /> },
    { label: 'opportunities', value: dash_data?.opportunities_count ?? 0, icon: <FaHandshake size={30} /> },
    { label: 'accounts', value: dash_data?.accounts_count ?? 0, icon: <FaBuilding size={30} /> },
    { label: 'contacts', value: dash_data?.contacts_count ?? 0, icon: <FaAddressBook size={30} /> },
   ]

  const stats = Allstats.filter((stat) => hasAccess(role, stat.label));
  const colors = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0']

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        {stats.map((stat, index) => (
          <Paper
            key={stat.label}
            sx={{
              flex: 1,
              p: 3,
              textAlign: 'center',
              backgroundColor: colors[index],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Box sx={{ mb: 1 }}>{stat.icon}</Box>
            <Typography variant="h6">{stat.label}</Typography>
            <Typography variant="h4">{stat.value}</Typography>
          </Paper>
        ))}
      </Box>
      

 <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
  {[
    { key: 'leads', title: 'Last Leads', data: dash_data?.leads, path: '/app/leads' },
    { key: 'contacts', title: 'Last Contacts', data: dash_data?.contacts, path: '/app/contacts' },
    { key: 'opportunities', title: 'Last Opportunities', data: dash_data?.opportunities, path: '/app/opportunities' },
    { key: 'accounts', title: 'Last Accounts', data: dash_data?.accounts, path: '/app/accounts' },
  ].map((item, index) => {
    if (!hasAccess(role, item.key)) return null; // роль не має доступу
    const colorPalette = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0'];
    return (
      <Paper
        key={item.key}
        sx={{
          flex: 1,
          minWidth: 220,
          p: 3,
          textAlign: 'center',
          backgroundColor: colorPalette[index],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>{item.title}</Typography>
        <Box sx={{ mb: 1 }}>
          {item.data?.slice(-3).map((entry: any, idx: number) => (
            <Typography key={idx} variant="body2">
              {entry.name || entry.title || `#${entry.id ?? idx}`}
            </Typography>
          ))}
        </Box>
            <Box sx={{ mb: 1 }}>
            {item.data?.slice(-3).map((entry: any, idx: number) => (
                <Typography
                key={idx}
                variant="body2"
                sx={{ fontWeight: 'bold', textAlign: 'left', display: 'block' }}
                >
                <Link 
                    to={`/app/${item.key}/${entry.id}`} 
                    style={{ textDecoration: 'none', color: '#1e88e5' }}
                >
                    {entry.name || entry.title || `#${entry.id ?? idx}`}
                </Link>
                </Typography>
            ))}
            </Box>
      </Paper>
    )
  })}
</Box>

    </div>
  )
}