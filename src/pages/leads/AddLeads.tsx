import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  TextField,
  FormControl,
  TextareaAutosize,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Chip,
  Autocomplete,
  FormHelperText,
  IconButton,
  Tooltip,
  Divider,
  Select,
  Button,
  Alert,
} from '@mui/material'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import '../../styles/style.css'
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData, Header } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import {
  FaArrowDown,
  FaFileUpload,
  FaPalette,
  FaPercent,
  FaPlus,
  FaTimes,
  FaUpload,
} from 'react-icons/fa'
import { useForm } from '../../components/UseForm'
import {
  CustomPopupIcon,
  CustomSelectField,
  RequiredTextField,
  RequiredSelect,
  StyledSelect,
} from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'

type FormErrors = {
  title?: string[]
  job_title?: string[]
  first_name?: string[]
  last_name?: string[]
  account_name?: string[]
  phone?: string[]
  email?: string[]
  opportunity_amount?: string[]
  website?: string[]
  description?: string[]
  teams?: string[]
  assigned_to?: string[]
  contacts?: string[]
  status?: string[]
  source?: string[]
  address_line?: string[]
  street?: string[]
  city?: string[]
  state?: string[]
  postcode?: string[]
  country?: string[]
  company_name?: string[]
  probability?: number[]
  industry?: string[]
  linkedin_id?: string[]
  general?: string[]
}
interface FormData {
  title: string
  job_title: string
  first_name: string
  last_name: string
  account_name: string
  phone: string
  email: string
  opportunity_amount: string
  website: string
  description: string
  teams: string
  assigned_to: string[]
  contacts: string[]
  status: string
  source: string
  address_line: string
  street: string
  city: string
  state: string
  postcode: string
  country: string
  company: string
  probability: number
  industry: string
  linkedin_id: string
}

export function AddLeads() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { quill, quillRef } = useQuill()
  const initialContentRef = useRef(null)

  // Debug: Log the industries data
  console.log('AddLeads - Industries data:', state?.industries)
  console.log('AddLeads - Industries length:', state?.industries?.length)

  const autocompleteRef = useRef<any>(null)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<any[]>([])
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false)
  const [statusSelectOpen, setStatusSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    title: '',
    job_title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    opportunity_amount: '',
    website: '',
    description: '',
    teams: '',
    assigned_to: [],
    contacts: [],
    status: 'assigned',
    source: 'call',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    company: '',
    probability: 1,
    industry: 'ADVERTISING',
    linkedin_id: '',
  })
  const [inputValue, setInputValue] = useState('')

  // const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (quill) {
      // Save the initial state (HTML content) of the Quill editor
      initialContentRef.current = quillRef.current.firstChild.innerHTML
    }
  }, [quill])

  useEffect(() => {
    fetchData('leads/companies', 'GET', null, Header)
      .then((res: any) => {
        if (!res.error) {
          setCompanies(res.data || [])
        }
      })
      .catch((error) => {
        console.log('Error fetching companies:', error)
      })
  }, [])


  const handleChange2 = (title: any, val: any) => {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log('nd', val)
    if (title === 'contacts') {
      setFormData({
        ...formData,
        contacts: val.length > 0 ? val.map((item: any) => item.id) : [],
      })
      setSelectedContacts(val)
    } else if (title === 'assigned_to') {
      setFormData({
        ...formData,
        assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [],
      })
      setSelectedAssignTo(val)
    }
    // else if (title === 'country') {
    //   setFormData({ ...formData, country: val || [] })
    //   setSelectedCountry(val);
    // }
    else {
      setFormData({ ...formData, [title]: val })
    }
  }

  const handleChange = (e: any) => {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log('e.target',e)
    const { name, value, type, checked, id } = e.target
    // console.log('auto', val)
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }


  const resetQuillToInitialState = () => {
    // Reset the Quill editor to its initial state
    setFormData({ ...formData, description: '' })
    if (quill && initialContentRef.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(initialContentRef.current)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitForm()
  }
  const submitForm = () => {
    // Get the current content from Quill editor
    const quillContent = quill ? quill.root.innerHTML : formData.description

    // Basic validation
    if (!formData.title || formData.title.trim() === '') {
      setError(true)
      setErrors({ general: ['Lead Name is required'] })
      return
    }

    if (!formData.company || formData.company.trim() === '') {
      setError(true)
      setErrors({ general: ['Company is required'] })
      return
    }

    if (!formData.first_name && !formData.last_name) {
      setError(true)
      setErrors({
        general: ['Please provide at least first name or last name'],
      })
      return
    }

    // Check if user has organization set
    if (!localStorage.getItem('org')) {
      setError(true)
      setErrors({ general: ['Organization not set. Please login again.'] })
      return
    }

    // console.log('Form data:', formData.lead_attachment,'sfs', formData.file);
    const data: any = {
      title: formData.title || `New Lead ${Date.now()}`,
      job_title: formData.job_title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      account_name:
        formData.account_name ||
        `${formData.first_name} ${formData.last_name}`.trim() +
          ` ${Date.now()}` ||
        `Unknown Account ${Date.now()}`,
      phone: formData.phone
        ? formData.phone.startsWith('+')
          ? formData.phone
          : `+31${formData.phone.replace(/\D/g, '')}`
        : null,
      email: formData.email,
      opportunity_amount: formData.opportunity_amount
        ? parseFloat(formData.opportunity_amount)
        : null,
      website: formData.website,
      description: quillContent,
      status: formData.status,
      source: formData.source,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      company: formData.company,
      organization: formData.company
        ? companies.find((c) => c.id === formData.company)?.name ||
          'Unknown Organization'
        : 'Unknown Organization',
      probability: Math.round(Math.min(formData.probability, 100)),
      industry: formData.industry,
      linkedin_id: formData.linkedin_id,
      ...(formData.country && typeof formData.country === 'string' && formData.country.trim() !== '' && { country: formData.country })
    }

    fetchData(`${LeadUrl}/`, 'POST', JSON.stringify(data), Header)
      .then((res: any) => {
        console.log('Form data response:', res)
        if (!res.error) {
          setSuccessMessage('Lead created successfully!')
          setError(false)
          // Show success message for 1 second before navigating
          setTimeout(() => {
            resetForm()
            navigate('/app/leads')
          }, 1000)
        }
        if (res.error) {
          setError(true)
          setSuccessMessage('')
          setErrors(res?.errors)
        }
      })
      .catch((error) => {
        console.error('Lead creation error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        setError(true)
        setSuccessMessage('')

        // Handle different types of errors
        if (error.message && error.message.includes('Session expired')) {
          setErrors({
            general: ['Your session has expired. Please login again.'],
          })
        } else if (error.message && error.message.includes('Access denied')) {
          setErrors({
            general: ['Access denied. Please check your permissions.'],
          })
        } else if (error.errors) {
          setErrors(error.errors)
        } else {
          setErrors({ general: ['Failed to create lead. Please try again.'] })
        }
      })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      job_title: '',
      first_name: '',
      last_name: '',
      account_name: '',
      phone: '',
      email: '',
      opportunity_amount: '',
      website: '',
      description: '',
      teams: '',
      assigned_to: [],
      contacts: [],
      status: 'assigned',
      source: 'call',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      company: '',
      probability: 1,
      industry: 'ADVERTISING',
      linkedin_id: '',
    })
    setErrors({})
    setSuccessMessage('')
    setSelectedContacts([])
    setSelectedAssignTo([])
    // setSelectedCountry([])
    // if (autocompleteRef.current) {
    //   console.log(autocompleteRef.current,'ccc')
    //   autocompleteRef.current.defaultValue([]);
    // }
  }
  const onCancel = () => {
    resetForm()
    setError(false)
  }

  const backbtnHandle = () => {
    navigate('/app/leads')
  }

  const module = 'Leads'
  const crntPage = 'Add Leads'
  const backBtn = 'Back To Leads'

  // console.log(state, 'leadsform')
  return (
    <form onSubmit={handleSubmit}>
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
          <div style={{ padding: '10px' }}>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Lead Information
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
                    {error && errors?.general && (
                      <div
                        style={{
                          color: 'red',
                          marginBottom: '10px',
                          padding: '10px',
                          backgroundColor: '#ffebee',
                          border: '1px solid #f44336',
                          borderRadius: '4px',
                        }}
                      >
                        {errors.general[0]}
                      </div>
                    )}
                    {success && (
                      <div
                        style={{
                          color: '#2e7d32',
                          marginBottom: '15px',
                          padding: '15px',
                          backgroundColor: '#e8f5e8',
                          border: '2px solid #4caf50',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        ✅ Lead created successfully! Redirecting to leads
                        list...
                      </div>
                    )}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Name</div>
                        <RequiredTextField
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          required
                          helperText={
                            errors?.title?.[0] ? errors?.title[0] : ''
                          }
                          error={!!errors?.title?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Opportunity Amount</div>
                        <TextField
                          type={'number'}
                          name="opportunity_amount"
                          value={formData.opportunity_amount}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.opportunity_amount?.[0]
                              ? errors?.opportunity_amount[0]
                              : ''
                          }
                          error={!!errors?.opportunity_amount?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Assign To</div>
                        <FormControl
                          error={!!errors?.assigned_to?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            multiple
                            value={selectedAssignTo}
                            limitTags={2}
                            options={state?.users || []}
                            getOptionLabel={(option: any) =>
                              state?.users ? option?.user__email : option
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('assigned_to', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px',
                                  }}
                                  variant="outlined"
                                  label={
                                    state?.users ? option?.user__email : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon sx={{ mt: 2 }}>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Users"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' },
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.assigned_to?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Industry</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="industry"
                            value={formData.industry}
                            open={industrySelectOpen}
                            onClick={() => {
                              console.log(
                                'Industry dropdown clicked, current state:',
                                industrySelectOpen
                              )
                              setIndustrySelectOpen(!industrySelectOpen)
                            }}
                            IconComponent={() => (
                              <div
                                onClick={() => {
                                  console.log(
                                    'Industry icon clicked, current state:',
                                    industrySelectOpen
                                  )
                                  setIndustrySelectOpen(!industrySelectOpen)
                                }}
                                className="select-icon-background"
                              >
                                {industrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.industry?.[0]}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px',
                                },
                              },
                            }}
                          >
                            {state?.industries?.length
                              ? state?.industries.map((option: any) => {
                                  console.log('Industry option:', option)
                                  return (
                                    <MenuItem key={option[0]} value={option[0]}>
                                      {option[1]}
                                    </MenuItem>
                                  )
                                })
                              : [
                                  ['ADVERTISING', 'ADVERTISING'],
                                  ['AGRICULTURE', 'AGRICULTURE'],
                                  [
                                    'APPAREL & ACCESSORIES',
                                    'APPAREL & ACCESSORIES',
                                  ],
                                  ['AUTOMOTIVE', 'AUTOMOTIVE'],
                                  ['BANKING', 'BANKING'],
                                  ['BIOTECHNOLOGY', 'BIOTECHNOLOGY'],
                                  [
                                    'BUILDING MATERIALS & EQUIPMENT',
                                    'BUILDING MATERIALS & EQUIPMENT',
                                  ],
                                  ['CHEMICAL', 'CHEMICAL'],
                                  ['COMPUTER', 'COMPUTER'],
                                  ['EDUCATION', 'EDUCATION'],
                                  ['ELECTRONICS', 'ELECTRONICS'],
                                  ['ENERGY', 'ENERGY'],
                                  [
                                    'ENTERTAINMENT & LEISURE',
                                    'ENTERTAINMENT & LEISURE',
                                  ],
                                  ['FINANCE', 'FINANCE'],
                                  ['FOOD & BEVERAGE', 'FOOD & BEVERAGE'],
                                  ['GROCERY', 'GROCERY'],
                                  ['HEALTHCARE', 'HEALTHCARE'],
                                  ['INSURANCE', 'INSURANCE'],
                                  ['LEGAL', 'LEGAL'],
                                  ['MANUFACTURING', 'MANUFACTURING'],
                                  ['PUBLISHING', 'PUBLISHING'],
                                  ['REAL ESTATE', 'REAL ESTATE'],
                                  ['SERVICE', 'SERVICE'],
                                  ['SOFTWARE', 'SOFTWARE'],
                                  ['SPORTS', 'SPORTS'],
                                  ['TECHNOLOGY', 'TECHNOLOGY'],
                                  ['TELECOMMUNICATIONS', 'TELECOMMUNICATIONS'],
                                  ['TELEVISION', 'TELEVISION'],
                                  ['TRANSPORTATION', 'TRANSPORTATION'],
                                  ['VENTURE CAPITAL', 'VENTURE CAPITAL'],
                                ].map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))}
                          </Select>
                          <FormHelperText>
                            {errors?.industry?.[0] ? errors?.industry[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Company</div>
                        <Autocomplete
                          sx={{
                            width: '70%',
                            '& .MuiInputBase-root': {
                              padding: '4px 8px',
                            },
                            '& .MuiAutocomplete-inputRoot': {
                              paddingLeft: 1,
                            },
                          }}
                          freeSolo
                          options={companies}
                          getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.name
                          }
                          value={formData.company}
                          onChange={(event: any, newValue: any) => {
                            if (newValue === null) {
                              setFormData({
                                ...formData,
                                company: '',
                              })
                              return
                            }
                            setFormData({
                              ...formData,
                              company: newValue.name,
                            })
                          }}
                          inputValue={formData.company}
                          onInputChange={(e, newInputValue) => {
                            setFormData({
                              ...formData,
                              company: newInputValue,
                            })
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="search or add new company"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>{params.InputProps.endAdornment}</>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Status</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="status"
                            value={formData.status}
                            open={statusSelectOpen}
                            onClick={() =>
                              setStatusSelectOpen(!statusSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setStatusSelectOpen(!statusSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {statusSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.status?.[0]}
                          >
                            {state?.status?.length
                              ? state?.status.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.status?.[0] ? errors?.status[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Source</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="source"
                            value={formData.source}
                            open={sourceSelectOpen}
                            onClick={() =>
                              setSourceSelectOpen(!sourceSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setSourceSelectOpen(!sourceSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {sourceSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.source?.[0]}
                          >
                            {[
                              { value: '', label: 'Select source' },
                              { value: 'referrals', label: 'Referrals & Recommendations' },
                              { value: 'marketing', label: 'Digital Content & SEO' },
                              { value: 'advertisement', label: 'Paid Ads (Google, LinkedIn, Meta)' },
                              { value: 'networking', label: 'Networking & Professional Platforms' },
                              { value: 'events', label: 'Events & Trade Shows' },
                              { value: 'campaign', label: 'Email/Call Campaigns' },
                              { value: 'other', label: 'Other' }
                            ].map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {errors?.source?.[0] ? errors?.source[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Probability</div>
                        <TextField
                          name="probability"
                          value={formData.probability}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    backgroundColor: '#d3d3d34a',
                                    width: '45px',
                                    borderRadius: '0px',
                                    mr: '-12px',
                                  }}
                                >
                                  <FaPercent style={{ width: '12px' }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.probability?.[0]
                              ? errors?.probability[0]
                              : ''
                          }
                          error={!!errors?.probability?.[0]}
                        />
                      </div>
                    </div>
                    {/* <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'> Close Date</div>
                        <TextField
                          name='account_name'
                          type='date'
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.account_name?.[0] ? errors?.account_name[0] : ''}
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                    </div> */}
                    {/* <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Pipeline</div>
                        <TextField
                          error={!!(msg === 'pipeline' || msg === 'required')}
                          name='pipeline'
                          id='outlined-error-helper-text'
                          // InputProps={{
                          //   classes: {
                          //     root: textFieldClasses.fieldHeight
                          //   }
                          // }}
                          onChange={onChange} style={{ width: '80%' }}
                          size='small'
                          helperText={
                            (error && msg === 'pipeline') || msg === 'required'
                              ? error
                              : ''
                          }
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lost Reason </div>
                        <TextareaAutosize
                          aria-label='minimum height'
                          name='lost_reason'
                          minRows={2}
                          // onChange={onChange}
                          style={{ width: '80%' }}
                        />
                      </div>
                    </div> */}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* contact details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Contact</Typography>
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
                        <div className="fieldTitle">First Name</div>
                        <RequiredTextField
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.first_name?.[0] ? errors?.first_name[0] : ''
                          }
                          error={!!errors?.first_name?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Last Name</div>
                        <RequiredTextField
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.last_name?.[0] ? errors?.last_name[0] : ''
                          }
                          error={!!errors?.last_name?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Job Title</div>
                        <TextField
                          name="job_title"
                          value={formData.job_title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.job_title?.[0] ? errors?.job_title[0] : ''
                          }
                          error={!!errors?.job_title?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Number must starts with +91">
                          <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            helperText={
                              errors?.phone?.[0] ? errors?.phone[0] : ''
                            }
                            error={!!errors?.phone?.[0]}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Email Address</div>
                        <TextField
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.email?.[0] ? errors?.email[0] : ''
                          }
                          error={!!errors?.email?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">LinkedIn ID</div>
                        <TextField
                          name="linkedin_id"
                          value={formData.linkedin_id}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.linkedin_id?.[0]
                              ? errors?.linkedin_id[0]
                              : ''
                          }
                          error={!!errors?.linkedin_id?.[0]}
                        />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* address details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
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
                        <div
                          className="fieldTitle"
                          // style={{ marginRight: '10px', fontSize: '13px', width: '22%', textAlign: 'right', fontWeight: 'bold' }}
                        >
                          Address Lane
                        </div>
                        <TextField
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.address_line?.[0]
                              ? errors?.address_line[0]
                              : ''
                          }
                          error={!!errors?.address_line?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                          error={!!errors?.city?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.street?.[0] ? errors?.street[0] : ''
                          }
                          error={!!errors?.street?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.state?.[0] ? errors?.state[0] : ''
                          }
                          error={!!errors?.state?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Pincode</div>
                        <TextField
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.postcode?.[0] ? errors?.postcode[0] : ''
                          }
                          error={!!errors?.postcode?.[0]}
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
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px',
                                },
                              },
                            }}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.country?.[0]}
                          >
                            {state?.countries?.length
                              ? state?.countries.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.country?.[0] ? errors?.country[0] : ''}
                          </FormHelperText>
                        </FormControl>
                        {/* <FormControl error={!!errors?.country?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            // ref={autocompleteRef}
                            // freeSolo
                            value={selectedCountry}
                            options={state.countries || []}
                            getOptionLabel={(option: any) => option[1]}
                            onChange={(e: any, value: any) => handleChange2('country', value)}
                            size='small'
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'

                                  }}
                                  variant='outlined'
                                  label={option[1]}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<IconButton
                              disableFocusRipple
                              disableRipple
                              sx={{
                                width: '45px', height: '40px',
                                borderRadius: '0px',
                                backgroundColor: '#d3d3d34a'
                              }}><FaArrowDown style={{ width: '15px' }} /></IconButton>}
                            renderInput={(params) => (
                              <TextField {...params}
                                // placeholder='Add co'
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-9px',
                                      mr: '-8px'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>{errors?.country?.[0] || ''}</FormHelperText>
                        </FormControl> */}
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Description details  */}
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Description
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '100%', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="DescriptionDetail">
                      <div className="descriptionTitle">Description</div>
                      <div style={{ width: '100%', marginBottom: '3%' }}>
                        <div ref={quillRef} />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </Box>
      </Box>
    </form>
  )
}
