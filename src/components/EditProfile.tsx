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
  // const handleEditClick = () => {
  //     // Logic to switch to edit mode
  //     props.setEditMode(true);
  //     }
  const [country, setCountry] = useState('')
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
            value={country}
            size="small"
            onChange={(e) => setCountry(e.target.value)}
            sx={{ width: 250 }}
          >
            {countries.map((c) => (
              <MenuItem key={c.cca2} value={c.name.common}>
                {c.flag} {c.name.common}
              </MenuItem>
            ))}
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
