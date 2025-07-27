import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './components/Home'
import Registration from './components/Registration'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateHostel from './components/CreateHostel'
import MyHostels from './components/MyHostels'
import TestRoute from './components/TestRoute'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
          <Navigate to="/dashboard" replace /> : 
          <Home />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? 
          <Navigate to="/dashboard" replace /> : 
          <Registration />
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/dashboard" replace /> : 
          <Login />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? 
          <Dashboard /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/my-hostels" 
        element={
          isAuthenticated ? 
          <MyHostels /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/create-hostel" 
        element={
          isAuthenticated ? 
          <CreateHostel /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route path="/test" element={<TestRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
