import React, { useEffect, useState } from 'react'
import { fetchData } from '../../components/FetchData'
import { DashboardUrl } from '../../services/ApiUrls'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { FaBuilding, FaAddressBook, FaUsers, FaHandshake } from 'react-icons/fa'
import { ROLE_PERMISSIONS } from '../../constants/role_permissions'
import { hasAccess } from '../../utils/permissions'
import { Link, useNavigate } from 'react-router-dom';
import { FunnelChart, Funnel, LabelList, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Legend,Bar, BarChart,XAxis, YAxis,  PieLabelRenderProps } from "recharts";

interface DashboardData {
  leads_count: number
  leads_this_month: number
  leads_in_process_this_month: number
  kpi_leads: number
  leads_status_count: {
    assigned: number
    in_process: number
    converted: number
    recycled: number
    closed: number  
  }

  contacts_count: number
  contacts_this_month: number
  contacts_source_chart: {
    source: string;
    value: number;
  }[];
 
  contacts: any[]
  leads: any[]

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
    { label: 'leads', value: dash_data?.leads_this_month ?? 0, extraText:'Total this month',icon: <FaUsers size={20} /> },
    { label: 'leads', value: dash_data?.leads_in_process_this_month ?? 0, extraText:'In process this month',icon: <FaUsers size={20} /> },
  
    { label: 'leads', value: kpi_leads ?? 0, extraText:'KPI converted/total',icon: <FaUsers size={20} /> },
  
    { label: 'contacts', value: dash_data?.contacts_count ?? 0, extraText:'Total', icon: <FaAddressBook size={20} /> },
    { label: 'contacts', value: dash_data?.contacts_this_month ?? 0, extraText:'This month', icon: <FaAddressBook size={20} /> },
  
  ]
   
   const AllRecent_data = [
    { key: 'leads', title: 'Recent Leads', data: dash_data?.leads, path: 'leads/lead-details' },
 
     { key: 'contacts', title: 'Recent Contacts', data: dash_data?.contacts, path: '/app/contacts' }, 
   ]
  const Dash_data = AllDash_data.filter((stat) => hasAccess(role, stat.label));
  const colors = ['#e3f2fd', '#e3f2fd','#e3f2fd','#e8f5e9','#e8f5e9','#e8f5e9','#e8f5e9']

  {/* for Lead chart */}
  const Chart_leads = [
    { stage: "Assigned", value: dash_data?.leads_status_count.assigned ?? 0, fill: "#3b82f6ff" },
    { stage: "In Process", value: dash_data?.leads_status_count.in_process ?? 0, fill: "#22c55eff" },
    { stage: "Converted", value: dash_data?.leads_status_count.converted ?? 0, fill: "#10b981ff" },
    { stage: "Recycled", value: dash_data?.leads_status_count.recycled ?? 0, fill: "#db8616ff" },
    { stage: "Closed", value: dash_data?.leads_status_count.closed ?? 0, fill: "#f01010ff" }
  ];

  {/* for contacts chart */}
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560"];
    
const renderLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  const _cx = Number(cx ?? 0);
  const _cy = Number(cy ?? 0);
  const _midAngle = Number(midAngle ?? 0);
  const _innerRadius = Number(innerRadius ?? 0);
  const _outerRadius = Number(outerRadius ?? 0);
  const _percent = Number(percent ?? 0);

  // Skip labels for very small slices
  if (_percent < 0.01) return null;

  const RADIAN = Math.PI / 180;
  const radius = _innerRadius + (_outerRadius - _innerRadius) / 2;
  const x = _cx + radius * Math.cos(-_midAngle * RADIAN);
  const y = _cy + radius * Math.sin(-_midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {`${(_percent * 100).toFixed(0)}%`}
    </text>
  );
};

  // main

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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
          {/* start charts section*/}
          <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "16px",
                backgroundColor: "#f3f4f6", // light gray
              }}
            >
              {/*Leads by status chart */}
              <div>      
                <h2 className="text-lg font-semibold mb-2">Leads by status</h2>
                <BarChart
                  width={500}
                  height={300}
                  data={Chart_leads}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                >
                  {/* Y-axis shows categories (stages) */}
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} />
                  
                  {/* X-axis shows values */}
                  <XAxis type="number" />
                  
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" barSize={25} radius={[0, 8, 8, 0]} />
                </BarChart>
              </div>
          {/*end Leads by status chart*/}
          
          {/* contacts chart*/}
            <div>  
                  <h2 className="text-lg font-semibold mb-2">Contacts by Source</h2>

                      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                        {/* Pie Chart */}
                        <PieChart width={300} height={300}>
                          <Pie
                            data={dash_data?.contacts_source_chart || []}
                            dataKey="value"
                            nameKey="source"
                            outerRadius={100}
                            label={renderLabel} // inside-slice percentages
                            labelLine={false}
                          >
                            {dash_data?.contacts_source_chart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>

                        {/* Custom Legend */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {dash_data?.contacts_source_chart.map((entry, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: COLORS[index % COLORS.length],
                                  borderRadius: "4px",
                                }}
                              />
                              <span>{entry.source}: {entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* */}
                  
              </div>
              {/*end contacts chart*/}
            </div>
            {/*end charts section*/}
    </div>
  )
}