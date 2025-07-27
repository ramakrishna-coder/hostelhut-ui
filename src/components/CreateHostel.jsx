import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Fab,
  Tooltip,
} from '@mui/material'
import {
  ArrowBack,
  LocationOn,
  Hotel,
  AttachMoney,
  PhotoCamera,
  Delete,
  Add,
  Phone,
  Email,
  Language,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  LocalLaundryService,
  Security,
  Air,
  Kitchen,
  Tv,
  CheckCircle,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person,
  Logout,
  Group,
  Assessment,
  Settings,
  Close,
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'
import { hostelService } from '../services/hostelService'
const CreateHostel = () => {
  const { user, refreshToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

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

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    type: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    
    // Contact
    contactNumber: '',
    email: '',
    website: '',
    
    // Pricing & Capacity
    pricePerNight: '',
    totalBeds: '',
    totalRooms: '',
    maxGuests: '',
    
    // Amenities
    amenities: [],
    
    // Policies
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'flexible',
    petFriendly: false,
    smokingAllowed: false,
    alcoholAllowed: true,
    
    // Additional Info
    nearbyAttractions: [],
    houseRules: '',
    safetyFeatures: [],
  })

  const hostelTypes = [
    'Backpacker Hostel',
    'Boutique Hostel',
    'Party Hostel',
    'Quiet Hostel',
    'Family Hostel',
    'Luxury Hostel',
    'Eco Hostel',
    'Business Hostel'
  ]

  const amenitiesList = [
    { key: 'wifi', label: 'Free WiFi', icon: <Wifi /> },
    { key: 'parking', label: 'Parking', icon: <LocalParking /> },
    { key: 'restaurant', label: 'Restaurant', icon: <Restaurant /> },
    { key: 'gym', label: 'Fitness Center', icon: <FitnessCenter /> },
    { key: 'pool', label: 'Swimming Pool', icon: <Pool /> },
    { key: 'laundry', label: 'Laundry Service', icon: <LocalLaundryService /> },
    { key: 'security', label: '24/7 Security', icon: <Security /> },
    { key: 'ac', label: 'Air Conditioning', icon: <Air /> },
    { key: 'kitchen', label: 'Shared Kitchen', icon: <Kitchen /> },
    { key: 'tv', label: 'TV Lounge', icon: <Tv /> },
  ]

  const steps = [
    'Basic Information',
    'Location Details',
    'Contact Information',
    'Pricing & Capacity',
    'Amenities & Features',
    'Policies & Rules',
    'Photos & Gallery'
  ]

  const createHostelMutation = useMutation({
    mutationFn: hostelService.createHostel,
    onSuccess: (data) => {
      setSuccessMessage('Hostel created successfully!')
      setTimeout(() => {
        navigate('/my-hostels')
      }, 2000)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create hostel'
      setErrors({ submit: errorMessage })
    }
  })

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAmenityToggle = (amenityKey) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityKey)
        ? prev.amenities.filter(a => a !== amenityKey)
        : [...prev.amenities, amenityKey]
    }))
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format`)
        return false
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 5MB)`)
        return false
      }
      
      return true
    })

    setSelectedImages(prev => [...prev, ...validFiles])
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, {
          file: file,
          url: e.target.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Hostel name is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.type) newErrors.type = 'Hostel type is required'
        break
        
      case 1: // Location Details
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.state.trim()) newErrors.state = 'State is required'
        if (!formData.country.trim()) newErrors.country = 'Country is required'
        break
        
      case 2: // Contact Information
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
        break
        
      case 3: // Pricing & Capacity
        if (!formData.pricePerNight || formData.pricePerNight <= 0) newErrors.pricePerNight = 'Valid price is required'
        if (!formData.totalBeds || formData.totalBeds <= 0) newErrors.totalBeds = 'Total beds is required'
        if (!formData.totalRooms || formData.totalRooms <= 0) newErrors.totalRooms = 'Total rooms is required'
        if (!formData.maxGuests || formData.maxGuests <= 0) newErrors.maxGuests = 'Maximum guests is required'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    const finalFormData = new FormData()
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        finalFormData.append(key, JSON.stringify(formData[key]))
      } else {
        finalFormData.append(key, formData[key])
      }
    })
    
    // Add images
    selectedImages.forEach((image, index) => {
      finalFormData.append('images', image)
    })
    
    createHostelMutation.mutate(finalFormData)
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Hostel Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Hotel />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
              multiline
              rows={4}
              placeholder="Describe your hostel, its atmosphere, and what makes it special..."
            />
            
            <FormControl fullWidth margin="normal" error={!!errors.type}>
              <InputLabel>Hostel Type</InputLabel>
              <Select
                value={formData.type}
                label="Hostel Type"
                onChange={handleInputChange('type')}
              >
                {hostelTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Box>
        )
        
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Street Address"
              value={formData.address}
              onChange={handleInputChange('address')}
              error={!!errors.address}
              helperText={errors.address}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  error={!!errors.city}
                  helperText={errors.city}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={formData.state}
                  onChange={handleInputChange('state')}
                  error={!!errors.state}
                  helperText={errors.state}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  error={!!errors.country}
                  helperText={errors.country}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange('postalCode')}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        )
        
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleInputChange('contactNumber')}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Website (Optional)"
              value={formData.website}
              onChange={handleInputChange('website')}
              margin="normal"
              placeholder="https://your-hostel-website.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )
        
      case 3:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Night (₹)"
                  value={formData.pricePerNight}
                  onChange={handleInputChange('pricePerNight')}
                  error={!!errors.pricePerNight}
                  helperText={errors.pricePerNight}
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Beds"
                  value={formData.totalBeds}
                  onChange={handleInputChange('totalBeds')}
                  error={!!errors.totalBeds}
                  helperText={errors.totalBeds}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Rooms"
                  value={formData.totalRooms}
                  onChange={handleInputChange('totalRooms')}
                  error={!!errors.totalRooms}
                  helperText={errors.totalRooms}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Guests"
                  value={formData.maxGuests}
                  onChange={handleInputChange('maxGuests')}
                  error={!!errors.maxGuests}
                  helperText={errors.maxGuests}
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>
        )
        
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Amenities
            </Typography>
            <Grid container spacing={2}>
              {amenitiesList.map((amenity) => (
                <Grid item xs={12} sm={6} md={4} key={amenity.key}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.amenities.includes(amenity.key) ? '2px solid #667eea' : '1px solid #e0e0e0',
                      backgroundColor: formData.amenities.includes(amenity.key) ? 'rgba(102, 126, 234, 0.1)' : 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      }
                    }}
                    onClick={() => handleAmenityToggle(amenity.key)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ color: formData.amenities.includes(amenity.key) ? '#667eea' : 'grey.600', mb: 1 }}>
                        {amenity.icon}
                      </Box>
                      <Typography variant="body2">
                        {amenity.label}
                      </Typography>
                      {formData.amenities.includes(amenity.key) && (
                        <CheckCircle sx={{ color: '#667eea', fontSize: 16, mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
        
      case 5:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check-in Time"
                  value={formData.checkInTime}
                  onChange={handleInputChange('checkInTime')}
                  margin="normal"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check-out Time"
                  value={formData.checkOutTime}
                  onChange={handleInputChange('checkOutTime')}
                  margin="normal"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Cancellation Policy</InputLabel>
              <Select
                value={formData.cancellationPolicy}
                label="Cancellation Policy"
                onChange={handleInputChange('cancellationPolicy')}
              >
                <MenuItem value="flexible">Flexible - Free cancellation up to 24 hours</MenuItem>
                <MenuItem value="moderate">Moderate - Free cancellation up to 5 days</MenuItem>
                <MenuItem value="strict">Strict - 50% refund up to 7 days</MenuItem>
                <MenuItem value="super_strict">Super Strict - No refund</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Property Policies
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.petFriendly}
                    onChange={handleInputChange('petFriendly')}
                  />
                }
                label="Pet Friendly"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.smokingAllowed}
                    onChange={handleInputChange('smokingAllowed')}
                  />
                }
                label="Smoking Allowed"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.alcoholAllowed}
                    onChange={handleInputChange('alcoholAllowed')}
                  />
                }
                label="Alcohol Allowed"
              />
            </Box>
            
            <TextField
              fullWidth
              label="House Rules"
              value={formData.houseRules}
              onChange={handleInputChange('houseRules')}
              margin="normal"
              multiline
              rows={4}
              placeholder="List important house rules and guidelines..."
            />
          </Box>
        )
        
      case 6:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Hostel Photos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add high-quality photos to showcase your hostel. First image will be the cover photo.
            </Typography>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="hostel-images-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="hostel-images-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{ mb: 3 }}
              >
                Upload Photos
              </Button>
            </label>
            
            {imagePreview.length > 0 && (
              <Grid container spacing={2}>
                {imagePreview.map((preview, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={preview.url}
                        alt={`Hostel image ${index + 1}`}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" noWrap>
                            {preview.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        {index === 0 && (
                          <Chip
                            label="Cover Photo"
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )
        
      default:
        return null
    }
  }

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
            Create New Hostel
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
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minWidth: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 },
          ml: { xs: 0, md: 0 },
          position: 'relative',
          overflow: 'auto'
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Success/Error Messages */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {/* Main Form */}
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography variant="h6" fontWeight="bold">
                      {label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ py: 2 }}>
                      {renderStepContent(index)}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      {index > 0 && (
                        <Button
                          onClick={handleBack}
                          variant="outlined"
                        >
                          Back
                        </Button>
                      )}
                      
                      {index < steps.length - 1 ? (
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          variant="contained"
                          disabled={createHostelMutation.isPending}
                          startIcon={createHostelMutation.isPending ? <CircularProgress size={20} /> : null}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 4
                          }}
                        >
                          {createHostelMutation.isPending ? 'Creating...' : 'Create Hostel'}
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Box>
      </Box>

      {/* Profile Drawer - Same as Dashboard */}
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

export default CreateHostel
