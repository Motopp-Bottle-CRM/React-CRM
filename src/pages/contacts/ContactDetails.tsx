import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Alert,
  Button,
  TextField,
  ListItem,
  IconButton,
  Tooltip,
} from '@mui/material'
import { greenA100 } from 'material-ui/styles/colors'
import { fetchData } from '../../components/FetchData'
import { ContactUrl } from '../../services/ApiUrls'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CustomAppBar } from '../../components/CustomAppBar'
import {
  FaDownload,
  FaEllipsisV,
  FaPaperclip,
  FaPlus,
  FaRegAddressCard,
  FaStar,
  FaTimes,
  FaTrash,
} from 'react-icons/fa'
import { useParams } from 'react-router-dom'

export default function ContactDetails() {
  interface RecievedComments {
    id: string
    comment: string
    commented_on: string
    commented_by: {
      id: string
      email: string
    }
    contact: string
  }
  interface RecievedAttachments {
    id: string
    attachment: string
    file_name: string
    file_path: string
  }
  interface CreatedBy {
    id: string
    email: string
    profile_pic: string | null
  }

  interface Contact {
    id: string
    salutation: string
  first_name: string
  last_name: string
  primary_email: string
  secondary_email: string
    mobile_number: string
  secondary_number: string
    date_of_birth: string
    organization: string
  title: string
    language: string
    do_not_call: boolean
    department: string
  address_line: string
    street: string
  city: string
    state: string
  country: string
  postcode: string
    description: string
    linked_in_url: string
    facebook_url: string
    twitter_username: string
    created_by: CreatedBy
    created_at: string
    is_active: boolean
  }

  interface Address {
    address_line: string
    street: string
    city: string
    state: string
    postcode: string
    country: string
  }

  const navigate = useNavigate()
  const { state } = useLocation()
  const [leadDetails, setLeadDetails] = useState<{
    contact_obj: Contact
  } | null>(null)

  const [comment, setComment] = useState('')
  const [recievedComments, setRecievedComments] = useState<RecievedComments[]>([])
  const [attachmens, setAttachments] = useState<File[]>([])
  const [recievedAttachments, setRecievedAttachments] = useState<RecievedAttachments[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContactDetails()
    if (state?.contactId) {
      getComment(state.contactId)
      getAttachment(parseInt(state.contactId))
    }
  }, [state?.contactId])

  const getContactDetails = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    try {
      const response = await fetchData(
        `${ContactUrl}/${state?.contactId}/`,
        'GET',
        null as any,
        Header
      )
      setLeadDetails(response)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const getComment = async (id: string) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }

    // Get all comments from backend
    try {
      const response = await fetchData(
        `contacts/comment/${id}`,
        'GET',
        null as any,
        Header
      )
      setRecievedComments(response)
      console.log('get all comments successfully')
    } catch (error) {
      console.log('faild to get all comments', error)
    }
  }
  const addAttachments = (e: any) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files) as File[]
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }
  const backbtnHandle = () => {
    navigate('/app/contacts/')
  }
  const saveAttachment = async (id: number) => {

    if (attachmens.length === 0) return

    const formData = new FormData()
    attachmens.forEach((file) => {
      formData.append('attachment', file)
      formData.append('file_name', file.name)
    })
    const Header = {
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    try {
      const response = await fetchData(
        `contacts/attachment/${id}/`,
        'POST',
        formData,
        Header
      )

      console.log('Upload success:', response)
      setAttachments([])
      getAttachment(id)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const getAttachment = async(id:number)=>{
    const Header = {
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    try {
      const response = await fetchData(`contacts/attachment/${id}/`, 'GET', null as any, Header )
      setRecievedAttachments(response)
      console.log("success")

    } catch (error) {
      console.log("faild to get all attachments", error)

    }

  }
  const saveComment = async (id: string) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    const body = JSON.stringify({
      comment: comment,
    })

    try {
      if (comment.length === 0) return
      const response = await fetchData(
        `contacts/comment/${id}/`,
        'POST',
        body,
        Header
      )
      console.log('Comment saved:', response)
      setComment('')
      getComment(id)
    } catch (error) {
      console.log('failed to add Notes', error)
    }
  }
  const editHandle = () => {
    navigate('/app/contacts/edit-contact', {
      state: {
        id: state?.contactId,
        value: leadDetails?.contact_obj
      }
    })
  }

  const module = 'Contacts'
  const crntPage = 'Contact Details'
  const backBtn = 'Back To Contacts'

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ mt: '60px' }}>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
        onEdit={editHandle}
      />
      <Box sx={{ mt: '120px' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ width: '65%' }}>
            <Box
              sx={{
                width: '90%',
                border: 1,
                borderRadius: '12px',
                borderColor: 'grey.300',
                padding: 3,
                boxShadow: 3,
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: 'gray.900', fontWeight: 700, mb: 2 }}
              >
                Contact Information
              </Typography>
              <Box>
                <Grid container>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Full Name
                    </Typography>
                    <Typography sx={{ color: 'gray.900' }}>
                      {leadDetails?.contact_obj?.first_name} {leadDetails?.contact_obj?.last_name}
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Primary Email
                    </Typography>
                    <Typography sx={{ color: 'gray.900' }}>
                      {leadDetails?.contact_obj?.primary_email}
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Mobile Number
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.mobile_number}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box
              sx={{
                width: '90%',
                border: 1,
                borderRadius: '12px',
                borderColor: 'grey.300',
                padding: 3,
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: 'gray.900', fontWeight: 700, mb: 2 }}
              >
                Contact Details
              </Typography>
              <Box>
                <Grid container>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Salutation
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.salutation}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Organization
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.organization}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Title
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.title}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Department
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.department}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      Language
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.language}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Secondary Email
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.secondary_email}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Secondary Number
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.secondary_number}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Date of Birth
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.date_of_birth}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Do Not Call
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.do_not_call ? 'Yes' : 'No'}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      LinkedIn URL
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.linked_in_url}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Facebook URL
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.facebook_url}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Twitter Username
                    </Typography>
                    <Typography> {leadDetails?.contact_obj?.twitter_username}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Created By
                    </Typography>
                    <Typography>
                      {' '}
                      {leadDetails?.contact_obj?.created_by?.email}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Created At
                    </Typography>
                    <Typography>
                      {' '}
                      {new Date(leadDetails?.contact_obj?.created_at || '').toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Address
                    </Typography>
                    <Typography>
                      {' '}
                      {leadDetails?.contact_obj?.country}{' '}
                      {leadDetails?.contact_obj?.state}{' '}
                      {leadDetails?.contact_obj?.city}{' '}
                      {leadDetails?.contact_obj?.street}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: '35%' }}>
            <Box
              sx={{
                  display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: '90%',
                  border: 1,
                  borderRadius: '12px',
                  borderColor: 'grey.300',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-bettween',
                    alignItems: 'center',
                    gap: 16,
                    padding: 2,
                    borderBottom: 1,
                  }}
                >
                  <Typography>Attachments</Typography>
                  <Button
                    component="label"
                    variant="text"
                    startIcon={
                      <FaPlus style={{ fill: '#3E79F7', width: '12px' }} />
                    }
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    Add Attachments
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={addAttachments}
                    />
                  </Button>
                </Box>
                <Box sx={{ padding: 2 }}>
                  <Box sx={{ minHeight:100 }}>
                    {attachmens.map((file, index) => {
                      const url = URL.createObjectURL(file)
                      return (
                        <ListItem key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.name}
                          </a>
                        </ListItem>
                      )
                    })}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      mt: 2,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setAttachments([])}
                    >
                      {' '}
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => saveAttachment(parseInt(state?.contactId || '0'))}
                    >
                      {' '}
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '90%',
                  border: 1,
                  borderRadius: '12px',
                  borderColor: 'grey.300',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-bettween',
                    alignItems: 'center',
                    gap: 16,
                    padding: 2,
                    borderBottom: 1,
                  }}
                >
                  <Typography>Notes</Typography>
                </Box>
                <Box sx={{ padding: 2 }}>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Add a note..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  size="small"
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      mt: 2,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setComment('')}
                    >
                      {' '}
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => saveComment(state?.contactId || '')}
                    >
                      {' '}
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}