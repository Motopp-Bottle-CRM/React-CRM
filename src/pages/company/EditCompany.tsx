import {
  TextField,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  Divider,
} from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CompanyUrl } from '../../services/ApiUrls'
import { CustomAppBar } from '../../components/CustomAppBar'
import { fetchData } from '../../components/FetchData'
import '../../styles/style.css'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'

type FormErrors = {
  name?: string[]
  address?: string[]
  telephone?: string[]
}

function EditCompany() {
  const navigate = useNavigate()
  const location = useLocation()
  const [reset, setReset] = useState(false)
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    telephone: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setFormData({
      name: location?.state?.value?.name || '',
      address: location?.state?.value?.address || '',
      telephone: location?.state?.value?.telephone || '',
    })
  }, [location?.state?.id])

  useEffect(() => {
    if (reset) {
      setFormData({
        name: location?.state?.value?.name || '',
        address: location?.state?.value?.address || '',
        telephone: location?.state?.value?.telephone || '',
      })
    }
    return () => {
      setReset(false)
    }
  }, [reset, location?.state?.value])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitForm()
  }

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    const data = {
      name: formData.name,
      address: formData.address,
      telephone: formData.telephone,
    }
    fetchData(
      `${CompanyUrl}/${location?.state?.id}`,
      'PUT',
      JSON.stringify(data),
      Header
    )
      .then((res: any) => {
        if (!res.error) {
          backbtnHandle()
        }
        if (res.error) {
          setError(true)
          // setErrors(res?.errors?.contact_errors)
        }
      })
      .catch(() => {})
  }

  const resetForm = () => {
    setFormData({ name: '', address: '', telephone: '' })
    setErrors({})
  }

  const backbtnHandle = () => {
    navigate('/app/companies/company-details', {
      state: { companyId: { id: location?.state?.id }, detail: true },
    })
  }

  const module = 'Companies'
  const crntPage = 'Edit Company'
  const backBtn = 'Back To Company Detail'

  const onCancel = () => {
    setReset(true)
  }

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        crntPage={crntPage}
        backBtn={backBtn}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: '120px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className="leadContainer">
              <Accordion style={{ width: '98%' }} defaultExpanded>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Company Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    autoComplete="off"
                  >
                    {/* Name */}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Name</div>
                        <TextField
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={errors?.name?.[0] ? errors?.name[0] : ''}
                          error={!!errors?.name?.[0]}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Address</div>
                        <TextField
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          placeholder="Street, City, Country"
                        />
                      </div>
                    </div>

                    {/* Telephone */}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Telephone</div>
                        <TextField
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          placeholder="+31 6 1234 5678"
                        />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </form>
      </Box>
    </Box>
  )
}

export default EditCompany
