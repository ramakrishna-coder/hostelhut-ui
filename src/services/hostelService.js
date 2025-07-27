// In-memory storage for hostels (temporary until backend APIs are implemented)
let hostelsStorage = [
  {
    id: '1',
    name: 'Downtown Backpacker Hostel',
    description: 'A vibrant hostel located in the heart of the city, perfect for budget travelers looking for a social atmosphere.',
    type: 'Dormitory',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '400001',
    pricePerNight: 800,
    totalBeds: 24,
    rating: 4.2,
    reviewCount: 156,
    images: ['/placeholder-hostel.jpg'],
    amenities: ['Free WiFi', 'AC', 'Laundry', 'Kitchen'],
    contactInfo: {
      phone: '+91 9876543210',
      email: 'info@downtownhostel.com',
      website: 'www.downtownhostel.com'
    },
    policies: {
      checkIn: '14:00',
      checkOut: '11:00',
      cancellation: 'Free cancellation up to 24 hours before check-in'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Seaside Retreat Hostel',
    description: 'Relax by the beach at our cozy hostel with stunning ocean views and a laid-back atmosphere.',
    type: 'Mixed Dorm',
    address: '456 Beach Road',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    pinCode: '403001',
    pricePerNight: 1200,
    totalBeds: 18,
    rating: 4.5,
    reviewCount: 89,
    images: ['/placeholder-hostel.jpg'],
    amenities: ['Free WiFi', 'Beach Access', 'Bar', 'Breakfast'],
    contactInfo: {
      phone: '+91 9876543211',
      email: 'hello@seasideretreat.com',
      website: 'www.seasideretreat.com'
    },
    policies: {
      checkIn: '15:00',
      checkOut: '10:00',
      cancellation: 'Free cancellation up to 48 hours before check-in'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Mountain View Lodge',
    description: 'Experience the tranquility of the mountains with breathtaking views and outdoor activities.',
    type: 'Private Room',
    address: '789 Hill Station Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    pinCode: '175131',
    pricePerNight: 1500,
    totalBeds: 12,
    rating: 4.7,
    reviewCount: 234,
    images: ['/placeholder-hostel.jpg'],
    amenities: ['Free WiFi', 'Heating', 'Mountain View', 'Trekking Guide'],
    contactInfo: {
      phone: '+91 9876543212',
      email: 'stay@mountainviewlodge.com',
      website: 'www.mountainviewlodge.com'
    },
    policies: {
      checkIn: '13:00',
      checkOut: '12:00',
      cancellation: 'Free cancellation up to 72 hours before check-in'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Helper function to convert image files to base64 URLs for display
const processImages = async (images) => {
  if (!images || !Array.isArray(images)) return []
  
  const processedImages = []
  for (const image of images) {
    if (image instanceof File) {
      // Convert file to base64 URL for display
      const reader = new FileReader()
      const base64 = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(image)
      })
      processedImages.push(base64)
    } else if (typeof image === 'string') {
      processedImages.push(image)
    }
  }
  return processedImages
}

export const hostelService = {
  createHostel: async (hostelData) => {
    await delay() // Simulate API delay
    
    const images = await processImages(hostelData.get?.('images') || hostelData.images || [])
    
    const newHostel = {
      id: generateId(),
      name: hostelData.get?.('name') || hostelData.name,
      description: hostelData.get?.('description') || hostelData.description,
      type: hostelData.get?.('type') || hostelData.type,
      address: hostelData.get?.('address') || hostelData.address,
      city: hostelData.get?.('city') || hostelData.city,
      state: hostelData.get?.('state') || hostelData.state,
      country: hostelData.get?.('country') || hostelData.country,
      pinCode: hostelData.get?.('pinCode') || hostelData.pinCode,
      pricePerNight: parseInt(hostelData.get?.('pricePerNight') || hostelData.pricePerNight),
      totalBeds: parseInt(hostelData.get?.('totalBeds') || hostelData.totalBeds),
      images: images,
      amenities: JSON.parse(hostelData.get?.('amenities') || hostelData.amenities || '[]'),
      contactInfo: JSON.parse(hostelData.get?.('contactInfo') || hostelData.contactInfo || '{}'),
      policies: JSON.parse(hostelData.get?.('policies') || hostelData.policies || '{}'),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    hostelsStorage.push(newHostel)
    return { success: true, data: newHostel }
  },

  getHostels: async () => {
    await delay() // Simulate API delay
    return hostelsStorage
  },

  getHostelById: async (id) => {
    await delay() // Simulate API delay
    const hostel = hostelsStorage.find(h => h.id === id)
    if (!hostel) {
      throw new Error('Hostel not found')
    }
    return hostel
  },

  updateHostel: async (id, hostelData) => {
    await delay() // Simulate API delay
    
    const hostelIndex = hostelsStorage.findIndex(h => h.id === id)
    if (hostelIndex === -1) {
      throw new Error('Hostel not found')
    }
    
    const images = await processImages(hostelData.get?.('images') || hostelData.images || [])
    
    const updatedHostel = {
      ...hostelsStorage[hostelIndex],
      name: hostelData.get?.('name') || hostelData.name,
      description: hostelData.get?.('description') || hostelData.description,
      type: hostelData.get?.('type') || hostelData.type,
      address: hostelData.get?.('address') || hostelData.address,
      city: hostelData.get?.('city') || hostelData.city,
      state: hostelData.get?.('state') || hostelData.state,
      country: hostelData.get?.('country') || hostelData.country,
      pinCode: hostelData.get?.('pinCode') || hostelData.pinCode,
      pricePerNight: parseInt(hostelData.get?.('pricePerNight') || hostelData.pricePerNight),
      totalBeds: parseInt(hostelData.get?.('totalBeds') || hostelData.totalBeds),
      images: images.length > 0 ? images : hostelsStorage[hostelIndex].images,
      amenities: JSON.parse(hostelData.get?.('amenities') || hostelData.amenities || JSON.stringify(hostelsStorage[hostelIndex].amenities)),
      contactInfo: JSON.parse(hostelData.get?.('contactInfo') || hostelData.contactInfo || JSON.stringify(hostelsStorage[hostelIndex].contactInfo)),
      policies: JSON.parse(hostelData.get?.('policies') || hostelData.policies || JSON.stringify(hostelsStorage[hostelIndex].policies)),
      updatedAt: new Date().toISOString()
    }
    
    hostelsStorage[hostelIndex] = updatedHostel
    return { success: true, data: updatedHostel }
  },

  deleteHostel: async (id) => {
    await delay() // Simulate API delay
    
    const hostelIndex = hostelsStorage.findIndex(h => h.id === id)
    if (hostelIndex === -1) {
      throw new Error('Hostel not found')
    }
    
    hostelsStorage.splice(hostelIndex, 1)
    return { success: true, message: 'Hostel deleted successfully' }
  },

  uploadHostelImages: async (hostelId, images) => {
    await delay() // Simulate API delay
    
    const hostelIndex = hostelsStorage.findIndex(h => h.id === hostelId)
    if (hostelIndex === -1) {
      throw new Error('Hostel not found')
    }
    
    const processedImages = await processImages(images)
    hostelsStorage[hostelIndex].images = [...hostelsStorage[hostelIndex].images, ...processedImages]
    hostelsStorage[hostelIndex].updatedAt = new Date().toISOString()
    
    return { success: true, images: processedImages }
  }
}
