import React, { useEffect, useState } from 'react'
import { Card, Box } from '@mui/material'
import { CustomAppBar } from '../../components/CustomAppBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { CompanyUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'

type CompanyResponse = {
  name: string
  address?: string
  telephone?: string
}

export default function CompanyDetails() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [companyDetails, setCompanyDetails] = useState<CompanyResponse | null>(
    null
  )

  useEffect(() => {
    getCompanyDetail(state?.companyId?.id)
  }, [state?.companyId?.id])

  const getCompanyDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    fetchData(`${CompanyUrl}/${id}`, 'GET', null as any, Header).then((res) => {
      if (!res.error) {
        setCompanyDetails(res?.data)
      }
    })
  }

  const backbtnHandle = () => {
    navigate('/app/companies')
  }

  const editHandle = () => {
    navigate('/app/companies/edit-company', {
      state: {
        value: {
          name: companyDetails?.name,
          address: companyDetails?.address || '',
          telephone: companyDetails?.telephone || '',
        },
        id: state?.companyId?.id,
      },
    })
  }

  const module = 'Companies'
  const crntPage = 'Company Detail'
  const backBtn = 'Back To Companies'

  return (
    <Box sx={{ mt: '60px' }}>
      <div>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
          editHandle={editHandle}
        />
        <Box
          sx={{
            mt: '120px',
            p: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Card sx={{ borderRadius: '7px' }}>
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#1a3353f0',
                  }}
                >
                  Company Information
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Name</div>
                  <div className="title3">{companyDetails?.name || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Address</div>
                  <div className="title3">{companyDetails?.address || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Telephone</div>
                  <div className="title3">{companyDetails?.telephone || '---'}</div>
                </div>
              </div>
            </Card>
          </Box>
        </Box>
      </div>
    </Box>
  )
}
