import React, { useState, useEffect } from 'react'
import { fetchData } from './FetchData'
import { Header } from './FetchData'
import { ProfileUrl } from '../services/ApiUrls'

import { Box, Typography, Avatar, Button } from '@mui/material'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa'
export function ViewProfile(props: any) {
  // interface UserProfile {
  //   email?: string
  //   phone?: string
  //   address?: string
  //   role?: string
  //   date_of_joining?: string
  //   is_active?: boolean
  // }
  // const [profileData, setProfileData] = useState<UserProfile>({
  //   email: '',
  //   phone: '',
  //   address: '',
  //   role: '',
  //   date_of_joining: '',
  //   is_active: true,
  // })

  const handleEditClick = () => {
    // Logic to switch to edit mode
    props.setEditMode(true)
  }
  // useEffect(() => {
  //   // Fetch user data here
  //   const Header = {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     Authorization: localStorage.getItem('Token'),
  //     org: localStorage.getItem('org'),
  //   }
  //   fetchData(`${ProfileUrl}/`, 'GET', null as any, Header)
  //     .then((res: any) => {
  //       if (!res.error) {
  //         const data = res?.user_obj
  //         setProfileData({
  //           email: data?.user_details?.email,
  //           phone: data?.phone,
  //           address: data?.address,
  //           role: data?.role,
  //           date_of_joining: data?.date_of_joining,
  //           is_active: data?.is_active,
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching profile data:', error)
  //     })
  // }, [])

  return (
    <Box
      sx={{
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        border: '1px  #ccc',
        boxShadow: '0 4px 8px #d1ceceff',
        padding: '25px',
        borderRadius: '8px',
        width: '45%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5">User Information</Typography>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              width: '150px',
            }}
          >
            <FaEnvelope />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Email Address
            </Typography>
          </Box>

          <Typography variant="body1">{props.profileData.email}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              width: '150px',
            }}
          >
            <FaPhone />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Phone number
            </Typography>
          </Box>
          <Typography variant="body1">{props.profileData.phone}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              width: '150px',
            }}
          >
            <FaMapMarkerAlt />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Address
            </Typography>
          </Box>
          <Typography variant="body1">
            {props.profileData.street || ''} {props.profileData.city || ''}{' '}
            {props.profileData.state || ''} {props.profileData.postcode || ''}{' '}
            {props.profileData.country || ''}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              width: '150px',
            }}
          >
            <FaRegCalendarAlt />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Member Since
            </Typography>
          </Box>
          <Typography variant="body1">
            {props.profileData.date_of_joining}
          </Typography>
        </Box>
      </Box>

      <Button variant="contained" onClick={() => handleEditClick()}>
        Edit My Profile
      </Button>
    </Box>
  )
}
