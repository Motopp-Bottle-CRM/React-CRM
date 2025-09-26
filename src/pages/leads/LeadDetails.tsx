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
import { LeadUrl } from '../../services/ApiUrls'
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
import { json } from 'stream/consumers'
export default function LeadDetailsTest() {
  interface RecievedComments {
    id: string
    comment: string
    commented_on: string
    commented_by: {
      id: string
      email: string
    }
    lead: string
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

  interface Lead {
    id: string
    title: string
    first_name: string
    last_name: string
    phone: string
    email: string
    status: string
    source: string
    address_line: string
    contacts: any[]
    street: string
    city: string
    state: string
    postcode: string
    country: string
    website: string
    description: string
    lead_attachment: any[]
    assigned_to: any[]
    account_name: string
    opportunity_amount: string
    created_by: CreatedBy
    created_at: string
    is_active: boolean
    enquiry_type: string | null
    tags: any[]
    created_from_site: boolean
    teams: any[]
    skype_ID: string
    industry: string
    company_name: string
    organization: string | null
    probability: number
    close_date: string | null
  }

  interface Address {
    address_line: string
    street: string
    city: string
    state: string
    postcode: string
    country: string
  }

  interface User {
    id: string
    user_details: {
      email: string
      id: string
      is_active: boolean
      profile_pic: string | null
    }

    role: string
    address: Address | null
    has_marketing_access: boolean
    has_sales_access: boolean
    phone: string
    alternate_phone: string
    date_of_joining: string | null
    is_active: boolean
  }

  interface LeadDetailsReponse {
    lead_obj: Lead
    attachments: any[]
    comments: any[]
    users_mention: { user__email: string }[]
    assigned_data: any[]
    users: User[]
    users_excluding_team: User[]
    source: [string, string][]
    status: [string, string][]
    teams: any[]
    countries: [string, string][]
  }
  const navigate = useNavigate()
  const { state } = useLocation()
  const [leadDetails, setLeadDetails] = useState<LeadDetailsReponse | null>(
    null
  )
  const [attachmens, setAttachments] = useState<File[]>([])
  const [comment, setComment] = useState<String>('')
  const [recievedComments, setRecievedComments] = useState<RecievedComments[]>(
    []
  )
  const [recievedAttachments, setRecievedAttachments] = useState<RecievedAttachments[]>([])
  useEffect(() => {
    getLeadDetails(state?.leadId)
    getComment(state?.leadId)
    getAttachment(state?.leadId)
  }, [state.leadId])

  const getLeadDetails = async (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    try {
      const response = await fetchData(
        `${LeadUrl}/${id}/`,
        'GET',
        null as any,
        Header
      )
      setLeadDetails(response)
    } catch (error) {
      ;<Alert
        onClose={() => navigate('/app/leads')}
        severity="error"
        sx={{ width: '100%' }}
      >
        Failed to load!
      </Alert>
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
        `leads/comment/${id}`,
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
    navigate('/app/leads/')
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
        `leads/attachment/${id}/`,
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
      const response = await fetchData(`leads/attachment/${id}/`, 'GET', null as any, Header )
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
        `leads/comment/${id}/`,
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
    navigate('/app/leads/edit-lead', {
      state: {
        value: {
          title: leadDetails?.lead_obj?.title,
          first_name: leadDetails?.lead_obj?.first_name,
          last_name: leadDetails?.lead_obj?.last_name,
          account_name: leadDetails?.lead_obj?.account_name,
          phone: leadDetails?.lead_obj?.phone,
          email: leadDetails?.lead_obj?.email,
          lead_attachment: leadDetails?.lead_obj?.lead_attachment,
          opportunity_amount: leadDetails?.lead_obj?.opportunity_amount,
          website: leadDetails?.lead_obj?.website,
          description: leadDetails?.lead_obj?.description,
          teams: leadDetails?.lead_obj?.teams,
          assigned_to: leadDetails?.lead_obj?.assigned_to,
          contacts: leadDetails?.lead_obj?.contacts,
          status: leadDetails?.lead_obj?.status,
          source: leadDetails?.lead_obj?.source,
          address_line: leadDetails?.lead_obj?.address_line,
          street: leadDetails?.lead_obj?.street,
          city: leadDetails?.lead_obj?.city,
          state: leadDetails?.lead_obj?.state,
          postcode: leadDetails?.lead_obj?.postcode,
          country: leadDetails?.countries?.[0],
          tags: leadDetails?.lead_obj?.tags,
          company: leadDetails?.lead_obj?.company_name,
          probability: leadDetails?.lead_obj?.probability,
          industry: leadDetails?.lead_obj?.industry,
          skype_ID: leadDetails?.lead_obj?.skype_ID,
          close_date: leadDetails?.lead_obj?.close_date,
          organization: leadDetails?.lead_obj?.organization,
          created_from_site: leadDetails?.lead_obj?.created_from_site,
        },
        id: state?.leadId,
        users: leadDetails?.users,
        status: leadDetails?.status,
        countries: leadDetails?.countries,
        comment,
      },
    })
  }
  const module = 'Leads'
  const crntPage = 'Lead Details'
  const backBtn = 'Back To Leads'
  return (
    <Box sx={{ mt: 10 }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        editHandle={editHandle}
      />
      <Box sx={{ mt: 15 }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              width: '65%',
              display: 'flex',
              flexDirection: 'column',
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
                padding: 3,
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: 'gray.900', fontWeight: 700 }}
              >
                Contact Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container>
                  <Grid
                    item
                    md={12}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                    }}
                  >
                    <Avatar sx={{ backgroundColor: '#1976d2' }}>
                      {leadDetails?.lead_obj.first_name.charAt(0)}
                    </Avatar>
                    <Typography
                      sx={{ fontSize: 25, color: 'gray.900', fontWeight: 500 }}
                    >
                      {leadDetails?.lead_obj?.first_name}{' '}
                      {leadDetails?.lead_obj?.last_name}
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Email Address
                    </Typography>
                    <Typography sx={{ color: 'gray.900' }}>
                      {leadDetails?.lead_obj?.email}
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Phone
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.phone}</Typography>
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
                Lead Information
              </Typography>
              <Box>
                <Grid container>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Lead Name
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.title}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Lead Source
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.source}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Lead Status
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.status}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Industry
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.industry}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      Company
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.company_name}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Website
                    </Typography>
                    <Typography> {leadDetails?.lead_obj?.website}</Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      Created_by
                    </Typography>
                    <Typography>
                      {' '}
                      {leadDetails?.lead_obj?.created_by?.email}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Probability
                    </Typography>
                    <Typography>
                      {' '}
                      {leadDetails?.lead_obj?.probability}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#2b6ac4ff', fontWeight: 500 }}>
                      {' '}
                      Address
                    </Typography>
                    <Typography>
                      {' '}
                      {leadDetails?.lead_obj?.country}{' '}
                      {leadDetails?.lead_obj?.state}{' '}
                      {leadDetails?.lead_obj?.city}{' '}
                      {leadDetails?.lead_obj?.street}
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
                      onClick={()=>saveAttachment(state?.leadId)}
                    >
                      {' '}
                      Save
                    </Button>
                  </Box>
                  <Box sx={{mt:1}}>

                      {recievedAttachments.map((attachment, index)=>(
                        <ListItem key={attachment.id}>
                          <a href={attachment.file_path} download={attachment.file_name}>{attachment.file_name}</a>
                        </ListItem>

                      ))}

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
                    gap: 27,
                    padding: 2,
                    borderBottom: 1,
                  }}
                >
                  <Typography>Notes</Typography>
                </Box>
                <Box sx={{}}>
                  <Box sx={{ m: 2 }}>
                    <TextField
                      label="Add Notes here ..."
                      multiline
                      value={comment}
                      rows={5} // number of visible lines
                      fullWidth
                      variant="outlined"
                      onChange={(e) => setComment(e.target.value)}
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
                        onClick={() => saveComment(state.leadId)}
                      >
                        {' '}
                        Save
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    {recievedComments.map((comment, index) => (
                      <ListItem sx={{display:'flex', flexDirection:'column', gap:2, alignItems:"flex-start"}}>
                        <Box>
                          <Box>
                            <Avatar sx={{backgroundColor: "#1976d2"}}></Avatar>
                            <Typography>{comment?.commented_by?.email}</Typography>
                          </Box>
                          <Box>
                            {new Date(comment.commented_on).toLocaleString("nl-NL",{
                              year:"numeric",
                              month:"short",
                              day:"numeric",
                              hour:"2-digit",
                              minute:"2-digit"
                            })}
                          </Box>
                        </Box>
                        <Box sx={{padding:2, border:1, borderColor:"#c0b8b8ff", borderRadius:4, width:'90%'}}>{comment.comment}</Box>




                        {/* <Typography>{comment?.commented_by?.email}</Typography> */}
                      </ListItem>
                    ))}
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
