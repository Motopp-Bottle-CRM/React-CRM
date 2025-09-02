import React from 'react'
import { useEffect, useState } from 'react'
import { Box, TextField, Typography, Button, Alert } from '@mui/material'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import '../../styles/style.css'
import { fetchData } from '../../components/FetchData'
import { SetPasswordUrl } from '../../services/ApiUrls'

interface InvitationData {
  email: string
  org_name: string
  role: string
  invited_by: string
  expires_at: string
}

export default function SetPassword() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const location = useLocation()
  
  // Check if we're coming from an invitation link
  const isInvitation = !!token
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingInvitation, setLoadingInvitation] = useState(isInvitation)

  useEffect(() => {
    if (isInvitation && token) {
      fetchInvitationData()
    }
  }, [token, isInvitation])

  const fetchInvitationData = async () => {
    try {
      const response = await fetchData(
        `set-password/${token}/`,
        'GET',
        null,
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      )
      
      if (!response.error) {
        setInvitationData(response.data)
        setEmail(response.data.email)
      } else {
        setError(response.errors || 'Invalid invitation link')
      }
    } catch (err: any) {
      setError('Failed to load invitation details')
    } finally {
      setLoadingInvitation(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    submitForm()
  }

  const submitForm = () => {
    setLoading(true)
    setError('')
    
    if (isInvitation) {
      // Handle invitation-based password setting
      fetchData(
        `set-password/${token}/`,
        'POST',
        JSON.stringify({
          password,
          confirm_password: confirmPassword,
        }),
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      )
        .then((res: any) => {
          setSuccess('Password set successfully! You can now log in.')
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        })
        .catch((err: any) => {
          if (err.errors) {
            if (typeof err.errors === 'string') {
              setError(err.errors)
            } else if (err.errors.password) {
              setError(err.errors.password[0])
            } else if (err.errors.confirm_password) {
              setError(err.errors.confirm_password[0])
            } else {
              setError('An error occurred while setting your password')
            }
          } else {
            setError('An unexpected error occurred')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      // Handle regular password setting (existing logic)
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
          navigate('/login')
        })
        .catch((err: any) => {
          if (err.email) {
            setError(err.email)
          } else if (err.non_field_errors) {
            setError(err.non_field_errors[0])
          } else if (err.password) {
            setError(err.password[0])
          } else {
            setError('An unexpected error occurred.')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  if (loadingInvitation) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Loading invitation details...</Typography>
      </div>
    )
  }

  if (error && isInvitation && !invitationData) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: '500px',
            padding: 3,
            border: 1,
            borderColor: 'error.main',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: '#1E73BE',
              '&:hover': { bgcolor: '#155a91' },
            }}
          >
            Go to Login
          </Button>
        </Box>
      </div>
    )
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
            margin: 'auto',
            padding: 3,
          }}
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Set Your Password
          </Typography>
          
          {isInvitation && invitationData && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You've been invited to join <strong>{invitationData.org_name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Role: <strong>{invitationData.role}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invited by: <strong>{invitationData.invited_by}</strong>
              </Typography>
            </Box>
          )}
          
          <TextField
            label="Email Address"
            variant="outlined"
            required={!isInvitation}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isInvitation}
            sx={{
              mb: 2,
              bgcolor: isInvitation ? '#f5f5f5' : '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              width: '80%',
            }}
          />
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
            helperText={isInvitation ? "Password must be at least 8 characters with uppercase, lowercase, and number" : ""}
          />
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
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '80%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '80%' }}>
              {success}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
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
            {loading ? 'Setting Password...' : 'Submit'}
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
