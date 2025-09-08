import React from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { ProfileUrl, UserUrl } from '../services/ApiUrls'
import { fetchData } from './FetchData'

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
import { RequiredTextField } from '../styles/CssStyled'
export function EditProfile(props: any) {
  const [error, setError] = useState(false)
  const [profileErrors, setProfileErrors] = useState<any>({
    phone: '',
    alternate_phone: '',
  })
  const [localProfile, setLocalProfile] = useState(props.profileData)

  // Countries array with phone prefixes [code, name, phone_prefix] - same format as other components
  const countries = [
    ['IN', 'India', '+91'],
    ['US', 'United States', '+1'],
    ['GB', 'United Kingdom', '+44'],
    ['CA', 'Canada', '+1'],
    ['AU', 'Australia', '+61'],
    ['DE', 'Germany', '+49'],
    ['FR', 'France', '+33'],
    ['JP', 'Japan', '+81'],
    ['CN', 'China', '+86'],
    ['BR', 'Brazil', '+55'],
    ['MX', 'Mexico', '+52'],
    ['IT', 'Italy', '+39'],
    ['ES', 'Spain', '+34'],
    ['NL', 'Netherlands', '+31'],
    ['CH', 'Switzerland', '+41'],
    ['SE', 'Sweden', '+46'],
    ['NO', 'Norway', '+47'],
    ['DK', 'Denmark', '+45'],
    ['FI', 'Finland', '+358'],
    ['PL', 'Poland', '+48'],
    ['RU', 'Russian Federation', '+7'],
    ['KR', 'Korea, Republic of', '+82'],
    ['SG', 'Singapore', '+65'],
    ['TH', 'Thailand', '+66'],
  ]

  // Ensure address object is properly initialized
  // const initializeAddress = () => {
  //   if (!props.profileData.address) {
  //     props.setProfileData({
  //       ...props.profileData,
  //       address: {
  //         address_line: '',
  //         street: '',
  //         city: '',
  //         state: '',
  //         postcode: '',
  //         country: '',
  //       },
  //     })
  //   }
  // }

  // Initialize address on component mount
  useEffect(() => {
    setLocalProfile(props.profileData)
  }, [props.profileData])

  const handleEditClick = () => {
    // Logic to save profile changes
    props.setProfileData(localProfile)
    props.setEditMode(false)
    submitForm(localProfile)
  }

  const handleCancelClick = () => {
    // Logic to switch to view mode
    props.setEditMode(false)
  }

  const submitForm = (data: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }

    fetchData(`${ProfileUrl}/`, 'PUT', JSON.stringify(data), Header)
      .then((res: any) => {
        if (!res.error) {
          alert('Profile updated successfully')
          props.setEditMode(false)
        } else {
          setError(true)
        }
      })
      .catch(async (err: any) => {
        setError(true)
        profileErrors.phone = err?.profile_errors?.phone || {}
        setProfileErrors({ ...profileErrors, phone: profileErrors.phone })
        profileErrors.alternate_phone =
          err?.profile_errors?.alternate_phone || {}
        setProfileErrors({
          ...profileErrors,
          alternate_phone: profileErrors.alternate_phone,
        })
      })
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
              width: '200px',
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
              width: '200px',
            }}
          >
            <FaPhone />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Phone number
            </Typography>
          </Box>
          <Tooltip title="phone must starts with + and country code">
            <RequiredTextField
              id="outlined-basic"
              label="Phone number"
              value={localProfile.phone}
              onChange={(e) =>
                setLocalProfile({
                  ...localProfile,
                  phone: e.target.value,
                })
              }
              variant="outlined"
              size="small"
              required
              sx={{ width: 250 }}
            />
          </Tooltip>
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
              width: '200px',
            }}
          >
            <FaPhone />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Alternative phone
            </Typography>
          </Box>
          <Tooltip title="phone must starts with + and country code">
            <TextField
              id="outlined-basic"
              label="Alternate Phone"
              value={localProfile.alternate_phone}
              onChange={(e) =>
                setLocalProfile({
                  ...localProfile,
                  alternate_phone: e.target.value,
                })
              }
              variant="outlined"
              size="small"
              sx={{ width: 250 }}
            />
          </Tooltip>
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
              width: '200px',
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
            value={localProfile?.country || ''}
            size="small"
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                country: e.target.value,
              })
            }
            sx={{ width: 250 }}
          >
            {countries.map((option) => (
              <MenuItem key={option[0]} value={option[1]}>
                {option[1]}
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
              width: '200px',
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
            value={localProfile?.postcode || ''}
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                postcode: e.target.value,
              })
            }
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
              width: '200px',
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
            value={localProfile?.state || ''}
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                state: e.target.value,
              })
            }
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
              width: '200px',
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
            value={localProfile?.city || ''}
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                city: e.target.value,
              })
            }
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
              width: '200px',
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
            value={localProfile?.street || ''}
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                street: e.target.value,
              })
            }
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
              width: '200px',
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
            value={localProfile?.address_line || ''}
            onChange={(e) =>
              setLocalProfile({
                ...localProfile,
                address_line: e.target.value,
              })
            }
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
