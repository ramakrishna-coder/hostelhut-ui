import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Fab,
  Paper,
  Avatar,
  Skeleton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Hotel,
  LocationOn,
  AttachMoney,
  Group,
  Star,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person,
  Logout,
  Assessment,
  Settings,
  Close,
  PhotoCamera,
} from '@mui/icons-material'
import { hostelService } from '../services/hostelService'
import { logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'

const MyHostels = () => {
  const { user, refreshToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [hostelToDelete, setHostelToDelete] = useState(null)
  
  // Fetch hostels
  const { data: hostels, isLoading, error } = useQuery({
    queryKey: ['myHostels'],
    queryFn: hostelService.getHostels
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = () => {
    setProfileMenuOpen(true)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false)
  }

  // Fetch user profile when profile menu is opened
  const { refetch: fetchUserProfile, data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: authService.getUserProfile,
    enabled: false
  })

  // Profile picture upload mutation
  const uploadProfilePictureMutation = useMutation({
    mutationFn: authService.uploadProfilePicture,
    onSuccess: (data) => {
      console.log('Profile picture uploaded successfully:', data)
      fetchUserProfile()
    },
    onError: (error) => {
      console.error('Profile picture upload failed:', error)
    }
  })

  // Delete hostel mutation
  const deleteHostelMutation = useMutation({
    mutationFn: hostelService.deleteHostel,
    onSuccess: () => {
      queryClient.invalidateQueries(['myHostels'])
      setDeleteDialogOpen(false)
      setHostelToDelete(null)
    },
    onError: (error) => {
      console.error('Delete failed:', error)
      alert('Failed to delete hostel. Please try again.')
    }
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: (refreshToken) => authService.logout(refreshToken),
    onSuccess: () => {
      dispatch(logout())
      navigate('/')
      handleProfileMenuClose()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      dispatch(logout())
      navigate('/')
      handleProfileMenuClose()
    }
  })

  const handleProfileClick = () => {
    setProfileMenuOpen(true)
    fetchUserProfile()
  }

  const handleLogout = () => {
    if (refreshToken) {
      logoutMutation.mutate(refreshToken)
    } else {
      dispatch(logout())
      navigate('/')
      handleProfileMenuClose()
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF)')
        return
      }
      
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size should be less than 5MB')
        return
      }
      
      const formData = new FormData()
      formData.append('profilePicture', file)
      uploadProfilePictureMutation.mutate(formData)
    }
  }

  const handleCreateHostel = () => {
    navigate('/create-hostel')
  }

  const handleEditHostel = (hostelId) => {
    navigate(`/edit-hostel/${hostelId}`)
  }

  const handleViewHostel = (hostelId) => {
    navigate(`/hostel/${hostelId}`)
  }

  const handleDeleteHostel = (hostel) => {
    setHostelToDelete(hostel)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (hostelToDelete) {
      deleteHostelMutation.mutate(hostelToDelete.id)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setHostelToDelete(null)
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Error loading hostels
            </Typography>
            <Typography variant="body1">
              {error.message || 'Something went wrong'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  const drawerWidth = 280

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Hostels', icon: <Hotel />, path: '/my-hostels' },
    { text: 'Bookings', icon: <Group />, path: '/bookings' },
    { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ]

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          HostelHut
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              color: 'white',
              width: 56,
              height: 56,
              fontSize: '1.5rem'
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {user?.email}
        </Typography>
      </Box>
      
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{ 
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                py: 1.5
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
        <ListItemButton 
          onClick={handleProfileClick}
          sx={{ 
            borderRadius: 2,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            py: 1.5
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'white' }}>
            My Hostels
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateHostel}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            Create New Hostel
          </Button>
        </Toolbar>
      </AppBar>

      {/* Side Navigation */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 }
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>

        {/* Hostels Grid */}
        {isLoading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ height: '100%', borderRadius: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (!hostels || hostels.length === 0) ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Hotel sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
              No Hostels Yet
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
              Start by creating your first hostel property
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateHostel}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Create Your First Hostel
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {hostels.map((hostel) => (
              <Grid item xs={12} sm={6} md={4} key={hostel.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={hostel.images?.[0] || '/placeholder-hostel.jpg'}
                    alt={hostel.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', flex: 1 }}>
                        {hostel.name}
                      </Typography>
                      <Chip
                        label={hostel.type}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {hostel.city}, {hostel.country}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney sx={{ fontSize: 16, color: '#667eea', mr: 0.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₹{hostel.pricePerNight}/night
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Group sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {hostel.totalBeds} beds
                        </Typography>
                      </Box>
                    </Box>

                    {hostel.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Star sx={{ fontSize: 16, color: '#ffc107', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                          {hostel.rating}/5
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', ml: 0.5 }}>
                          ({hostel.reviewCount} reviews)
                        </Typography>
                      </Box>
                    )}

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {hostel.description}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewHostel(hostel.id)}
                      sx={{ color: '#667eea' }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditHostel(hostel.id)}
                      sx={{ color: '#764ba2' }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteHostel(hostel)}
                      sx={{ color: '#f44336', ml: 'auto' }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        </Container>
      </Box>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        onClick={handleCreateHostel}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)',
          },
          display: { xs: 'block', md: 'none' }, // Only show on mobile
        }}
      >
        <Add />
      </Fab>

      {/* Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <Box
          sx={{
            width: { xs: '100vw', sm: 400 },
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            overflow: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              onClick={handleProfileMenuClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
              mt: 2
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar 
                src={profileData?.profilePicture}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  width: 80,
                  height: 80,
                  fontSize: '2rem'
                }}
              >
                {!profileData?.profilePicture && (
                  <>{profileData?.firstName?.[0] || user?.firstName?.[0]}{profileData?.lastName?.[0] || user?.lastName?.[0]}</>
                )}
              </Avatar>
              
              {/* Upload Profile Picture Button */}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="profile-picture-upload">
                <Tooltip title="Upload Profile Picture">
                  <Fab
                    size="small"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#667eea',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                      width: 32,
                      height: 32,
                      minHeight: 32
                    }}
                    disabled={uploadProfilePictureMutation.isPending}
                  >
                    {uploadProfilePictureMutation.isPending ? (
                      <CircularProgress size={16} sx={{ color: '#667eea' }} />
                    ) : (
                      <PhotoCamera sx={{ fontSize: 16 }} />
                    )}
                  </Fab>
                </Tooltip>
              </label>
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Profile
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
              }}
            >
              Manage your account settings
            </Typography>
          </Box>

          {/* Profile Details */}
          <Box sx={{ mb: 4 }}>
            {profileLoading ? (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Loading profile details...
                </Typography>
              </Paper>
            ) : profileData ? (
              <>
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      First Name
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {profileData.firstName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Last Name
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {profileData.lastName}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Email Address
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {profileData.email}
                    </Typography>
                  </Box>
                </Paper>
              </>
            ) : profileError ? (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ color: 'rgba(255, 100, 100, 0.9)' }}>
                  Error loading profile: {profileError.message}
                </Typography>
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Click to load profile details...
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Logout Button */}
          <Box sx={{ mt: 'auto' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              startIcon={<Logout />}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 69, 58, 0.3)',
                  border: '1px solid rgba(255, 69, 58, 0.5)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
          Delete Hostel
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{hostelToDelete?.name}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCancelDelete} 
            variant="outlined"
            sx={{ 
              color: '#666', 
              borderColor: '#ddd',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#ccc'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={deleteHostelMutation.isPending}
            sx={{
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            {deleteHostelMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyHostels
