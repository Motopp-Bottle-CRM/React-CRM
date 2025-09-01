import React from 'react'
import { Box, Typography, Avatar, Button } from '@mui/material'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa'
import { ViewProfile } from '../../components/ViewProfile'
import { EditProfile } from '../../components/EditProfile'
import { useState } from 'react'

export function MyProfile() {
  const [editMode, setEditMode] = useState(false)
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
          <Avatar sx={{ width: 100, height: 100, mb: 2 }}></Avatar>
          <Typography variant="h5">email address</Typography>
          <Typography variant="h7">Admin</Typography>
        </Box>
        {(!editMode ? <ViewProfile editMode={editMode} setEditMode={setEditMode} /> : <EditProfile editMode={editMode} setEditMode={setEditMode} />)}

      </Box>
    </Box>
  )
}
