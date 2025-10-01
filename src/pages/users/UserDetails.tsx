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
          postcode: userDetails?.address?.postcode,
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
            p: '40px',
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
                    fontSize: '25px',
                    color: '#1a3353f0',
                  }}
                >
                  User Information
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
                  <div className="title2">Email Address</div>
                  <div className="title3">
                    {userDetails?.user_details?.email || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Phone Number </div>
                  <div className="title3">{userDetails?.phone || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Alternate Phone</div>
                  <div className="title3">
                    {userDetails?.alternate_phone || '---'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Role</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#1E90FF',
                      marginTop: '5%',
                    }}
                  >
                    {userDetails?.role || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Activation Status</div>
                  <div
                    className="title3"
                    style={{
                      fontSize: '16px',
                      color: '#1E90FF',
                      marginTop: '5%',
                    }}
                  >
                    {userDetails?.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Date of Joining</div>
                  <div className="title3">{userDetails?.date_of_joining}</div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  // , justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '34%' }}>
                  <div className="title2">Address</div>
                  <div className="title3">
                    {userDetails?.address?.street} ,{' '}
                    {userDetails?.address?.address_line} ,{' '}
                    {userDetails?.address?.city} , {userDetails?.address?.state}{' '}
                    , {userDetails?.address?.postcode} ,{' '}
                    {userDetails?.address?.country
                      ? userDetails?.address?.country
                      : ''}
                  </div>
                </div>
              </div>
              {/* Address details */}
            </Card>
          </Box>
        </Box>
      </div>
    </Box>
  )
}
