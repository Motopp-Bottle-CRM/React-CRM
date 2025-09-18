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

type FormErrors = {
  email?: string[]
  role?: string[]
  phone?: string[]
  alternate_phone?: string[]
  address_line?: string[]
  street?: string[]
  city?: string[]
  state?: string[]
  pincode?: string[]
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
  pincode: string
  country: string
}
export function EditUser() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Countries array with phone prefixes [code, name, phone_prefix]
  const countries = [
    ['IN', 'India', '+91'], ['US', 'United States', '+1'], ['GB', 'United Kingdom', '+44'], ['CA', 'Canada', '+1'], ['AU', 'Australia', '+61'],
    ['DE', 'Germany', '+49'], ['FR', 'France', '+33'], ['JP', 'Japan', '+81'], ['CN', 'China', '+86'], ['BR', 'Brazil', '+55'], ['MX', 'Mexico', '+52'], ['IT', 'Italy', '+39'],
    ['ES', 'Spain', '+34'], ['NL', 'Netherlands', '+31'], ['CH', 'Switzerland', '+41'], ['SE', 'Sweden', '+46'], ['NO', 'Norway', '+47'], ['DK', 'Denmark', '+45'],
    ['FI', 'Finland', '+358'], ['PL', 'Poland', '+48'], ['RU', 'Russian Federation', '+7'], ['KR', 'Korea, Republic of', '+82'], ['SG', 'Singapore', '+65'], ['TH', 'Thailand', '+66']
  ]

  // Helper function to convert country name to country code
  const getCountryCodeFromName = (countryName: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find((option: any) => option[1] === countryName)
    return country ? country[0] : countryName // Return the code if found, otherwise return the original value
  }

  // Helper function to convert country code to country name
  const getCountryNameFromCode = (countryCode: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find((option: any) => option[0] === countryCode)
    return country ? country[1] : countryCode // Return the name if found, otherwise return the original value
  }

  // Helper function to get phone prefix for a country
  const getPhonePrefixForCountry = (countryCode: string) => {
    const countriesList = state?.countries?.length ? state.countries : countries
    const country = countriesList.find((option: any) => option[0] === countryCode)
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
  const [formData, setFormData] = useState<FormData>({
    email: '',
    role: 'ADMIN',
    phone: '',
    alternate_phone: '',
    address_line: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  })
  useEffect(() => {
    setFormData(state?.value)
  }, [state?.id])

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
                pincode: data?.address?.pincode || '',
                country: getCountryCodeFromName(data?.address?.country || ''),
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
                pincode: data?.address?.pincode || '',
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
          phone: formData.phone.startsWith('+') ? newPrefix + ' ' : formData.phone,
          alternate_phone: formData.alternate_phone.startsWith('+') ? newPrefix + ' ' : formData.alternate_phone
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
      phone: formData.phone.startsWith('+') ? formData.phone : getPhonePrefixForCountry(formData.country) + ' ' + formData.phone,
      alternate_phone: formData.alternate_phone.startsWith('+') ? formData.alternate_phone : getPhonePrefixForCountry(formData.country) + ' ' + formData.alternate_phone,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: getCountryNameFromCode(formData.country),
    }

    fetchData(`${UserUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
      .then((res: any) => {
        resetForm()
        navigate('/app/users')
      })
      .catch(async (err: any) => {
        setError(true)
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
      pincode: '',
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
                            {['ADMIN', 'USER'].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {/* <FormHelperText>{errors?.[0] ? errors[0] : ''}</FormHelperText> */}
                        </FormControl>
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
                        <Tooltip title= "Number must start with country code prefix">
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
                        <div className="fieldTitle">Pincode</div>
                        <TextField
                          required
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.pincode?.[0] ||
                            !!userErrors?.pincode?.[0]
                          }
                          helperText={
                            profileErrors?.pincode?.[0] ||
                            userErrors?.pincode?.[0] ||
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
                            {(state?.countries?.length ? state.countries : countries).map((option: any) => (
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
