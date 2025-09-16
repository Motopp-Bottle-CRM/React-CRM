import React from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import {
  Tabs,
  Tab,
  Stack,
  Select,
  MenuItem,
  Typography,
  Button,
} from '@mui/material'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import LeadsToolBar from '../../components/LeadsToolBar'
import LeadList from '../../components/LeadList'
import { fetchData } from '../../components/FetchData'
import Company from '../company/Company'
import { LeadUrl } from '../../services/ApiUrls'
import { useNavigate } from 'react-router-dom'
import { SelectChangeEvent } from '@mui/material'
import { DeleteModal } from '../../components/DeleteModal'

export default function LeadsTest() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'open' | 'closed'>('open')
  const [openRecordsPerPage, setOpenRecordsPerPage] = useState<number>(10)
  const [closedRecordsPerPage, setClosedRecordsPerPage] = useState<number>(10)
  const [openCurrentPage, setOpenCurrentPage] = useState<number>(1)
  const [closedCurrentPage, setClosedCurrentPage] = useState<number>(1)
  const [openTotalPages, setOpenTotalPages] = useState<number>(0)
  const [closedTotalPages, setClosedTotalPages] = useState<number>(0)
  const [openLeadsCount, setOpenLeadsCount] = useState(0)
  const [openClosedCount, setClosedLeadsCount] = useState(0)
  const [openLoading, setOpenLoading] = useState(true)
  const [closedLoading, setClosedLoading] = useState(true)
  const [loading, setLoading] = useState(true)

  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState([])
  const [source, setSource] = useState([])
  const [companies, setCompanies] = useState([])
  const [tags, setTags] = useState([])
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [industries, setIndustries] = useState([])

  const [openLeads, setOpenLeads] = useState([])
  const [closedLeads, setClosedLeads] = useState([])

  const [deleteLeadModal, setDeleteLeadModal] = useState(false)

  const [selectedId, setSelectedId] = useState('')

  const modalDialog = 'Are You Sure You want to delete selected Lead?'
  const modalTitle = 'Delete Lead'

  const deleteLeadModalClose = () => {
    setDeleteLeadModal(false)
    setSelectedId('')
  }

  const handleDelete = (leadId: string) => {
    setSelectedId(leadId)
    setDeleteLeadModal(true)
  }
  const confirmDelete = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    fetchData(`${LeadUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        // console.log('delete:', res);
        if (!res.error) {
          getLeads()
          deleteLeadModalClose()
        }
      })
      .catch(() => {})
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as 'open' | 'closed')
  }
  const handleRecordsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (tab == 'open') {
      setOpenRecordsPerPage(parseInt(event.target.value))
      setOpenCurrentPage(1)
    } else {
      setClosedRecordsPerPage(parseInt(event.target.value))
      setClosedCurrentPage(1)
    }
  }
  const handlePrevPage = () => {
    if (tab == 'open') {
      setOpenCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    } else {
      setClosedCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }
  }
  const handleNextPage = () => {
    if (tab == 'open') {
      setOpenLoading(true)
      setOpenCurrentPage((prevPage) => Math.min(prevPage + 1, openTotalPages))
    } else {
      setClosedLoading(true)
      setClosedCurrentPage((prevPage) =>
        Math.min(prevPage + 1, closedTotalPages)
      )
    }
  }
  const handleAddLead = () => {
    if (!loading) {
      navigate('/app/leads/add-leads', {
        state: {
          detail: false,
          contacts: contacts || [],
          status: status || [],
          source: source || [],
          companies: companies || [],
          tags: tags || [],
          users: users || [],
          countries: countries || [],
          industries: industries || [],
        },
      })
    }
  }
  const handleSelectedLead = (leadId: string) => {
    navigate(`/app/leads/lead_details_test`, {
      state: {
        leadId,
        detail: true,
        contacts: contacts || [],
        status: status || [],
        source: source || [],
        companies: companies || [],
        tags: tags || [],
        users: users || [],
        countries: countries || [],
        industries: industries || [],
      },
    })
  }

  useEffect(() => {
    if (localStorage.getItem('org')) {
      getLeads()
    }
  }, [])

  useEffect(() => {
    getLeads()
  }, [
    openCurrentPage,
    closedCurrentPage,
    openRecordsPerPage,
    closedRecordsPerPage,
  ])
  const getLeads = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    }
    try {
      const openOffset = (openCurrentPage - 1) * openRecordsPerPage
      const closeOffset = (closedCurrentPage - 1) * closedRecordsPerPage

      await fetchData(
        `${LeadUrl}/?offset=${tab === 'open' ? openOffset : closeOffset}&limit=${tab === 'open' ? openRecordsPerPage : closedRecordsPerPage}`,
        'GET',
        null as any,
        Header
      ).then((res) => {
        if (!res.error) {
          setOpenLeads(res?.open_leads?.open_leads)
          setOpenLeadsCount(res?.open_leads?.leads_count)
          setOpenTotalPages(
            Math.ceil(res?.open_leads?.leads_count / openRecordsPerPage)
          )
          setClosedLeads(res?.close_leads?.close_leads)
          setClosedLeadsCount(res?.close_leads?.leads_count)
          setClosedTotalPages(
            Math.ceil(res?.close_leads?.leads_count / closedRecordsPerPage)
          )
          setContacts(res?.contacts)
          setStatus(res?.status)
          setSource(res?.source)
          setCompanies(res?.companies)
          setTags(res?.tags)
          setUsers(res?.users)
          setCountries(res?.countries)
          setIndustries(res?.industries)
          setLoading(false)
        }
      })
    } catch (error) {
      alert('Error fetching data:')
    }
  }

  return (
    <Box sx={{ mt: 8 }}>
      <LeadsToolBar
        tab={tab}
        onTabChange={handleTabChange}
        recordsPerPage={
          tab === 'open' ? openRecordsPerPage : closedRecordsPerPage
        }
        onRecordsChange={handleRecordsChange}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        currentPage={tab === 'open' ? openCurrentPage : closedCurrentPage}
        totalPages={tab === 'open' ? openTotalPages : closedTotalPages}
        onAddLead={handleAddLead}
      />
      {tab === 'open' ? (
        <LeadList
          leads={openLeads}
          onDelete={handleDelete}
          onSelectedLead={handleSelectedLead}
        />
      ) : (
        <LeadList
          leads={closedLeads}
          onDelete={handleDelete}
          onSelectedLead={handleSelectedLead}
        />
      )}
      <DeleteModal
        onClose={deleteLeadModalClose}
        open={deleteLeadModal}
        id={selectedId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={confirmDelete}
      />
    </Box>
  )
}
