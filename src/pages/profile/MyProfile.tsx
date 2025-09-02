import React from 'react'
import { useState, useEffect } from 'react'
import { fetchData } from '../../components/FetchData'
import { Header } from '../../components/FetchData'
import { ProfileUrl } from '../../services/ApiUrls'
import { Box, Typography, Avatar, Button } from '@mui/material'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa'
import { ViewProfile } from '../../components/ViewProfile'
import { EditProfile } from '../../components/EditProfile'


export function MyProfile() {
  const [editMode, setEditMode] = useState(false)
  interface UserProfile {
    email?: string
    phone?: string
    address?: string
    role?: string
    date_of_joining?: string
    is_active?: boolean
  }
  const [profileData, setProfileData] = useState<UserProfile>({
    email: '',
    phone: '',
    address: '',
    role: '',
    date_of_joining: '',
    is_active: true,
  })

  useEffect(() => {
    // Fetch user data here
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    fetchData(`${ProfileUrl}/`, 'GET', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          const data = res?.user_obj
          setProfileData({
            email: data?.user_details?.email,
            phone: data?.phone,
            address: data?.address,
            role: data?.role,
            date_of_joining: data?.date_of_joining,
            is_active: data?.is_active,
          })
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error)
      })
  }, [])
  return (
    <Box
      p={12}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#81a6f5ff',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
      </Box>
      <Box
        mt={2}
        p={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',

            padding: '20px',
            borderRadius: '8px',
            width: '45%',
            textAlign: 'center',
            border: '1px  #ccc',
            boxShadow: '0 4px 8px #d1ceceff',
          }}
        >
          <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: "#3e79f7", fontSize: 40,}}>
            {profileData.email ? profileData.email.charAt(0).toUpperCase() : ""}
          </Avatar>
          <Typography variant="h6" sx={{mb:2}}>{profileData.email}</Typography>
          <Typography variant="h6">{profileData.role?.toLowerCase()}</Typography>
        </Box>
        {!editMode ? (
          <ViewProfile editMode={editMode} setEditMode={setEditMode} profileData={profileData} setProfileData={setProfileData} />
        ) : (
          <EditProfile editMode={editMode} setEditMode={setEditMode} profileData={profileData} setProfileData={setProfileData} />
        )}
      </Box>
    </Box>
  )
}
