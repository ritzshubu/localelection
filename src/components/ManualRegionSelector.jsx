import { useState } from 'react'
import './ManualRegionSelector.css'

function ManualRegionSelector({ onSelect, onCancel }) {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [customLat, setCustomLat] = useState('')
  const [customLng, setCustomLng] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  // Common Indian cities with approximate coordinates
  const regions = [
    { name: 'New Delhi, Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
    { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
    { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 },
    { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462 }
  ]

  const handleRegionSelect = (e) => {
    const regionName = e.target.value
    setSelectedRegion(regionName)
    if (regionName) {
      const region = regions.find(r => r.name === regionName)
      if (region) {
        onSelect(region.lat, region.lng)
      }
    }
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const lat = parseFloat(customLat)
    const lng = parseFloat(customLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numbers for latitude and longitude')
      return
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90')
      return
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180')
      return
    }

    onSelect(lat, lng)
  }

  return (
    <div className="manual-region-selector">
      <h3>Select Your Region</h3>
      <p className="selector-subtitle">
        Please select your region within India manually if location access is unavailable.
      </p>

      <div className="selector-tabs">
        <button
          className={`tab-button ${!useCustom ? 'active' : ''}`}
          onClick={() => setUseCustom(false)}
        >
          Choose from List
        </button>
        <button
          className={`tab-button ${useCustom ? 'active' : ''}`}
          onClick={() => setUseCustom(true)}
        >
          Enter Coordinates
        </button>
      </div>

      {!useCustom ? (
        <div className="region-list">
          <select
            value={selectedRegion}
            onChange={handleRegionSelect}
            className="region-select"
          >
            <option value="">Select a region...</option>
            {regions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} className="custom-coords-form">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              placeholder="e.g., 28.6139"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={customLng}
              onChange={(e) => setCustomLng(e.target.value)}
              placeholder="e.g., 77.2090"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Use Coordinates
          </button>
        </form>
      )}

      {onCancel && (
        <button onClick={onCancel} className="btn btn-secondary cancel-btn">
          Cancel
        </button>
      )}
    </div>
  )
}

export default ManualRegionSelector
