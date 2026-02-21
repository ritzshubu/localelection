import { useNavigate } from 'react-router-dom'
import { useGeolocation } from '../hooks/useGeolocation'
import { useRegion } from '../context/RegionContext'
import ManualRegionSelector from '../components/ManualRegionSelector'
import RegionSelector from '../components/RegionSelector'

function Home() {
  const navigate = useNavigate()
  const { region } = useRegion()
  const {
    latitude,
    longitude,
    loading,
    error,
    showManualSelection,
    setManualLocation,
    clearManualLocation
  } = useGeolocation()

  return (
    <main className="page">
      <h1>Local Election</h1>
      <p className="subtitle">A minimal starter layout with React Router.</p>

      <div style={{ marginTop: '3rem' }}>
        <RegionSelector />
        {region.state && region.district && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/vote')}
            >
              Go to Voting Page
            </button>
          </div>
        )}
      </div>

      <div className="geolocation-demo" style={{ marginTop: '2rem' }}>
        <h2>Location Information</h2>
        
        {loading && <p>Loading location...</p>}
        
        {error && !showManualSelection && (
          <div>
            <p style={{ color: '#dc2626' }}>Error: {error}</p>
          </div>
        )}

        {latitude !== null && longitude !== null && (
          <div className="location-display">
            <p><strong>Latitude:</strong> {latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {longitude.toFixed(6)}</p>
            <button onClick={clearManualLocation} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Clear Location
            </button>
          </div>
        )}

        {showManualSelection && (
          <div style={{ marginTop: '2rem' }}>
            <ManualRegionSelector
              onSelect={setManualLocation}
              onCancel={null}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default Home
