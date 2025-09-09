import React, { useEffect, useState } from 'react'
import {
  Card,
  Link,
  Button,
  Avatar,
  Divider,
  TextField,
  Box,
  AvatarGroup,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Fa500Px,
  FaAccusoft,
  FaAd,
  FaAddressCard,
  FaEnvelope,
  FaRegAddressCard,
  FaStar,
} from 'react-icons/fa'
import { CustomAppBar } from '../../components/CustomAppBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { AntSwitch } from '../../styles/CssStyled'
import { ContactUrl, UserUrl } from '../../services/ApiUrls'
import { fetchData, Header } from '../../components/FetchData'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'



type response = {
  user_details: {
    email: string
    is_active: boolean
    profile_pic: string
  }
  role: string
  address: {
    address_line: string
    street: string
    city: string
    state: string
    postcode: string
    country: string
  }
  is_organization_admin: boolean
  has_marketing_access: boolean
  has_sales_access: boolean
  phone: string
  alternate_phone: string
  date_of_joining: string
  is_active: boolean
}

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export default function UserDetails() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [userDetails, setUserDetails] = useState<response | null>(null)

  useEffect(() => {
    getUserDetail(state.userId)
  }, [state.userId])

  const getUserDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header).then((res) => {
      console.log(res, 'res')
      if (!res.error) {
        setUserDetails(res?.data?.profile_obj)
      }
    })
  }

  

  const backbtnHandle = () => {
    navigate('/app/users')
  }

  const editHandle = () => {
    // navigate('/contacts/edit-contacts', { state: { value: contactDetails, address: newAddress } })
    navigate('/app/users/edit-user', {
      state: {
        value: {
          email: userDetails?.user_details?.email,
          role: userDetails?.role,
          phone: userDetails?.phone,
          alternate_phone: userDetails?.alternate_phone,
          address_line: userDetails?.address?.address_line,
          street: userDetails?.address?.street,
          city: userDetails?.address?.city,
          state: userDetails?.address?.state,
          pincode: userDetails?.address?.postcode,
          country: userDetails?.address?.country,
          profile_pic: userDetails?.user_details?.profile_pic,
          has_sales_access: userDetails?.has_sales_access,
          has_marketing_access: userDetails?.has_marketing_access,
          is_organization_admin: userDetails?.is_organization_admin,
        },
        id: state?.userId,
      },
    })
  }

  const module = 'Users'
  const crntPage = 'User Detail'
  const backBtn = 'Back To Users'
  // console.log(userDetails, 'user');

  return (
    <Box sx={{ mt: '60px' }}>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
          editHandle={editHandle}
        />
        <Box sx={{mt: '120px'}}         >
          <div style={{ padding: '10px' }}>
              {/* User info  */}
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
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Email</div>
                        <TextField
                            name="email"
                            value={userDetails?.user_details?.email}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Role</div>
                          <TextField
                            name="role"
                            value={userDetails?.role}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                       
                          <TextField
                            name="phone"
                            value={userDetails?.phone} 
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Alternate Phone</div>
                       
                          <TextField
                                name="alternate_phone"
                                value={userDetails?.alternate_phone}
                                style={{ width: '70%' }}
                                size="small"
                                InputProps={{ readOnly: true }}
                           />

                      </div>
                    </div>
                  </Box>
                  </AccordionDetails>
                </Accordion>
              </div>
             
                
                {/* profile info */}

                <div className="leadContainer">
                  <Accordion defaultExpanded style={{ width: '98%' }}>
                      <AccordionSummary
                                expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                              >
                  <Typography className="accordion-header">
                    Profile  Information
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
                    <div className="fieldContainer2">
                      <div className="fieldSubContainerSwitch">
                         <div className="fieldTitle">Is Active</div>
                         <div><TextField
                              label="Status"
                              value={userDetails?.is_active ? "Enabled" : "Disabled"}
                              InputProps={{ readOnly: true }}
                              size="small"
                              sx={{
                                    input: {
                                      color: userDetails?.is_active ? "#1E90FF" : "gray",
                                      fontWeight: 600,
                                    },
                                  }}
                                /></div>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Date of joining</div>
                          <TextField
                            name="role"
                            value={userDetails?.date_of_joining}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div  className="fieldSubContainerSwitch">
                        <div className="fieldTitle">Sales access</div>
                        <div><TextField
                              label="Status"
                              value={userDetails?.has_sales_access ? "Enabled" : "Disabled"}
                              InputProps={{ readOnly: true }}
                              size="small"
                              sx={{
                                    input: {
                                      color: userDetails?.has_sales_access ? "#1E90FF" : "gray",
                                      fontWeight: 600,
                                    },
                                  }}
                                /></div>
                         
                      </div>
                      <div className="fieldSubContainerSwitch">
                        <div className="fieldTitle">Marketing access</div>
                        <div><TextField
                              label="Status"
                              value={userDetails?.has_marketing_access ? "Enabled" : "Disabled"}
                              InputProps={{ readOnly: true }}
                              size="small"
                              sx={{
                                    input: {
                                      color: userDetails?.has_marketing_access ? "#1E90FF" : "gray",
                                      fontWeight: 600,
                                    },
                                  }}
                                /></div>
                    </div>
                    </div>
                  </Box>
                  </AccordionDetails>
                </Accordion>
              </div>
               
               
                {/* address*/}
         
                <div className="leadContainer">
                  <Accordion defaultExpanded style={{ width: '98%' }}>
                      <AccordionSummary
                                expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                              >
                  <Typography className="accordion-header">
                    Adress
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
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                      <div className="fieldTitle">Address Lane</div>
                         <TextField
                            name="address_line"
                            value={userDetails?.address?.address_line}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                          <TextField
                            name="street"
                            value={userDetails?.address?.street}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                     
                    </div>
                    
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
            
                        <div className="fieldTitle">City</div>
                         <TextField
                            name="city"
                            value={userDetails?.address?.city}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                          <TextField
                            name="state"
                            value={userDetails?.address?.state}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                     
                    </div>

                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Postcode</div>
                          <TextField
                            name="postcode"
                            value={userDetails?.address?.postcode}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                          <TextField
                            name="country"
                            value={userDetails?.address?.country}
                            style={{ width: '70%' }}
                            size="small"
                            InputProps={{ readOnly: true }}
                          />
                      </div>
                    </div>
                  </Box>
                  </AccordionDetails>
                </Accordion>
              </div>

          </div>
          </Box>
    </Box>
  )
}
