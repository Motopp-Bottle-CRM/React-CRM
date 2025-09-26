import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Box,
  Typography,
} from '@mui/material'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'

interface Lead {
  id: string
  title: string
  email: string
  phone: string
  company_name?: string
  source: string
  status: string
  created_by: { id: string; email: string; profile_pic: string }
  created_at: string
}

interface LeadListProps {
  leads: Lead[]
  onDelete: (id: string) => void
  onSelectedLead: (id: string) => void
}

export default function LeadList({
  leads,
  onDelete,
  onSelectedLead,
}: LeadListProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, width: '100%', overflowX: 'auto' }}
    >
      <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ width: '15%', textAlign: 'center' }}>
              Lead
            </TableCell>
            <TableCell sx={{ width: '15%', textAlign: 'center' }}>
              Company
            </TableCell>
            <TableCell sx={{ width: '20%', textAlign: 'center' }}>
              Contact
            </TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              Source
            </TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              Status
            </TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              Created
            </TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              Owner
            </TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              {/* Lead Name */}
              <TableCell
                onClick={() => onSelectedLead(lead.id)}
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}
              >
                {lead.title}
              </TableCell>

              {/* Company */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {lead?.company_name}
              </TableCell>

              {/* Contact */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FaEnvelope fontSize="small" />
                    <Typography variant="body2">{lead?.email ?? ''}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FaPhone fontSize="small" />
                    <Typography variant="body2">{lead?.phone ?? ''}</Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Source */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {lead.source}
              </TableCell>

              {/* Status */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {lead.status}
              </TableCell>

              {/* created at */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>

              {/* Owner */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <Avatar
                  alt={lead?.created_by?.email ?? ''}
                  src={lead?.created_by?.profile_pic ?? ''}
                  sx={{ width: 24, height: 24, mx: 'auto' }}
                  title={lead?.created_by?.email ?? ''}
                />
              </TableCell>

              {/* Action */}
              <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <IconButton onClick={() => onDelete(lead.id)}>
                  <FiTrash2 />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
