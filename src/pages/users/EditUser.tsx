import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  TextField,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  TextareaAutosize,
  MenuItem,
  Tooltip,
  Button,
  Input,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Select,
  FormControl,
  FormHelperText,
  Alert,
} from '@mui/material'
import { UserUrl } from '../../services/ApiUrls'
import { fetchData, Header } from '../../components/FetchData'
//import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaArrowDown, FaTimes, FaUpload } from 'react-icons/fa'
import { AntSwitch, RequiredTextField } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import '../../styles/style.css'
import  { ROLES } from '../../constants/roles' 

type FormErrors = {
  email?: string[]
  role?: string[]
  phone?: string[]
  alternate_phone?: string[]
  address_line?: string[]
  street?: string[]
  city?: string[]
  state?: string[]
  postcode?: string[]
  country?: string[]
}
interface FormData {
  email: string
  role: string
  phone: string
  alternate_phone: string
  address_line: string
  street: string
  city: string
  state: string
  postcode: string
  country: string
}
export function EditUser() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Countries array with phone prefixes [code, name, phone_prefix]
  const countries = [
    ['IN', 'India', '+91'],
    ['US', 'United States', '+1'],
    ['GB', 'United Kingdom', '+44'],
    ['CA', 'Canada', '+1'],
    ['AU', 'Australia', '+61'],
    ['DE', 'Germany', '+49'],
    ['FR', 'France', '+33'],
    ['JP', 'Japan', '+81'],
    ['CN', 'China', '+86'],
    ['BR', 'Brazil', '+55'],
    ['MX', 'Mexico', '+52'],
    ['IT', 'Italy', '+39'],
    ['ES', 'Spain', '+34'],
    ['NL', 'Netherlands', '+31'],
    ['CH', 'Switzerland', '+41'],
    ['SE', 'Sweden', '+46'],
    ['NO', 'Norway', '+47'],
    ['DK', 'Denmark', '+45'],
    ['FI', 'Finland', '+358'],
    ['PL', 'Poland', '+48'],
    ['RU', 'Russian Federation', '+7'],
    ['KR', 'Korea, Republic of', '+82'],
    ['SG', 'Singapore', '+65'],
    ['TH', 'Thailand', '+66'],
  ]

  // Helper function to convert country name to country code
  const getCountryCodeFromName = (countryName: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find(
      (option: any) => option[1] === countryName
    )
    return country ? country[0] : countryName // Return the code if found, otherwise return the original value
  }

  // Helper function to convert country code to country name
  const getCountryNameFromCode = (countryCode: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find(
      (option: any) => option[0] === countryCode
    )
    return country ? country[1] : countryCode // Return the name if found, otherwise return the original value
  }

  // Helper function to get phone prefix for a country
  const getPhonePrefixForCountry = (countryCode: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find(
      (option: any) => option[0] === countryCode
    )
    return country && country[2] ? country[2] : '+91' // Return the prefix if found, otherwise default to +91
  }

  const [reset, setReset] = useState(false)
  const [error, setError] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [profileErrors, setProfileErrors] = useState<FormErrors>({})
  const [userErrors, setUserErrors] = useState<FormErrors>({})
  const [roleSelectOpen, setRoleSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [msg, setMsg] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [userStatus, setUserStatus] = useState<'Active' | 'Inactive' | 'Unknown'>('Unknown')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | null>(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    role: 'ADMIN',
    phone: '',
    alternate_phone: '',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  })
  
  // Check if current user is trying to deactivate themselves
  const isSelfDeactivation = (currentUserId && state?.id && currentUserId === state.id) || 
                            (currentUserEmail && formData.email && currentUserEmail === formData.email)
  
  // Debug logging
  console.log('Debug - currentUserId:', currentUserId)
  console.log('Debug - currentUserEmail:', currentUserEmail)
  console.log('Debug - state?.id:', state?.id)
  console.log('Debug - formData.email:', formData.email)
  console.log('Debug - isSelfDeactivation:', isSelfDeactivation)
  
  useEffect(() => {
    setFormData(state?.value)
    // Set user status from state if available
    if (state?.value?.is_active !== undefined) {
      setUserStatus(state.value.is_active ? 'Active' : 'Inactive')
    }
  }, [state?.id])

  // Get current user's ID to prevent self-deactivation
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const Header = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Token'),
          org: localStorage.getItem('org'),
        }
        
        // Get current user profile
        const response = await fetchData('profile/', 'GET', null, Header)
        console.log('Current user profile response:', response)
        if (!response.error && response.data) {
          const userId = response.data.id || response.data.user_id
          const userEmail = response.data.email || response.data.user_details?.email
          console.log('Setting current user ID:', userId)
          console.log('Setting current user email:', userEmail)
          setCurrentUserId(userId)
          setCurrentUserEmail(userEmail)
        }
      } catch (error) {
        console.error('Error fetching current user ID:', error)
        // Fallback: try to get user info from token
        try {
          const token = localStorage.getItem('Token')
          if (token) {
            // Decode JWT token to get user info (basic decode, no verification)
            const payload = JSON.parse(atob(token.split('.')[1]))
            console.log('Token payload:', payload)
            if (payload.user_id) {
              setCurrentUserId(payload.user_id)
            }
          }
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError)
        }
      }
    }
    
    getCurrentUserId()
  }, [])

  useEffect(() => {
    if (reset) {
      setFormData(state?.value)
    }
    return () => {
      setReset(false)
    }
  }, [reset])
  //

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(false)

        const Header = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Token'),
          org: localStorage.getItem('org'),
        }

        fetchData(`${UserUrl}/${state?.id}/`, 'GET', null as any, Header).then(
          (res: any) => {
            if (!res.error) {
              setLoading(false)
              const data = res?.data?.profile_obj
              setFormData({
                email: data?.user_details?.email || '',
                role: data?.role || '',
                phone: data?.phone || '',
                alternate_phone: data?.alternate_phone || '',
                address_line: data?.address?.address_line || '',
                street: data?.address?.street || '',
                city: data?.address?.city || '',
                state: data?.address?.state || '',
                postcode: data?.address?.postcode || '',
                country: getCountryCodeFromName(data?.address?.country || ''),
              })
              // Set user status based on is_active field
              setUserStatus(data?.is_active ? 'Active' : 'Inactive')
            }
          }
        )
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(true)
      }
    }

    load()
  }, [state?.id])

  //new Somayeh code
  /*
useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(false)

        const Header = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Token'),
          org: localStorage.getItem('org'),
        }

        fetchData(`${UserUrl}/${state?.id}/`, 'GET', null as any, Header).then(
          (res: any) => {
            if (!res.error) {
              setLoading(false)
              const data = res?.data?.profile_obj
              setFormData({
                email: data?.user_details?.email || '',
                role: data?.role || '',
                phone: data?.phone || '',
                alternate_phone: data?.alternate_phone || '',
                address_line: data?.address?.address_line || '',
                street: data?.address?.street || '',
                city: data?.address?.city || '',
                state: data?.address?.state || '',
                postcode: data?.address?.postcode || '',
                country: data?.address?.country || '',
              })
            }
          }
        )
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(true)
      }
    }

    load()
  }, [state?.id])
*/
  //end of Somayeh new code

  const handleChange = (e: any) => {
    const { name, value, files, type, checked } = e.target
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null })
    }
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      // If country changes, update phone number prefix
      if (name === 'country') {
        const newPrefix = getPhonePrefixForCountry(value)
        setFormData({
          ...formData,
          [name]: value,
          // Only update phone numbers if they already have a prefix
          phone: formData.phone.startsWith('+')
            ? newPrefix + ' '
            : formData.phone,
          alternate_phone: formData.alternate_phone.startsWith('+')
            ? newPrefix + ' '
            : formData.alternate_phone,
        })
      } else {
        setFormData({ ...formData, [name]: value })
      }
    }
  }

  const backbtnHandle = () => {
    if (state?.edit) {
      navigate('/app/users')
    } else {
      navigate('/app/users/user-details', {
        state: { userId: state?.id, detail: true },
      })
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (formData.phone) {
      if (formData.phone === formData.alternate_phone) {
        setProfileErrors({
          ...profileErrors,
          alternate_phone: ['Alternate phone cannot be the same as phone'],
        })
        return
      }
    }

    submitForm()
  }

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    // console.log('Form data:', data);
    const data = {
      email: formData.email,
      role: formData.role,
      phone: formData.phone.startsWith('+')
        ? formData.phone
        : getPhonePrefixForCountry(formData.country) + ' ' + formData.phone,
      alternate_phone: formData.alternate_phone.startsWith('+')
        ? formData.alternate_phone
        : getPhonePrefixForCountry(formData.country) +
          ' ' +
          formData.alternate_phone,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: getCountryNameFromCode(formData.country),
    }

    fetchData(`${UserUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
      .then((res: any) => {
        setSuccessMessage('User info updated successfully!')
        setError(false)
        // Show success message for 1 second before navigating
        setTimeout(() => {
          resetForm()
          navigate('/app/users')
        }, 1000)
      })
      .catch(async (err: any) => {
        setError(true)
        setSuccessMessage('')
        const profileErr = err?.profile_errors?.[0] || {}
        const userErr = err?.user_errors?.[0] || {}

        setProfileErrors(profileErr)
        setUserErrors(userErr)
      })
  }
  const resetForm = () => {
    setFormData({
      email: '',
      role: 'ADMIN',
      phone: '',
      alternate_phone: '',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      // profile_pic: null,
      // has_sales_access: false,
      // has_marketing_access: false,
      // is_organization_admin: false
    })
    setProfileErrors({})
    setUserErrors({})
  }
  const onCancel = () => {
    setReset(true)
    // resetForm()
  }

  const handleActivateUser = () => {
    if (isSelfDeactivation) {
      setMsg('You cannot change your own account status')
      setError(true)
      return
    }
    
    setConfirmAction('activate')
    setConfirmMessage(`Are you sure you want to activate user "${formData.email}"?`)
    setShowConfirmDialog(true)
  }

  const handleDeactivateUser = () => {
    if (isSelfDeactivation) {
      setMsg('You cannot change your own account status')
      setError(true)
      return
    }
    
    setConfirmAction('deactivate')
    setConfirmMessage(`Are you sure you want to deactivate user "${formData.email}"?`)
    setShowConfirmDialog(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    if (confirmAction === 'activate') {
      setIsActivating(true)
    } else {
      setIsDeactivating(true)
    }
    
    setError(false)
    setMsg('')
    setShowConfirmDialog(false)
    
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }

    try {
      const response = await fetchData(`${UserUrl}/${state?.id}/status/`, 'POST', JSON.stringify({ status: confirmAction === 'activate' ? 'Active' : 'Inactive' }), Header)
      
      if (!response.error) {
        setMsg(`User ${confirmAction === 'activate' ? 'activated' : 'deactivated'} successfully!`)
        setError(false)
        setUserStatus(confirmAction === 'activate' ? 'Active' : 'Inactive')
        // Optionally refresh the page or update the UI
        setTimeout(() => {
          navigate(confirmAction === 'activate' ? '/app/users?tab=inactive' : '/app/users')
        }, 1500)
      } else {
        setError(true)
        // Handle different error response formats
        const errorMessage = response.errors || response.message || response.error || `Failed to ${confirmAction} user`
        setMsg(errorMessage)
      }
    } catch (error) {
      console.error(`Error ${confirmAction}ing user:`, error)
      console.log('Error object keys:', error ? Object.keys(error) : 'No error object')
      console.log('Error type:', typeof error)
      setError(true)
      
      // Handle error response from fetchData (which throws the JSON response)
      if (error && typeof error === 'object') {
        // Check for different error message formats with proper type checking
        const errorObj = error as any
        let errorMessage = errorObj.errors || errorObj.message || errorObj.error
        
        // If it's an array of errors, join them
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ')
        }
        
        // If no specific error message, use generic one
        if (!errorMessage) {
          errorMessage = `An error occurred while ${confirmAction}ing the user`
        }
        
        console.log('Extracted error message:', errorMessage)
        setMsg(errorMessage)
      } else {
        setMsg(`An error occurred while ${confirmAction}ing the user`)
      }
    } finally {
      setIsActivating(false)
      setIsDeactivating(false)
      setConfirmAction(null)
    }
  }

  const handleCancelAction = () => {
    setShowConfirmDialog(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }
  const module = 'Users'
  const crntPage = 'Edit User'
  const backBtn = state?.edit ? 'Back To Users' : 'Back To UserDetails'

  const inputStyles = {
    display: 'none',
  }
  // console.log(state, 'edit',profileErrors)
  // console.log(formData, 'as', state?.value);
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: '120px' }}>
        {/* Success Message Alert */}
        {successMessage && (
          <Box sx={{ mb: 2, px: 2 }}>
            <Alert severity="success" onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          </Box>
        )}
        {/* Error Messages */}
        {msg && (
          <Box sx={{ mb: 2, px: 2 }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '4px',
              backgroundColor: error ? '#ffebee' : '#e8f5e8',
              color: error ? '#c62828' : '#2e7d32',
              border: `1px solid ${error ? '#ef9a9a' : '#a5d6a7'}`,
              fontSize: '14px'
            }}>
              {msg}
            </div>
          </Box>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999 
          }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              padding: '24px', 
              borderRadius: '8px', 
              maxWidth: '400px', 
              width: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1A3353', fontWeight: 'bold' }}>
                Confirm Action
              </Typography>
              <Typography sx={{ mb: 3, color: '#666', fontSize: '14px' }}>
                {confirmMessage}
              </Typography>
              <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelAction}
                  disabled={isActivating || isDeactivating}
                  sx={{ 
                    borderColor: '#ccc', 
                    color: '#666',
                    textTransform: 'none',
                    minWidth: '80px'
                  }}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmAction}
                  disabled={isActivating || isDeactivating}
                  sx={{ 
                    backgroundColor: confirmAction === 'activate' ? '#4caf50' : '#f44336',
                    '&:hover': {
                      backgroundColor: confirmAction === 'activate' ? '#45a049' : '#d32f2f'
                    },
                    textTransform: 'none',
                    minWidth: '80px'
                  }}
                >
                  {isActivating ? 'Activating...' : isDeactivating ? 'Deactivating...' : 'Yes'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    User Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Email</div>
                        <RequiredTextField
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.email?.[0] ||
                            !!userErrors?.email?.[0]
                          }
                          helperText={
                            profileErrors?.email?.[0] ||
                            userErrors?.email?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Role</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="role"
                            value={formData.role}
                            open={roleSelectOpen}
                            onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setRoleSelectOpen(!roleSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {roleSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.role?.[0]}
                          >
                            {ROLES.map((role) => (
                              <MenuItem key={role.value} value={role.value}>
                                  {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {/* <FormHelperText>{errors?.[0] ? errors[0] : ''}</FormHelperText> */}
                        </FormControl>
                      </div>
                    </div>
                    {/* User Status Management Buttons - Integrated in two-column layout */}
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">User Status</div>
                        <div style={{ fontSize: '12px', color: '#666', paddingTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              color: userStatus === 'Active' ? '#4caf50' : userStatus === 'Inactive' ? '#f44336' : '#666',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}>
                              {userStatus}
                            </span>
                            {isSelfDeactivation && (
                              <span style={{ 
                                fontSize: '10px', 
                                color: '#ff9800', 
                                backgroundColor: '#fff3e0', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                border: '1px solid #ffb74d'
                              }}>
                                Your Account
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Action</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Tooltip title={isSelfDeactivation ? "You cannot change your own account status" : "Activate user account"}>
                            <span>
                              <Button
                                variant="outlined"
                                color="success"
                                onClick={handleActivateUser}
                                disabled={isActivating || isDeactivating || isSelfDeactivation}
                                size="small"
                                style={{ 
                                  borderColor: isSelfDeactivation ? '#ccc' : '#4caf50',
                                  color: isSelfDeactivation ? '#999' : '#4caf50',
                                  textTransform: 'none',
                                  minWidth: '100px',
                                  fontSize: '12px'
                                }}
                              >
                                {isActivating ? 'Activating...' : 'Activate'}
                              </Button>
                            </span>
                          </Tooltip>
                          <Tooltip title={isSelfDeactivation ? "You cannot change your own account status" : "Deactivate user account"}>
                            <span>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeactivateUser}
                                disabled={isActivating || isDeactivating || isSelfDeactivation}
                                size="small"
                                style={{ 
                                  borderColor: isSelfDeactivation ? '#ccc' : '#f44336',
                                  color: isSelfDeactivation ? '#999' : '#f44336',
                                  textTransform: 'none',
                                  minWidth: '100px',
                                  fontSize: '12px'
                                }}
                              >
                                {isDeactivating ? 'Deactivating...' : 'Deactivate'}
                              </Button>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Number must start with country code prefix">
                          <RequiredTextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.phone?.[0] ||
                              !!userErrors?.phone?.[0]
                            }
                            helperText={
                              profileErrors?.phone?.[0] ||
                              userErrors?.phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Alternate Phone</div>
                        <Tooltip title="Number must start with country code prefix">
                          <TextField
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.alternate_phone?.[0] ||
                              !!userErrors?.alternate_phone?.[0]
                            }
                            helperText={
                              profileErrors?.alternate_phone?.[0] ||
                              userErrors?.alternate_phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Address Details */}
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Address</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Address Lane</div>
                        <TextField
                          required
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.address_line?.[0] ||
                            !!userErrors?.address_line?.[0]
                          }
                          helperText={
                            profileErrors?.address_line?.[0] ||
                            userErrors?.address_line?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          required
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.street?.[0] ||
                            !!userErrors?.street?.[0]
                          }
                          helperText={
                            profileErrors?.street?.[0] ||
                            userErrors?.street?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.city?.[0] ||
                            !!userErrors?.city?.[0]
                          }
                          helperText={
                            profileErrors?.city?.[0] ||
                            userErrors?.city?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.state?.[0] ||
                            !!userErrors?.state?.[0]
                          }
                          helperText={
                            profileErrors?.state?.[0] ||
                            userErrors?.state?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">postcode</div>
                        <TextField
                          required
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.postcode?.[0] ||
                            !!userErrors?.postcode?.[0]
                          }
                          helperText={
                            profileErrors?.postcode?.[0] ||
                            userErrors?.postcode?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="country"
                            value={formData.country}
                            open={countrySelectOpen}
                            onClick={() =>
                              setCountrySelectOpen(!countrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setCountrySelectOpen(!countrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {countrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!profileErrors?.country?.[0]}
                          >
                            {(state?.countries?.length
                              ? state.countries
                              : countries
                            ).map((option: any) => (
                              <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {profileErrors?.country?.[0]
                              ? profileErrors?.country?.[0]
                              : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Business Hours */}
            {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography
                                            style={{ marginBottom: '15px', fontWeight: 'bold' }}
                                        >
                                            Business Hours
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div>
                                            <div className='fieldSubContainer' style={{ marginLeft: '4.8%' }}>
                                                <div className='fieldTitle'>Business Hours</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
            {/* Preferences */}
            {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography
                                            style={{ marginBottom: '15px', fontWeight: 'bold' }}
                                        >
                                            Preferences
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Default Page After Login</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Persone Name Format</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Prefferred Currency</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                     {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Digit Grouping Pattern</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Digit Grouping Seperator</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                     {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Number of Currency Decimals</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                 {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))}
                                                </TextField>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
            {/* Signature Block */}
            {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography style={{ marginBottom: '15px', fontWeight: 'bold' }}>Signature Block</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '100%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='DescriptionDetail'>
                                            <div className='descriptionSubContainer'>
                                                <div className='descriptionTitle'>Signature</div>
                                                <TextareaAutosize
                                                    aria-label='minimum height'
                                                    name='description'
                                                    minRows={8}
                                                    // defaultValue={state.editData && state.editData.description ? state.editData.description : ''}
                                                    // onChange={onChange}
                                                    style={{ width: '70%', padding: '5px' }}
                                                    placeholder='Add Description'
                                                />
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
          </div>
        </form>
      </Box>
    </Box>
  )
}
