import { useState, useEffect } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useRegion } from '../context/RegionContext'
import {
  getStateFromCoordinates,
  getDistrictsForState,
  getAllStates,
  getDistrictFromCoordinates
} from '../services/regionMapping'
import './RegionSelector.css'

function RegionSelector() {
  const { updateRegion } = useRegion()
  const { latitude, longitude, loading: geoLoading } = useGeolocation()
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [isAutoFilled, setIsAutoFilled] = useState(false)

  const allStates = getAllStates()

  // Auto-fill based on geolocation when available
  useEffect(() => {
    if (latitude && longitude && !geoLoading && !isAutoFilled) {
      const state = getStateFromCoordinates(latitude, longitude)
      if (state) {
        setSelectedState(state)
        const stateDistricts = getDistrictsForState(state)
        setDistricts(stateDistricts)
        
        // Try to determine district from coordinates
        const district = getDistrictFromCoordinates(latitude, longitude, state)
        if (district) {
          setSelectedDistrict(district)
        } else if (stateDistricts.length > 0) {
          // Fallback to first district if we can't determine
          setSelectedDistrict(stateDistricts[0])
        }
        
        setIsAutoFilled(true)
        
        // Update context
        updateRegion(state, district || stateDistricts[0] || '')
      }
    }
  }, [latitude, longitude, geoLoading, isAutoFilled, updateRegion])

  // Update districts when state changes
  useEffect(() => {
    if (selectedState) {
      const stateDistricts = getDistrictsForState(selectedState)
      setDistricts(stateDistricts)
      
      // Reset district if current selection is not valid for new state
      if (!stateDistricts.includes(selectedDistrict)) {
        setSelectedDistrict('')
      }
      
      // Update context
      if (selectedDistrict) {
        updateRegion(selectedState, selectedDistrict)
      }
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedState, updateRegion])

  // Update context when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      updateRegion(selectedState, selectedDistrict)
    }
  }, [selectedDistrict, selectedState, updateRegion])

  const handleStateChange = (e) => {
    const newState = e.target.value
    setSelectedState(newState)
    setIsAutoFilled(false) // Mark as manual override
  }

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value)
    setIsAutoFilled(false) // Mark as manual override
  }

  return (
    <div className="region-selector">
      <div className="region-selector-header">
        <h3>Select Your Region</h3>
        {isAutoFilled && (
          <span className="auto-fill-badge" title="Auto-filled from your location">
            Auto-filled
          </span>
        )}
      </div>

      {geoLoading && (
        <p className="loading-message">Detecting your location...</p>
      )}

      <div className="selector-fields">
        <div className="field-group">
          <label htmlFor="state-select">State</label>
          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            className="region-select"
            disabled={geoLoading}
          >
            <option value="">Select a state...</option>
            {allStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="district-select">District</label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="region-select"
            disabled={!selectedState || districts.length === 0}
          >
            <option value="">
              {!selectedState
                ? 'Select a state first'
                : districts.length === 0
                ? 'No districts available'
                : 'Select a district...'}
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedState && selectedDistrict && (
        <div className="selected-region">
          <p>
            <strong>Selected:</strong> {selectedDistrict}, {selectedState}
          </p>
        </div>
      )}
    </div>
  )
}

export default RegionSelector
