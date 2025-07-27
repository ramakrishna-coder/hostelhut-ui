import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import hostelSlice from './slices/hostelSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    hostel: hostelSlice,
  },
})

export default store
