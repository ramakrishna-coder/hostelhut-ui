import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const TestRoute = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Test Route Component
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This is a simple test component to verify routing is working.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/dashboard')}
        sx={{ mr: 2 }}
      >
        Back to Dashboard
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/create-hostel')}
      >
        Go to Create Hostel
      </Button>
    </Box>
  )
}

export default TestRoute
