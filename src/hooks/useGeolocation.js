import { useState, useEffect } from 'react'

const GEOLOCATION_STORAGE_KEY = 'manualLocation'

export function useGeolocation() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showManualSelection, setShowManualSelection] = useState(false)

  useEffect(() => {
    // Check if manual location was previously set
    const storedLocation = localStorage.getItem(GEOLOCATION_STORAGE_KEY)
    if (storedLocation) {
      try {
        const { lat, lng } = JSON.parse(storedLocation)
        setLatitude(lat)
        setLongitude(lng)
        setLoading(false)
        return
      } catch (err) {
        // Invalid stored data, continue with geolocation
        localStorage.removeItem(GEOLOCATION_STORAGE_KEY)
      }
    }

    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      setShowManualSelection(true)
      return
    }

    // Request geolocation
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLoading(false)
        setError(null)
        // Clear manual location if geolocation succeeds
        localStorage.removeItem(GEOLOCATION_STORAGE_KEY)
      },
      (err) => {
        setLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission denied')
          setShowManualSelection(true)
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Location information unavailable')
          setShowManualSelection(true)
        } else if (err.code === err.TIMEOUT) {
          setError('Location request timed out')
          setShowManualSelection(true)
        } else {
          setError('An unknown error occurred')
          setShowManualSelection(true)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [])

  const setManualLocation = (lat, lng) => {
    setLatitude(lat)
    setLongitude(lng)
    setError(null)
    setShowManualSelection(false)
    localStorage.setItem(GEOLOCATION_STORAGE_KEY, JSON.stringify({ lat, lng }))
  }

  const clearManualLocation = () => {
    setLatitude(null)
    setLongitude(null)
    localStorage.removeItem(GEOLOCATION_STORAGE_KEY)
    setShowManualSelection(true)
  }

  return {
    latitude,
    longitude,
    loading,
    error,
    showManualSelection,
    setManualLocation,
    clearManualLocation
  }
}
