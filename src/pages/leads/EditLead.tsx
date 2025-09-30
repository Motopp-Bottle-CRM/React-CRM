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
import {
  CustomPopupIcon,
  CustomSelectField,
  RequiredTextField,
  StyledSelect,
} from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import '../../styles/style.css'

// const useStyles = makeStyles({
//   btnIcon: {
//     height: '14px',
//     color: '#5B5C63'
//   },
//   breadcrumbs: {
//     color: 'white'
//   },
//   fields: {
//     height: '5px'
//   },
//   chipStyle: {
//     backgroundColor: 'red'
//   },
//   icon: {
//     '&.MuiChip-deleteIcon': {
//       color: 'darkgray'
//     }
//   }
// })

// const textFieldStyled = makeStyles(() => ({
//   root: {
//     borderLeft: '2px solid red',
//     height: '35px'
//   },
//   fieldHeight: {
//     height: '35px'
//   }
// }))

// function getStyles (name, personName, theme) {
//   return {
//     fontWeight:
//       theme.typography.fontWeightRegular
//   }
// }

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
  tags?: string[]
  company_name?: string[]
  probability?: number[]
  industry?: string[]
  linkedin_id?: string[]
  file?: string[]
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
  lead_attachment: string | null
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
  tags: string[]
  company_name: string
  probability: number
  industry: string
  linkedin_id: string
  file: string | null
}

export function EditLead() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const { quill, quillRef } = useQuill()
  // const initialContentRef = useRef(null);
  const initialContentRef = useRef<string | null>(null)
  const pageContainerRef = useRef<HTMLDivElement | null>(null)

  const [hasInitialFocus, setHasInitialFocus] = useState(false)

  const autocompleteRef = useRef<any>(null)
  const [reset, setReset] = useState(false)
  const [error, setError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<any[]>([])
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false)
  const [statusSelectOpen, setStatusSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    title: '',
    job_title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    lead_attachment: null,
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
    tags: [],
    company_name: '',
    probability: 1,
    industry: 'ADVERTISING',
    linkedin_id: '',
    file: null,
  })

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0)
    // Set focus to the page container after the Quill editor loads its content
    if (quill && !hasInitialFocus) {
      quill.on('editor-change', () => {
        if (pageContainerRef.current) {
          pageContainerRef.current.focus()
          setHasInitialFocus(true) // Set the flag to true after the initial focus
        }
      })
    }
    // Cleanup: Remove event listener when the component unmounts
    return () => {
      if (quill) {
        quill.off('editor-change')
      }
    }
  }, [quill, hasInitialFocus])

  useEffect(() => {
    console.log('Setting form data from state:', state?.value);
    console.log('Phone value:', state?.value?.phone);

    // Sanitize all string fields to remove JSX code
    const sanitizedData = { ...state?.value };

    // Function to sanitize string fields
    const sanitizeString = (str: string) => {
      if (typeof str === 'string') {
        return str.replace(/<[^>]*>/g, '').replace(/FaStar.*?\/>|<br\s*\/?>/gi, '').trim();
      }
      return str;
    };

    // Sanitize all string fields
    Object.keys(sanitizedData).forEach(key => {
      if (typeof sanitizedData[key] === 'string') {
        sanitizedData[key] = sanitizeString(sanitizedData[key]);
      }
    });

    console.log('Sanitized data:', sanitizedData);
    setFormData({
      ...sanitizedData,
      job_title: sanitizedData.job_title || ''
    })
  }, [state?.id])

  useEffect(() => {
    if (reset) {
      // Sanitize all string fields to remove JSX code
      const sanitizedData = { ...state?.value };

      // Function to sanitize string fields
      const sanitizeString = (str: string) => {
        if (typeof str === 'string') {
          return str.replace(/<[^>]*>/g, '').replace(/FaStar.*?\/>|<br\s*\/?>/gi, '').trim();
        }
        return str;
      };

      // Sanitize all string fields
      Object.keys(sanitizedData).forEach(key => {
        if (typeof sanitizedData[key] === 'string') {
          sanitizedData[key] = sanitizeString(sanitizedData[key]);
        }
      });

      setFormData({
        ...sanitizedData,
        job_title: sanitizedData.job_title || ''
      })
      if (quill && initialContentRef.current !== null) {
        quill.clipboard.dangerouslyPasteHTML(initialContentRef.current)
      }
    }
    return () => {
      setReset(false)
    }
  }, [reset, quill, state?.value])

  useEffect(() => {
    if (quill && initialContentRef.current === null) {
      // Save the initial state (HTML content) of the Quill editor only if not already saved
      initialContentRef.current = formData.description
      quill.clipboard.dangerouslyPasteHTML(formData.description)
    }
  }, [quill, formData.description])


  // useEffect(() => {
  //     if (quill && initialContentRef.current === null) {
  //       // Save the initial state (HTML content) of the Quill editor only if not already saved
  //       initialContentRef.current = quillRef.current.firstChild.innerHTML;
  //     }
  //   }, [quill]);
  // useEffect(() => {
  //     if (quill) {
  //         // Save the initial state (HTML content) of the Quill editor
  //         initialContentRef.current = quillRef.current.firstChild.innerHTML;
  //     }
  // }, [quill]);

  // useEffect(() => {
  //     if (quill) {
  //       quill.clipboard.dangerouslyPasteHTML(formData.description);
  //     }
  //   }, [quill]);

  // const changeHandler = (event: any) => {
  //   if (event.target.files[0]) {
  //     // setLogo(event.target.files[0])
  //     const reader = new FileReader()
  //     reader.addEventListener('load', () => {
  //       // setImgData(reader.result)
  //       // setLogot(true)
  //     })
  //     val.lead_attachment = event.target.files[0]
  //   }
  // }

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
    } else if (title === 'tags') {
      setFormData({
        ...formData,
        assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [],
      })
      setSelectedTags(val)
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
    const { name, value, files, type, checked, id } = e.target
    // console.log('auto', val)
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null })
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const resetQuillToInitialState = () => {
    // Reset the Quill editor to its initial state
    setFormData({ ...formData, description: '' })
    // if (quill && initialContentRef.current !== null) {
    //     quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
    // }
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML('')
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitForm()
  }
  const submitForm = () => {
    // Basic validation
    if (!formData.title || formData.title.trim() === '') {
      setError(true);
      setErrors({ general: ['Lead Name is required'] });
      return;
    }

    if (!formData.company_name || formData.company_name.trim() === '') {
      setError(true);
      setErrors({ general: ['Company name is required'] });
      return;
    }

    if (!formData.first_name && !formData.last_name) {
      setError(true);
      setErrors({ general: ['Please provide at least first name or last name'] });
      return;
    }


    const data: any = {
      title: formData.title,
      job_title: formData.job_title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      account_name: formData.account_name,
      phone: formData.phone,
      email: formData.email,
      lead_attachment: formData.file ? [formData.file] : [],
      opportunity_amount: formData.opportunity_amount ? parseFloat(formData.opportunity_amount.toString()) : null,
      website: formData.website,
      description: formData.description,
      teams: formData.teams || [],
      assigned_to: formData.assigned_to || [],
      status: formData.status,
      source: formData.source,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      company: formData.company_name,
      tags: formData.tags || [],
      probability: formData.probability ? Math.round(Math.min(formData.probability, 100)) : 0,
      industry: formData.industry,
      linkedin_id: formData.linkedin_id || '',
    }

    // Only include contacts if there are any
    if (formData.contacts && formData.contacts.length > 0) {
      data.contacts = formData.contacts;
    }

    // Only include country if it has a value
    if (formData.country && typeof formData.country === 'string' && formData.country.trim() !== '') {
      data.country = formData.country;
    }

    console.log('EditLead - Submitting data:', data);
    console.log('EditLead - Industry value:', formData.industry);
    console.log('EditLead - Company name:', formData.company_name);
    fetchData(`${LeadUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
      .then((res: any) => {
        console.log('EditLead - API Response:', res);
        if (!res.error) {
          setSuccessMessage('Lead updated successfully!')
          setError(false)
          // Show success message for 1 second before navigating
          setTimeout(() => {
            backbtnHandle()
          }, 1000)
        }
        if (res.error) {
          console.log('EditLead - API Error:', res.errors);
          setError(true)
          setSuccessMessage('')
          setErrors(res?.errors)
        }
      })
      .catch((error) => {
        console.log('EditLead - Fetch Error:', error);
        console.log('EditLead - Error details:', JSON.stringify(error, null, 2));
        setError(true)
        setSuccessMessage('')
        setErrors(error?.errors || { general: ['An error occurred while saving the lead.'] })
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
      lead_attachment: null,
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
      tags: [],
      company_name: '',
      probability: 1,
      industry: 'ADVERTISING',
      linkedin_id: '',
      file: null,
    })
    setErrors({})
    setSelectedContacts([])
    setSelectedAssignTo([])
    setSelectedTags([])
    // setSelectedCountry([])
    // if (autocompleteRef.current) {
    //   console.log(autocompleteRef.current,'ccc')
    //   autocompleteRef.current.defaultValue([]);
    // }
  }
  const onCancel = () => {
    // resetForm()
    setReset(true)
    if (quill && initialContentRef.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(initialContentRef.current)
    }
  }
  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        lead_attachment: file.name,
        file: prevData.file,
      }))

      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          file: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0] || null;
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //             // setFormData({ ...formData, lead_attachment: reader.result as string });
  //             setFormData({ ...formData, file: reader.result as string });
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // };
  const backbtnHandle = () => {
    navigate('/app/leads/lead-details', {
      state: { leadId: state?.id, detail: true },
    })
    // navigate('/app/leads')
  }

  const module = 'Leads'
  const crntPage = 'Edit Lead'
  const backBtn = 'Back To Lead Details'

  // console.log(formData, 'leadsform')
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
        <form onSubmit={handleSubmit}>
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
                      <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px' }}>
                        {errors.general[0]}
                      </div>
                    )}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Name</div>
                        <RequiredTextField
                          ref={pageContainerRef}
                          tabIndex={-1}
                          autoFocus
                          name="title"
                          value={formData.title || ''}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          required
                          helperText={
                            errors?.title?.[0]
                              ? errors?.title[0]
                              : ''
                          }
                          error={!!errors?.title?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Opportunity Amount</div>
                        <TextField
                          type={'number'}
                          name="opportunity_amount"
                          value={formData.opportunity_amount || ''}
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
                            // ref={autocompleteRef}
                            multiple
                            value={selectedAssignTo}
                            // name='contacts'
                            limitTags={2}
                            options={state?.users || []}
                            // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                            getOptionLabel={(option: any) =>
                              state?.users
                                ? option?.user_details?.email
                                : option
                            }
                            // getOptionLabel={(option: any) => option?.user__email}
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
                                    state?.users
                                      ? option?.user_details?.email
                                      : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
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
                            onClick={() =>
                              setIndustrySelectOpen(!industrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setIndustrySelectOpen(!industrySelectOpen)
                                }
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
                              ? state?.industries.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : [
                                  ['ADVERTISING', 'ADVERTISING'],
                                  ['AGRICULTURE', 'AGRICULTURE'],
                                  ['APPAREL & ACCESSORIES', 'APPAREL & ACCESSORIES'],
                                  ['AUTOMOTIVE', 'AUTOMOTIVE'],
                                  ['BANKING', 'BANKING'],
                                  ['BIOTECHNOLOGY', 'BIOTECHNOLOGY'],
                                  ['BUILDING MATERIALS & EQUIPMENT', 'BUILDING MATERIALS & EQUIPMENT'],
                                  ['CHEMICAL', 'CHEMICAL'],
                                  ['COMPUTER', 'COMPUTER'],
                                  ['EDUCATION', 'EDUCATION'],
                                  ['ELECTRONICS', 'ELECTRONICS'],
                                  ['ENERGY', 'ENERGY'],
                                  ['ENTERTAINMENT & LEISURE', 'ENTERTAINMENT & LEISURE'],
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
                                  ['VENTURE CAPITAL', 'VENTURE CAPITAL']
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
                        <div className="fieldTitle">Company Name</div>
                        <RequiredTextField
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          required
                          error={!!errors?.company_name?.[0]}
                          helperText={
                            errors?.company_name?.[0] ? errors?.company_name[0] : ''
                          }
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
                            {state?.status?.length &&
                              state?.status.map((option: any) => (
                                <MenuItem key={option[0]} value={option[0]}>
                                  {option[1]}
                                </MenuItem>
                              ))}
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
                        <div className="fieldTitle">Lead Attachment</div>
                        <TextField
                          name="lead_attachment"
                          value={formData.lead_attachment}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'whitesmoke',
                                    borderRadius: '0px',
                                    mr: '-13px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <label htmlFor="icon-button-file">
                                    <input
                                      hidden
                                      accept="image/*"
                                      id="icon-button-file"
                                      type="file"
                                      name="lead_attachment"
                                      onChange={(e: any) => {
                                        //  handleChange(e);
                                        handleFileChange(e)
                                      }}
                                    />
                                    <FaUpload
                                      color="primary"
                                      style={{
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  </label>
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: '70%' }}
                          size="small"
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Tags</div>
                        <FormControl
                          error={!!errors?.tags?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            value={selectedTags}
                            multiple
                            limitTags={5}
                            options={state?.tags || []}
                            getOptionLabel={(option: any) => option}
                            onChange={(e: any, value: any) =>
                              handleChange2('tags', value)
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
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Tags"
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
                            {errors?.tags?.[0] || ''}
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
                          value={formData.job_title || ''}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.job_title?.[0]
                              ? errors?.job_title[0]
                              : ''
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
                            inputProps={{
                              style: {
                                fontSize: '14px',
                                color: '#333'
                              }
                            }}
                            onFocus={() => {
                              console.log('Phone field focused, value:', formData.phone);
                              console.log('Phone field type:', typeof formData.phone);
                            }}
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
                        helperText={errors?.email?.[0] ? errors?.email[0] : ''}
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
                            errors?.linkedin_id?.[0] ? errors?.linkedin_id[0] : ''
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
                            {state?.countries?.length &&
                              state?.countries.map((option: any) => (
                                <MenuItem key={option[0]} value={option[0]}>
                                  {option[1]}
                                </MenuItem>
                              ))}
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
                                                                        '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                                                        '& .MuiAutocomplete-endAdornment': {
                                                                            mt: '-8px',
                                                                            mr: '-8px',
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
        </form>
      </Box>
    </Box>
  )
}
