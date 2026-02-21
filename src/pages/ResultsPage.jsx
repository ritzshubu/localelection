import { useNavigate } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'
import Results from '../components/Results'
import './ResultsPage.css'

function ResultsPage() {
  const navigate = useNavigate()
  const { region } = useRegion()

  return (
    <main className="page">
      <div className="results-page">
        {!region.state || !region.district ? (
          <div className="no-region">
            <p>Please select a region to view results.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <Results />
            <div className="results-page-footer">
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/vote')}>
                Cast Vote
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default ResultsPage
