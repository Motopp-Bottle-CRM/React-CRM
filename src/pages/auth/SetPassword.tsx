import React from 'react'
import { useEffect, useState } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import '../../styles/style.css'
import { fetchData } from '../../components/FetchData'
import { SetPasswordUrl } from '../../services/ApiUrls'
export default function SetPassword() {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    submitForm()
  }

  const submitForm = () => {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    fetchData(
      `${SetPasswordUrl}`,
      'POST',
      JSON.stringify({
        email,
        password,
        confirmPassword,
      }),
      header
    )
      .then((res: any) => {
        setSuccess('Password set successfully!')
        navigate('/login') // Redirect to login after successful password set
      })
      .catch((err: any) => {
        if (err.email) {
          setError(err.email) // user not found
        } else if (err.non_field_errors) {
          setError(err.non_field_errors[0]) // other general errors
        } else if (err.password) {
          setError(err.password[0]) // password validation errors
        }
         else {
          setError('An unexpected error occurred.')
        }
      })
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          height: '70%',
          width: '50%',
          border: 1,
          boxShadow: 3,
          borderColor: 'grey.300',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* left form section */}
        <Box
          flex={1}
          component={'form'}
          flexDirection="column"
          display="flex"
          justifyContent="center"
          sx={{
            width: '100%',
            height: '100%',
            // maxWidthwidth: '350px',
            margin: 'auto',
            padding: 3,
          }}
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Set Your Password
          </Typography>
          <TextField
            label="Email Address"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              width: '80%',
            }}
          ></TextField>
          <TextField
            label="Password"
            type="password"
            required
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 2,
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              width: '80%',
            }}
          ></TextField>
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              mb: 3,
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              width: '80%',
            }}
          ></TextField>
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#1E73BE',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              py: 1,
              '&:hover': { bgcolor: '#155a91' },
              width: '80%',
            }}
          >
            {' '}
            Submit
          </Button>
        </Box>

        {/* right blue section*/}
        <Box
          flex={1}
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', width: '100%', overflow: 'hidden' }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '0',
              bottom: '-40px',
              width: '150px',
              height: '150px',
              backgroundColor: '#37A2E4',
              zIndex: '2',
              borderRadius: '50%',
            }}
          ></Box>

          <Box
            sx={{
              position: 'absolute',
              top: '-30px',
              right: '-20px',
              width: '150px',
              height: '150px',
              backgroundColor: '#37A2E4',
              zIndex: '2',
              borderRadius: '50%',
              bottom: '0',
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              right: '0',
              bottom: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '90%',
              height: '100%',
              backgroundColor: '#1E73BE',
              zIndex: '1',
              borderRadius: '98% 0 0 0%',
            }}
          >
            <Box textAlign="center" color="white">
              <Typography variant="h4" fontWeight="bold">
                Welcome
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                Bottle CRM
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}
