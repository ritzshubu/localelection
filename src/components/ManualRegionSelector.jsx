import { useState } from 'react'
import './ManualRegionSelector.css'

function ManualRegionSelector({ onSelect, onCancel }) {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [customLat, setCustomLat] = useState('')
  const [customLng, setCustomLng] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  // Common regions with approximate coordinates
  const regions = [
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose, CA', lat: 37.3382, lng: -121.8863 }
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
        Please select your region manually since location access was denied.
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
              placeholder="e.g., 40.7128"
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
              placeholder="e.g., -74.0060"
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
