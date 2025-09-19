
import { useEffect, useState } from 'react'
import { Grid, Stack, Typography, Box, TextField, Button } from '@mui/material'
import { useGoogleLogin } from '@react-oauth/google'
import { Form, useNavigate } from 'react-router-dom'
import imgGoogle from '../../assets/images/auth/google.svg'
import imgLogo from '../../assets/images/auth/img_logo.png'
import imgLogin from '../../assets/images/auth/img_login.png'
import { GoogleButton } from '../../styles/CssStyled'
import { fetchData } from '../../components/FetchData'
import { LoginUrl, AuthUrl } from '../../services/ApiUrls'
import '../../styles/style.css'
console.log("Login.tsx file is loaded")

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [token, setToken] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form is being submitted")
    e.preventDefault()
    console.log('Form submitted')
    submitForm()
  }
  const submitForm = () => {
    console.log("submitForm is running")
  console.log('submitForm is running', { email, password })
  console.log("Email vefore sending to server : " , email)

  const header = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  fetchData(
    `${LoginUrl}/`,
    'POST',
    JSON.stringify({ email, password }),
    header
  )
    .then((res: any) => {
      console.log('Response from server:', res)   // <--- Add this
      localStorage.setItem('Token', `Bearer ${res.access}`)
      if (res.refresh) {
        localStorage.setItem('refreshToken', res.refresh)
      }
      if (res.org_id) {
        localStorage.setItem('org', res.org_id)
        console.log("Saving org to localStorage:", res.org_id)
      }
      localStorage.setItem('email', email)
      console.log("Saving email to localStorage:", email)
      setToken(true)
      navigate('/app') // Redirect to app after successful login
    })
    .catch((err: any) => {
      console.error('Login error :', err)
      console.log("Login error details:", err)
      if (err.email) {
        setError(err.email) // user not found
      } else if (err.non_field_errors) {
        setError(err.non_field_errors[0]) // other general errors
      } else if (err.password) {
        setError(err.password[0]) // password validation errors
      } else {
        setError('An unexpected error occurred.')
      }
    })
}


  useEffect(() => {
    if (localStorage.getItem('Token')) {
      // navigate('/organization')
      navigate('/app')
    }
  }, [token])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const apiToken = { token: tokenResponse.access_token }
      const head = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
      fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
        .then((res: any) => {



          if (res.access_token) {
            localStorage.setItem('Token', `Bearer ${res.access_token}`)
            if (res.refresh_token) {
              localStorage.setItem('refreshToken', res.refresh_token)
            }
            if (res.org_id) {
              localStorage.setItem('org', res.org_id)
              console.log("Saving org to localStorage:", res.org_id)
            }
            localStorage.setItem('email', res.username)
            setToken(true)
            setSuccess('Successfully logged in with Google!')
            setError('')
          } else {
            setError('Failed to get access token from server')
          }

        })
        .catch((error: any) => {
          console.error('Google login error:', error)
          if (error.error) {
            setError(error.error)
          } else if (error.message) {
            setError(error.message)
          } else {
            setError('Google authentication failed. Please try again.')
          }
        })
    },
    onError: (error) => {
      console.error('Google OAuth error:', error)
      setError('Google authentication failed. Please try again.')
    },
  })
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh', width: '100%', position: 'fixed' }}
    >
      <Grid container xs={12} md={6}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <img src={imgLogo} alt="logo" className="login-logo" width={150} />

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
                  Sign In
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
                    width: '90%',
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
                    width: '90%',
                  }}
                ></TextField>

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
                    width: '90%',
                  }}
                >
                  Sign In
                </Button>
                {error && (
                  <Typography color="error.main" mt={2} textAlign="center">
                    {error}
                  </Typography>
                )}
                {success && (
                  <Typography color="success.main" mt={2} textAlign="center">
                    {success}
                  </Typography>
                )}
              </Box>

              {/* right blue section*/}
              <Box
                flex={1}
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '350px', width: '800px', overflow: 'hidden' }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: '0',
                    bottom: '-40px',
                    width: '120px',
                    height: '120px',
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
                    width: '120px',
                    height: '120px',
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
                ></Box>
              </Box>
            </Box>
            <GoogleButton
              onClick={() => login()}
              sx={{
                width: '30%',
                textTransform: 'none',
                borderRadius: '20px',
                py: 1,
              }}
            >
              <img src={imgGoogle} alt="google" width={15} />
              <Typography sx={{ ml: 1, fontSize: '16px', color: '#080808ff' }}>
                Login with Google
              </Typography>
            </GoogleButton>
          </Stack>
        </Grid>
      </Grid>
      {/* <Grid
        container
        xs={12}
        md={6}
        direction="column"
        justifyContent="center"
        alignItems="center"
        className="rightBg"
        sx={{
          height: '100%',
          overflow: 'hidden',
          justifyItems: 'center',
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <Grid item>
          <Stack sx={{ alignItems: 'center' }}>
            <h3>Welcome to BottleCRM</h3>
            <p> Free and OpenSource CRM from small medium business.</p>
            <img
              src={imgLogin}
              alt="register_ad_image"
              className="register-ad-image"
            />
            <footer className="register-footer">bottlecrm.com</footer>
          </Stack>
        </Grid>
      </Grid> */}
    </Stack>
  )
}