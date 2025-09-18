import React, { useState } from 'react'
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
import { SelectChangeEvent } from '@mui/material'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus'
import { CustomToolbar, CustomTab } from '../styles/CssStyled'
import { FabLeft, FabRight } from '../styles/CssStyled'
import { SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface LeadsToolbarProps {
  tab: string
  onTabChange: (event: React.SyntheticEvent, value: string) => void
  recordsPerPage: number
  onRecordsChange: (event: any) => void
  onPrevPage: () => void
  onNextPage: () => void
  currentPage: number
  totalPages: number
  onAddLead: () => void
}

export default function LeadsToolBar({
  tab,
  onTabChange,
  recordsPerPage,
  onRecordsChange,
  onPrevPage,
  onNextPage,
  currentPage,
  totalPages,
  onAddLead,
}: LeadsToolbarProps) {
  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ]
  const [selectOpen, setSelectOpen] = React.useState(false)

  return (
    <Box>
      <CustomToolbar>
        <Tabs defaultValue={tab} onChange={onTabChange} sx={{ mt: '26px' }}>
          <CustomTab
            value="open"
            label="Open"
            sx={{
              backgroundColor: tab === 'open' ? '#F0F7FF' : '#284871',
              color: tab === 'open' ? '#3f51b5' : 'white',
            }}
          />
          <CustomTab
            value="closed"
            label="Closed"
            sx={{
              backgroundColor: tab === 'closed' ? '#F0F7FF' : '#284871',
              color: tab === 'closed' ? '#3f51b5' : 'white',
              ml: '5px',
            }}
          />
        </Tabs>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={recordsPerPage}
            onChange={onRecordsChange}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            className={`custom-select`}
            onClick={() => setSelectOpen(!selectOpen)}
            IconComponent={() => (
              <div
                onClick={() => setSelectOpen(!selectOpen)}
                className="custom-select-icon"
              >
                {selectOpen ? (
                  <FiChevronUp style={{ marginTop: '12px' }} />
                ) : (
                  <FiChevronDown style={{ marginTop: '12px' }} />
                )}
              </div>
            )}
            sx={{
              '& .MuiSelect-select': { overflow: 'visible !important' },
            }}
          >
            {recordsList?.length &&
              recordsList.map((item: any, i: any) => (
                <MenuItem key={i} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
          </Select>
          <Box
            sx={{
              borderRadius: '7px',
              backgroundColor: 'white',
              height: '40px',
              minHeight: '40px',
              maxHeight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mr: 1,
              p: '0px',
            }}
          >
            <FabLeft
              onClick={onPrevPage}
              disabled={
                currentPage === 1
              }
            >
              <FiChevronLeft style={{ height: '15px' }} />
            </FabLeft>
            <Typography
              sx={{
                mt: 0,
                textTransform: 'lowercase',
                fontSize: '15px',
                color: '#1A3353',
                textAlign: 'center',
              }}
            >
              {
                `${currentPage} to ${totalPages}`
            }
            </Typography>
            <FabRight
              onClick={onNextPage}
              disabled={
                currentPage === totalPages
              }
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>
          <Button
            variant="contained"
            startIcon={<FiPlus className="plus-icon" />}
            onClick={onAddLead}
            className={'add-button'}
          >
            Add Lead
          </Button>
        </Stack>
      </CustomToolbar>
    </Box>
  )
}
