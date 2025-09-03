import React from 'react'
import { useState } from 'react'
import { Box, Typography, Button, TextField, MenuItem } from '@mui/material'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaGlobe,
  FaHome,
  FaCity,
  FaMap,
  FaMailBulk,
  FaBuilding,
} from 'react-icons/fa'
import countries from 'world-countries'

export function EditProfile(props: any) {
  // const handleEditClick = (event) => {
  //   // Logic to switch to edit mode
  //   event.preventDefault()
  // }

  const [country, setCountry] = useState('')
  
  // Ensure countries is an array and add error handling
  const countriesList = Array.isArray(countries) ? countries : []
  
  // Debug log to help identify the issue
  console.log('Countries data:', countries, 'Type:', typeof countries, 'Is Array:', Array.isArray(countries))
  
  const handleEditClick = () => {
    // Logic to save profile changes
    props.setEditMode(false)
  }
  
  const handleCancelClick = () => {
    // Logic to switch to view mode
    props.setEditMode(false)
  }

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
      <Typography variant="h5">Edit Profile Information</Typography>
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
          <TextField
            id="outlined-basic"
            label="Phone number"
            value={props.profileData.phone}
            onChange={(e) =>props.setProfileData({...props.profileData, phone: e.target.value})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
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
            <FaGlobe />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Country
            </Typography>
            <br />
          </Box>
          <TextField
            select
            label="Select Country"
            value={props.profileData.address?.country || ''}
            size="small"
            onChange={(e) => props.setProfileData({...props.profileData, address: { ...props.profileData.address, country: e.target.value }})}
            sx={{ width: 250 }}
          >
            {countriesList.length > 0 ? countriesList.map((c) => (
              <MenuItem key={c.cca2} value={c.name.common}>
                {c.flag} {c.name.common}
              </MenuItem>
            )) : (
              <MenuItem value="">
                <em>No countries available</em>
              </MenuItem>
            )}
          </TextField>
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
            <FaMailBulk />
            <Typography variant="body1" sx={{ mr: 2 }}>
              PostCode
            </Typography>
          </Box>
          <TextField
            id="outlined-basic"
            label="PostCode"
            value={props.profileData.address?.postcode || ''}
            onChange={(e) =>props.setProfileData({...props.profileData, address: { ...props.profileData.address, postcode: e.target.value }})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
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
            <FaMap />
            <Typography variant="body1" sx={{ mr: 2 }}>
              State
            </Typography>
          </Box>
          <TextField
            id="outlined-basic"
            label="state"
            value={props.profileData.address?.state || ''}
            onChange={(e) =>props.setProfileData({...props.profileData, address: { ...props.profileData.address, state: e.target.value }})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
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
            <FaCity />
            <Typography variant="body1" sx={{ mr: 2 }}>
              City
            </Typography>
          </Box>
          <TextField
            id="outlined-basic"
            label="city"
            value={props.profileData.address?.city || ''}
            onChange={(e) =>props.setProfileData({...props.profileData, address: { ...props.profileData.address, city: e.target.value }})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
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
            <FaHome />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Street
            </Typography>
          </Box>
          <TextField
            id="outlined-basic"
            label="street name and number"
            value={props.profileData.address?.street || ''}
            onChange={(e) =>props.setProfileData({...props.profileData, address: { ...props.profileData.address, street: e.target.value }})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
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
            <FaBuilding />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Address_line
            </Typography>
          </Box>
          <TextField
            id="outlined-basic"
            label="Floor, Building, Apartment"
            value={props.profileData.address?.address_line || ''}
            onChange={(e) =>props.setProfileData({...props.profileData, address: { ...props.profileData.address, address_line: e.target.value }})}
            variant="outlined"
            size="small"
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button
          sx={{ width: 100 }}
          variant="contained"
          onClick={() => handleEditClick()}
        >
          save
        </Button>
        <Button
          sx={{ width: 100 }}
          variant="contained"
          onClick={() => handleCancelClick()}
        >
          cancel
        </Button>
      </Box>
    </Box>
  )
}
