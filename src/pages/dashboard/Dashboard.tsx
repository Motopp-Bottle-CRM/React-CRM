import React, { useEffect, useState } from 'react'
import { fetchData } from '../../components/FetchData'
import { DashboardUrl } from '../../services/ApiUrls'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { FaBuilding, FaAddressBook, FaUsers, FaHandshake } from 'react-icons/fa'
import { ROLE_PERMISSIONS } from '../../constants/role_permissions'
import { hasAccess } from '../../utils/permissions'
import { Link, useNavigate } from 'react-router-dom';
import { FunnelChart, Funnel, LabelList, Tooltip } from "recharts";

interface DashboardData {
  accounts_count: number
  contacts_count: number
  leads_count: number
  opportunities_count: number
  leads_this_month: number
  kpi_leads: number
  leads_assigned: number
  leads_inprocess: number
  leads_converted: number
  leads_recycled: number
  leads_closed: number
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
  
  const kpi_leads = ((dash_data?.kpi_leads ?? 0) * 100).toFixed(2) + "%";

  const AllDash_data = [
    { label: 'leads', value: dash_data?.leads_count ?? 0, extraText:'Total',icon: <FaUsers size={20} /> },
    { label: 'leads', value: dash_data?.leads_this_month ?? 0, extraText:'This month',icon: <FaUsers size={20} /> },
    { label: 'leads', value: kpi_leads ?? 0, extraText:'KPI ',icon: <FaUsers size={20} /> },
  
    // { label: 'opportunities', value: dash_data?.opportunities_count ?? 0, extraText:'Total',icon: <FaHandshake size={20} /> },
    // { label: 'accounts', value: dash_data?.accounts_count ?? 0, extraText:'total', icon: <FaBuilding size={20} /> },
    
    { label: 'contacts', value: dash_data?.contacts_count ?? 0, extraText:'Total', icon: <FaAddressBook size={20} /> },
   ]
   
   const AllRecent_data = [
    { key: 'leads', title: 'Recent Leads', data: dash_data?.leads, path: 'leads/lead-details' },
    // { key: 'opportunities', title: 'Recent Opportunities', data: dash_data?.opportunities, path: '/app/opportunities' },
    // { key: 'accounts', title: 'Recent Accounts', data: dash_data?.accounts, path: '/app/accounts' },
    //
     { key: 'contacts', title: 'Recent Contacts', data: dash_data?.contacts, path: '/app/contacts' }, 
   ]
  const Dash_data = AllDash_data.filter((stat) => hasAccess(role, stat.label));
  const colors = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0']

  {/* for chart */}
  const Chart_leads = [
    { stage: "Assigned", value: dash_data?.leads_assigned ?? 0, fill: "#04702fff"},
    { stage: "In process", value: dash_data?.leads_inprocess ?? 0, fill: "#42a878ff"},
    { stage: "Converted", value: dash_data?.leads_converted ?? 0, fill: "#cff37cff"},
    { stage: "Recycled", value:   dash_data?.leads_recycled ?? 0, fill: "#db8616ff"},
    { stage: "Closed", value: dash_data?.leads_closed ?? 0, fill: "#f01010ff"},
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        {Dash_data.map((stat, index) => (
            <Paper
            key={stat.label}
            sx={{
                flex: 1,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "20px", // oval effect
                backgroundColor: colors[index],
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                },
            }} 
            >
            {/* Left side: icon + label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {stat.icon}

            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>{stat.label}</Typography>
                <Typography variant="h6" color="text.secondary"> {stat.extraText}</Typography>
            </Box>
            </Box>

            {/* Right side: value */}
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {stat.value}
            </Typography>
            </Paper>
        ))}
        </Box>
      

        <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
        {AllRecent_data.map((item, index) => {
            if (!hasAccess(role, item.key)) return null; // роль не має доступу

            return (
           <Box key={item.key} sx={{ flex: 1, minWidth: 220 }}>
            {/* Title above card */}
            <Box
                sx={{
                textAlign: "center",
                }}
            >
                <Typography >{item.title}</Typography>
            </Box>



            {/* Card */}
            <Paper
                sx={{
                p: 3,
                backgroundColor: "#f5f5f5", // light grey background
                border: `1px solid #1A3353`, // colorful border
                borderRadius: "20px", // oval border
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                }}
            >
                <Box sx={{ mb: 1 }}>
                {item.data?.slice(-3).map((entry: any, idx: number) => (
                    <Typography
                    key={idx}
                    variant="body2"
                    sx={{ fontWeight: "bold", textAlign: "left", display: "block" }}
                    >
                    <div
                        style={{
                        color: "#1A3353",
                        fontSize: "16px",
                        marginBottom: 0,
                        }}
                    >
                        {entry.name || entry.title || `#${entry.id ?? idx}`}
                    </div>
                    <div style={{
                              color: 'gray',
                              fontSize: '10px',
                              marginTop: 0,
                        }}
                    >
                        {/* <ul>
                            <li> country - <span style={{ color: '#1a3353' }}> {entry?.country || ''}</span></li>
                            <li> source - 
                            <span style={{ color: '#1a3353', fontWeight: 700 }}>
                              {entry?.source || '--'}</span></li>
                            <li>status - 
                            <span style={{ color: '#1a3353', fontWeight: 700 }}>
                              {entry?.status || '--'}</span></li>
                        </ul> */}
                            
                    </div>
                    </Typography>
                ))}
                </Box>
            </Paper>
            </Box>
            )
        })}
        </Box>
          {/* chart */}
          <FunnelChart width={300} height={300}>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={Chart_leads}
                  isAnimationActive
                >
                 {/* Labels with stage names */}
                <LabelList
                  position="right"
                  dataKey="stage"
                  fill="#000"
                  stroke="none"
                />
                {/* Labels with numbers */}
                <LabelList
                  position="insideRight"
                  dataKey="value"
                  fill="#000"
                  stroke="none"
                  
                />
                </Funnel>
              </FunnelChart>
    </div>
  )
}