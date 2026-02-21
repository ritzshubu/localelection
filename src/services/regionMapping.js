// Mock mapping service for converting coordinates to state and district
// This is a simplified mock - in production, you'd use a proper geocoding API

// Indian States and Union Territories with their approximate center coordinates
const STATE_COORDINATES = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Bihar': { lat: 25.0961, lng: 85.3131 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Manipur': { lat: 24.6637, lng: 93.9063 },
  'Meghalaya': { lat: 25.4670, lng: 91.3662 },
  'Mizoram': { lat: 23.1645, lng: 92.9376 },
  'Nagaland': { lat: 26.1584, lng: 94.5624 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Sikkim': { lat: 27.5330, lng: 88.5122 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Telangana': { lat: 18.1124, lng: 79.0193 },
  'Tripura': { lat: 23.9408, lng: 91.9882 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Jammu and Kashmir': { lat: 33.7782, lng: 76.5762 },
  'Ladakh': { lat: 34.1526, lng: 77.5770 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Puducherry': { lat: 11.9416, lng: 79.8083 }
}

// Mock constituencies per state/UT (highly simplified)
const DISTRICTS_BY_STATE = {
  'Andhra Pradesh': Array.from({ length: 25 }, (_, i) => `Constituency ${i + 1}`),
  'Arunachal Pradesh': Array.from({ length: 4 }, (_, i) => `Constituency ${i + 1}`),
  'Assam': Array.from({ length: 14 }, (_, i) => `Constituency ${i + 1}`),
  'Bihar': Array.from({ length: 24 }, (_, i) => `Constituency ${i + 1}`),
  'Chhattisgarh': Array.from({ length: 11 }, (_, i) => `Constituency ${i + 1}`),
  'Goa': Array.from({ length: 2 }, (_, i) => `Constituency ${i + 1}`),
  'Gujarat': Array.from({ length: 26 }, (_, i) => `Constituency ${i + 1}`),
  'Haryana': Array.from({ length: 10 }, (_, i) => `Constituency ${i + 1}`),
  'Himachal Pradesh': Array.from({ length: 4 }, (_, i) => `Constituency ${i + 1}`),
  'Jharkhand': Array.from({ length: 14 }, (_, i) => `Constituency ${i + 1}`),
  'Karnataka': Array.from({ length: 28 }, (_, i) => `Constituency ${i + 1}`),
  'Kerala': Array.from({ length: 20 }, (_, i) => `Constituency ${i + 1}`),
  'Madhya Pradesh': Array.from({ length: 29 }, (_, i) => `Constituency ${i + 1}`),
  'Maharashtra': Array.from({ length: 48 }, (_, i) => `Constituency ${i + 1}`),
  'Manipur': Array.from({ length: 2 }, (_, i) => `Constituency ${i + 1}`),
  'Meghalaya': Array.from({ length: 2 }, (_, i) => `Constituency ${i + 1}`),
  'Mizoram': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`),
  'Nagaland': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`),
  'Odisha': Array.from({ length: 21 }, (_, i) => `Constituency ${i + 1}`),
  'Punjab': Array.from({ length: 13 }, (_, i) => `Constituency ${i + 1}`),
  'Rajasthan': Array.from({ length: 25 }, (_, i) => `Constituency ${i + 1}`),
  'Sikkim': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`),
  'Tamil Nadu': Array.from({ length: 39 }, (_, i) => `Constituency ${i + 1}`),
  'Telangana': Array.from({ length: 17 }, (_, i) => `Constituency ${i + 1}`),
  'Tripura': Array.from({ length: 2 }, (_, i) => `Constituency ${i + 1}`),
  'Uttar Pradesh': Array.from({ length: 80 }, (_, i) => `Constituency ${i + 1}`),
  'Uttarakhand': Array.from({ length: 5 }, (_, i) => `Constituency ${i + 1}`),
  'West Bengal': Array.from({ length: 42 }, (_, i) => `Constituency ${i + 1}`),
  'Delhi': Array.from({ length: 7 }, (_, i) => `Constituency ${i + 1}`),
  'Jammu and Kashmir': Array.from({ length: 5 }, (_, i) => `Constituency ${i + 1}`),
  'Ladakh': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`),
  'Chandigarh': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`),
  'Puducherry': Array.from({ length: 1 }, (_, i) => `Constituency ${i + 1}`)
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find the closest state based on coordinates
export function getStateFromCoordinates(latitude, longitude) {
  if (!latitude || !longitude) return null

  let closestState = null
  let minDistance = Infinity

  for (const [state, coords] of Object.entries(STATE_COORDINATES)) {
    const distance = calculateDistance(latitude, longitude, coords.lat, coords.lng)
    if (distance < minDistance) {
      minDistance = distance
      closestState = state
    }
  }

  return closestState
}

// Get districts for a given state
export function getDistrictsForState(state) {
  if (!state) return []
  return DISTRICTS_BY_STATE[state] || []
}

// Get all available states
export function getAllStates() {
  return Object.keys(STATE_COORDINATES).sort()
}

// Mock function to determine district from coordinates within a state
// In production, this would use a proper geocoding API
export function getDistrictFromCoordinates(latitude, longitude, state) {
  if (!latitude || !longitude || !state) return null
  
  const districts = getDistrictsForState(state)
  if (districts.length === 0) return null
  
  // Simple mock: use a hash of coordinates to deterministically assign a district
  // This ensures the same coordinates always return the same district
  const hash = Math.abs(Math.sin(latitude * longitude * 1000))
  const index = Math.floor(hash * districts.length)
  return districts[index]
}
