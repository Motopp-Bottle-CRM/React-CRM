import React, { useEffect, useState } from 'react'
import { fetchData } from '../../components/FetchData'
import { DashboardUrl } from '../../services/ApiUrls'
import { Box, Paper, Typography } from '@mui/material'
import { FaAddressBook, FaUsers, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
;
import { hasAccess } from '../../utils/permissions'
import { Link, useNavigate } from 'react-router-dom';
import { LabelList, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Bar, BarChart,XAxis, YAxis,  PieLabelRenderProps } from "recharts";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    getDashboard()
  }, [])
 
  function LiveClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return (
      <Typography variant="body1" color="text.secondary">
        {currentTime.toLocaleString()}
      </Typography>
    );
  }


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


  const Dash_data = [
    { label: 'leads', value: dash_data?.leads_count ?? 0, extraText:'Total',icon: <FaUsers size={30} /> },
    { label: 'leads', value: dash_data?.leads_this_month ?? 0, extraText:'This month',icon: <FaUsers size={30} /> },
    { label: 'leads - month', value: dash_data?.leads_in_process_this_month ?? 0, extraText:'In process ',icon: <FaUsers size={30} /> },
    { label: 'leads', value: kpi_leads ?? 0, extraText:'KPI',icon: <FaUsers size={30} /> },
  ]
  
  const Dash_contacts_data = [
    { label: 'contacts', value: dash_data?.contacts_count ?? 0, extraText:'Total', icon: <FaAddressBook size={40} /> },
    { label: 'contacts', value: dash_data?.contacts_this_month ?? 0, extraText:'This month', icon: <FaAddressBook size={40} /> },
  ]
   
   const AllRecent_data = [
    { key: 'leads', title: 'Recent Leads', data: dash_data?.leads, path: 'leads/lead-details' ,icon: <FaClock size={20} /> }
    ]
    const AllRecent_contacts_data = [
    { key: 'contacts', title: 'Recent Contacts', data: dash_data?.contacts, path: '/app/contacts' ,icon: <FaClock size={20} /> }, 
    ]
 
  {/* for Lead chart */}
  const Chart_leads = [
    { stage: "Assigned", value: dash_data?.leads_status_count.assigned ?? 0, fill: "#3b82f6ff" },
    { stage: "In Process", value: dash_data?.leads_status_count.in_process ?? 0, fill: "#22c55eff" },
    { stage: "Converted", value: dash_data?.leads_status_count.converted ?? 0, fill: "#10b981ff" },
    { stage: "Recycled", value: dash_data?.leads_status_count.recycled ?? 0, fill: "#db8616ff" },
    { stage: "Closed", value: dash_data?.leads_status_count.closed ?? 0, fill: "#a70c0cff" }
  ];

  {/* for contacts chart */}
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560", "#4e55dcff", "#9f0b95ff"];
        
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
    <div style={{ padding: '20px',marginTop:'50px' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome to your  Dashboard
      </Typography>
      <LiveClock /> 
      {/* begin of leads section */}
      {hasAccess(role, "leads") && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",  // centers the row
          gap: 1,                    // smaller gap between columns
          mt: 2,
          p: 2,
          flexWrap: "wrap",          // allows wrapping on small screens
          backgroundColor: "#fbfbfbff",
          borderRadius: 2,
        }}
      >
        {/* Left column: KPI cards */}
        <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: "0 0 200px", // fixed width
            }}
          >
            {Dash_data.map((stat, index) => (
              <Paper
                key={`${stat.label}-${index}`}
                sx={{
                  p: 1, // smaller padding
                  width: "170px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                  backgroundColor: "#e3f2fd",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  minHeight: "20px", // reduce height
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  {stat.icon}
                  <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold", color: "#000000" }}>
                      {stat.extraText}
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#000000" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5">
                  {stat.value}
                </Typography>
              </Paper>
            ))}
          </Box>
        {/* end - Left column: KPI cards */}
        {/* Center column: Leads chart */}
        <Box
          sx={{
            flex: "0 0 auto", 
            minWidth: 320,
            maxWidth: "600px",
            display: "flex",
            justifyContent: "center",  // keeps chart centered
          }}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              boxShadow: "none",
              width: "100%",      // fills available space in this column
            }}
          >
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textAlign: "center",
                pb: 0.5,
                color: "#000000",
              }}
            ><FaCheckCircle size={20} style={{ marginRight: '10px' }} /> 
              Leads by status
            </Typography>
            <BarChart
              width={320}
              height={230}
              data={Chart_leads}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
            >
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} />
              <XAxis type="number" hide />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" barSize={40} radius={[0, 6, 6, 0]}>
                <LabelList dataKey="value" position="insideRight" fill="#fff" fontSize={12} />
              </Bar>
            </BarChart>
          </Paper>
        </Box>
        {/* end - Center column: Leads chart */}
        {/* Right column: Recent Leads */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            marginLeft: 5,
            flex: "0 0 200px",  // fixed width
            // Removed extra margin or spacing to bring it closer to chart
          }}
        >
          {AllRecent_data.map((item) => (
            <Paper
              key={item.key}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#f2f7f9ff",
                border: "1px solid #c0c0c0",
                display: "flex",
                flexDirection: "column",
                height: 238,
                width: 250,
                overflow: "hidden",
              }}
            >
              {/* Card Title */}
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  pb: 0.5,
                  borderBottom: "2px solid #c0c0c0",
                  color: "#000000",
                  fontWeight: "bold",
                }}
              >
                {item.icon} {item.title}
              </Typography>

              {/* Content Container */}
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                {/* Lead List */}
                <ol style={{ paddingLeft: "16px", margin: 0, flex: 1, overflowY: "auto" }}>
                 
                  {item.data?.slice(0, 4).map((entry: any, idx: number) => (
                    <li key={idx} style={{ marginBottom: 4, listStyleType: "decimal" }}>
                      <Link
                        to={`/app/leads/lead-details/${entry.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#1A3353",
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {entry.name || entry.title || `#${entry.id ?? idx}`}
                      </Link>

                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: "#36419c",
                          color: "#f5faf8ff",
                          borderRadius: "12px",
                          padding: "2px 8px",
                          fontSize: "0.5rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 60,
                          marginLeft: 4,
                        }}
                      >
                        {entry.status?.substring(0, 6)}
                      </span>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.7rem",
                          color: "#000000",
                          fontWeight: 300,
                          marginTop: 2,
                        }}
                      >
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        <span style={{ color: "#1A3353" }}>{entry.created_by?.email}</span>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Bottom-right "More Leads" link */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
                  <Link
                    to={`/app/leads/`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#1A3353" }}>more leads</span>
                    <FaArrowRight size={12} color="#1A3353" />
                  </Link>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* end - Right column: Recent Leads */}
      </Box>
      )}
      {/*  end of leads section */}

      {/*  begin of contacts section */}
      {hasAccess(role, "contacts") && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",  // align all columns to left
          gap: 1,                        // smaller gap between columns
          mt: 2,
          p: 2,
          flexWrap: "wrap",              // allows wrapping on small screens
          backgroundColor: "#fbfbfbff",
          borderRadius: 2,
        }}
      >
        {/* Left column: KPI cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: "0 0 200px",    // fixed width
          }}
        >
          {Dash_contacts_data.map((stat, index) => (
            <Paper
              key={`${stat.label}-${index}`}
              sx={{
                p: 1, // smaller padding
                width: "170px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "10px",
                minHeight: "20px",
                backgroundColor: "#ebf4ecff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {stat.icon}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold", color: "#000000" }}>
                    {stat.extraText}
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem", color: "#000000" }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5">
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Box>
        {/* end - Left column: KPI cards */}
        {/* Center column: Contacts by source chart */}
        <Box
          sx={{
            flex: "0 0 auto",       // only as wide as chart
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            marginLeft: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              textAlign: "center",
              pb: 0.5,
              color: "#000000",
            }}
          >
            LeadstoContacts by source
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Pie Chart */}
            <PieChart width={140} height={140}>
              <Pie
                data={dash_data?.contacts_source_chart?.slice().sort((a, b) => b.value - a.value) || []} // sorted descending
                dataKey="value"
                nameKey="source"
                outerRadius={60}
                label={renderLabel}
                labelLine={false}
              >
                {dash_data?.contacts_source_chart
                  ?.slice()
                  .sort((a, b) => b.value - a.value)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>

            {/* Custom Legend */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                maxWidth: "200px",
              }}
            >
              {dash_data?.contacts_source_chart
                ?.slice()
                .sort((a, b) => b.value - a.value)
                .map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "4px",
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: "12px",
                        minHeight: "12px",
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: "3px",
                        marginTop: "3px",
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.7rem",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {entry.source}: {entry.value}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
        {/* end - Center column: Contacts by source chart */}

        
        {/* Right column: Recent Contacts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            marginLeft: 5,
            flex: "0 0 200px",    // fixed width
            // small gap from chart if needed
          }}
        >
          {AllRecent_contacts_data.map((item) => (
            <Paper
              key={item.key}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#f2f7f9ff",
                border: "1px solid #c0c0c0",
                display: "flex",
                flexDirection: "column",
                height: 150,
                width: "250px",
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  pb: 0.5,
                  borderBottom: "2px solid #c0c0c0",
                  color: "#000000",
                  fontWeight: "bold",
                }}
              >
                {item.icon} {item.title}
              </Typography>

              <Box sx={{ overflow: "auto", flex: 1 }}>
                <ol style={{ paddingLeft: "16px", margin: 0 }}>
                  {item.data?.slice(-5).map((entry: any, idx: number) => (
                    <li
                      key={idx}
                      style={{ marginBottom: "4px", listStyleType: "decimal" }}
                    >
                      <Link
                        to={`/leads/lead-details/${entry.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#1A3353",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                       {entry.first_name} {entry.last_name}
                      </Link>
                      <div style={{ fontSize: "12px", color: "#555", marginTop: 2 }}>
                        <div><strong>Org.:</strong> {entry.organization || '-'}<strong> Job :</strong> {entry.title || '-'}</div>
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        <span style={{ color: "#1A3353" }}>{entry.created_by.email}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
      
      
       )}
     
    {/*  end of contacts section */}
    </div>
  )
}