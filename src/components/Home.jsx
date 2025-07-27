import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Drawer,
  AppBar,
  Toolbar,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Home as HomeIcon,
  Email,
  Person,
  Hotel,
  Security,
  Group,
  CheckCircle,
  Close,
  Login,
  PersonAddAlt,
  LockOpen,
  Phone,
  Lock,
} from '@mui/icons-material'
import { authService } from '../services/authService'
import { loginSuccess } from '../store/slices/authSlice'

const Home = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    registrationType: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false)
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setSuccessMessage('Account created successfully! You can now sign in.')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        registrationType: '',
      })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      setErrors({ submit: errorMessage })
    },
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      navigate('/dashboard')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
      setErrors({ submit: errorMessage })
    },
  })

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be 10 digits'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.registrationType) {
      newErrors.registrationType = 'Registration type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    
    if (validateForm()) {
      registerMutation.mutate(formData)
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    
    // Basic validation for login
    if (!formData.email || !formData.password) {
      setErrors({ submit: 'Please fill in all fields.' })
      return
    }
    
    loginMutation.mutate({
      email: formData.email,
      password: formData.password
    })
  }

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRegisterDrawerOpen = () => {
    setIsRegisterDrawerOpen(true)
  }

  const handleRegisterDrawerClose = () => {
    setIsRegisterDrawerOpen(false)
    setErrors({})
    setSuccessMessage('')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      registrationType: '',
    })
  }

  const handleLoginDrawerOpen = () => {
    setIsLoginDrawerOpen(true)
  }

  const handleLoginDrawerClose = () => {
    setIsLoginDrawerOpen(false)
    setErrors({})
    setSuccessMessage('')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      registrationType: '',
    })
  }

  const features = [
    { icon: <Hotel />, title: 'Easy Hostel Management', desc: 'Manage your hostel bookings effortlessly' },
    { icon: <Security />, title: 'Secure & Safe', desc: 'Your data is protected with enterprise-grade security' },
    { icon: <Group />, title: 'Community Focused', desc: 'Connect with hostel owners and travelers' },
    { icon: <CheckCircle />, title: 'Verified Listings', desc: 'All hostels are verified for quality assurance' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button 
            color="inherit" 
            startIcon={<PersonAddAlt />}
            onClick={handleRegisterDrawerOpen}
            sx={{ mr: 2, color: 'white' }}
          >
            Register
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Login />}
            onClick={handleLoginDrawerOpen}
            sx={{ color: 'white' }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 0 }}>
        <Grid container sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Full Width - Welcome Content */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 'calc(100vh - 64px)',
                px: { xs: 4, md: 8 },
                color: 'white',
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Welcome to HostelHut
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 300,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  Your ultimate platform for hostel management and booking
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    opacity: 0.8,
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Whether you're a hostel owner looking to manage your property or a traveler 
                  seeking the perfect accommodation, HostelHut provides all the tools you need 
                  for a seamless experience.
                </Typography>
              </Box>

              {/* Features */}
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                  }}
                >
                  Why Choose HostelHut?
                </Typography>
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          p: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            p: 1.5,
                            mr: 2,
                            minWidth: 'auto',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', mb: 1 }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ opacity: 0.8 }}
                          >
                            {feature.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Registration Drawer */}
      <Drawer
        anchor="right"
        open={isRegisterDrawerOpen}
        onClose={handleRegisterDrawerClose}
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
              onClick={handleRegisterDrawerClose}
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
              mb: 3,
              mt: 2
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                p: 2,
                mb: 2,
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
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
              Join HostelHut
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
              }}
            >
              Create your account to get started
            </Typography>
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              {errors.submit}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              Account created successfully! You can now{' '}
              <Button
                variant="text"
                onClick={() => {
                  handleRegisterDrawerClose()
                  handleLoginDrawerOpen()
                }}
                sx={{
                  color: '#1976d2',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontSize: 'inherit',
                  lineHeight: 'inherit'
                }}
              >
                sign in
              </Button>
              .
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Re-enter Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.registrationType}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSelect-select': {
                  color: 'white',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <InputLabel>Registration Type</InputLabel>
              <Select
                value={formData.registrationType}
                label="Registration Type"
                onChange={handleChange('registrationType')}
                startAdornment={
                  <InputAdornment position="start">
                    <HomeIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="HOSTEL_OWNER">Hostel Owner</MenuItem>
                <MenuItem value="HOSTLER">Hosteler</MenuItem>
              </Select>
              {errors.registrationType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.registrationType}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={registerMutation.isPending}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {registerMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Create Account'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Already have an account?{' '}
                <Button
                  variant="text"
                  onClick={() => {
                    handleRegisterDrawerClose()
                    handleLoginDrawerOpen()
                  }}
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Login Drawer */}
      <Drawer
        anchor="right"
        open={isLoginDrawerOpen}
        onClose={handleLoginDrawerClose}
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
              onClick={handleLoginDrawerClose}
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
              mb: 3,
              mt: 2
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                p: 2,
                mb: 2,
              }}
            >
              <LockOpen sx={{ fontSize: 40, color: 'white' }} />
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
              }}
            >
              Sign in to your HostelHut account
            </Typography>
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLoginSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loginMutation.isPending}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {loginMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Login'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                New to HostelHut?{' '}
                <Button
                  variant="text"
                  onClick={() => {
                    handleLoginDrawerClose()
                    handleRegisterDrawerOpen()
                  }}
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                  }}
                >
                  Create an account
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Home
