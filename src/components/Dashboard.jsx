import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  CircularProgress,
  Fab,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person,
  Logout,
  Hotel,
  Group,
  Assessment,
  Settings,
  Close,
  PhotoCamera,
  CloudUpload,
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'

const Dashboard = () => {
const { user, refreshToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [userProfileData, setUserProfileData] = useState(null)
  const [profilePictureFile, setProfilePictureFile] = useState(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = () => {
    setProfileMenuOpen(true)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false)
    setUserProfileData(null)
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
      // Refresh profile data to show updated picture
      fetchUserProfile()
    },
    onError: (error) => {
      console.error('Profile picture upload failed:', error)
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
      // Even if API call fails, clear local state
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
      // Fallback if no refresh token
      dispatch(logout())
      navigate('/')
      handleProfileMenuClose()
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF)')
        return
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size should be less than 5MB')
        return
      }
      
      setProfilePictureFile(file)
      
      // Upload the file
      const formData = new FormData()
      formData.append('profilePicture', file)
      uploadProfilePictureMutation.mutate(formData)
    }
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
            Dashboard
          </Typography>
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
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Welcome Card */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  Welcome back, {user?.firstName}! 👋
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
                  Here's what's happening with your hostels today.
                </Typography>
              </Paper>
            </Grid>

            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Hotel sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>3</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Active Hostels</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group sx={{ fontSize: 40, color: '#764ba2', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>24</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Total Bookings</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>₹12,450</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Monthly Revenue</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ fontSize: 40, color: '#764ba2', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>89</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Active Guests</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 300
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Recent Activity
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Recent bookings and activities will be displayed here.
                </Typography>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  height: 300
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/my-hostels')}
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 1.5 
                    }}
                  >
                    Manage Hostels
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#667eea',
                      color: '#667eea',
                      py: 1.5 
                    }}
                  >
                    View Bookings
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#764ba2',
                      color: '#764ba2',
                      py: 1.5 
                    }}
                  >
                    Generate Report
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
    </Box>
  )
}

export default Dashboard
