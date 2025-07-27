import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hostels: [],
  selectedHostel: null,
  rooms: [],
  students: [],
  loading: false,
  error: null,
}

const hostelSlice = createSlice({
  name: 'hostel',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setHostels: (state, action) => {
      state.hostels = action.payload
    },
    setSelectedHostel: (state, action) => {
      state.selectedHostel = action.payload
    },
    setRooms: (state, action) => {
      state.rooms = action.payload
    },
    setStudents: (state, action) => {
      state.students = action.payload
    },
    addStudent: (state, action) => {
      state.students.push(action.payload)
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setHostels,
  setSelectedHostel,
  setRooms,
  setStudents,
  addStudent,
  updateStudent,
  removeStudent,
  clearError,
} = hostelSlice.actions

export default hostelSlice.reducer
