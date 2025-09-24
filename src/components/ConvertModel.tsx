import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
} from '@mui/material'

export const ConvertModel = (props: any) => {
  const { onClose, open, modalDialog, modalTitle, id, ConvertLead } = props

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle
        sx={{
          fontSize: '18px',
          padding: '15px',
          width: '420px',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {modalTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: '16px',
            width: '450px',
            ml: -1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            {modalDialog}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose()}
          style={{ textTransform: 'capitalize' }}
        >cancel</Button>
        <Button
          onClick={() => ConvertLead()}
          style={{
            textTransform: 'capitalize',
            backgroundColor: '#3E79F7',
            color: 'white',
            height: '30px',
          }}
        >yes, convert Lead</Button>
      </DialogActions>
    </Dialog>
  )
}
