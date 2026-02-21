import { useState, useEffect } from 'react'
import { useRegion } from '../context/RegionContext'
import { getVotesForRegion } from '../services/voteStorage'
import { getCandidatesForRegion, getPartyAbbreviation } from '../services/candidates'
import './Results.css'

function Results() {
  const { region } = useRegion()
  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (region.state && region.district) {
      calculateResults()
    } else {
      setLoading(false)
    }
  }, [region])

  // Update results when votes change (polling + event listener)
  useEffect(() => {
    const interval = setInterval(() => {
      if (region.state && region.district) {
        calculateResults()
      }
    }, 2000) // Update every 2 seconds

    // Listen for vote submission events
    const handleVoteSubmitted = () => {
      if (region.state && region.district) {
        calculateResults()
      }
    }
    window.addEventListener('voteSubmitted', handleVoteSubmitted)

    return () => {
      clearInterval(interval)
      window.removeEventListener('voteSubmitted', handleVoteSubmitted)
    }
  }, [region])

  const calculateResults = () => {
    const candidates = getCandidatesForRegion(region.state, region.district)
    const votes = getVotesForRegion(region.state, region.district)
    
    const total = votes.length
    setTotalVotes(total)

    // Count votes per candidate
    const voteCounts = {}
    votes.forEach(vote => {
      voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1
    })

    // Create results array with percentages
    const resultsData = candidates.map(candidate => {
      const voteCount = voteCounts[candidate.id] || 0
      const percentage = total > 0 ? (voteCount / total) * 100 : 0

      return {
        ...candidate,
        voteCount,
        percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal
      }
    })

    // Sort by vote count (descending)
    resultsData.sort((a, b) => b.voteCount - a.voteCount)

    setResults(resultsData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="results-container">
        <p>Loading results...</p>
      </div>
    )
  }

  if (!region.state || !region.district) {
    return (
      <div className="results-container">
        <p>Please select a region to view results.</p>
      </div>
    )
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Election Results</h2>
        <div className="results-region">
          <p>
            <strong>Region:</strong> {region.district}, {region.state}
          </p>
          <p className="total-votes">
            <strong>Total Votes:</strong> {totalVotes}
          </p>
        </div>
      </div>

      {totalVotes === 0 ? (
        <div className="no-votes">
          <p>No votes have been cast yet in this region.</p>
        </div>
      ) : (
        <div className="results-list">
          {results.map((candidate, index) => (
            <div key={candidate.id} className="result-item">
              <div className="result-header">
                <div className="result-rank">
                  {index === 0 && totalVotes > 0 && (
                    <span className="winner-badge">🏆</span>
                  )}
                  <span className="rank-number">#{index + 1}</span>
                </div>
                <div className="result-candidate-info">
                  <h3 className="result-candidate-name">{candidate.name}</h3>
                  <div className="result-party">
                    <span
                      className="result-party-badge"
                      style={{ backgroundColor: candidate.partyColor }}
                    >
                      {getPartyAbbreviation(candidate.party)}
                    </span>
                    <span className="result-party-name">{candidate.party}</span>
                  </div>
                </div>
                <div className="result-stats">
                  <div className="result-votes">
                    <strong>{candidate.voteCount}</strong>
                    <span>votes</span>
                  </div>
                  <div className="result-percentage">
                    <strong>{candidate.percentage}%</strong>
                  </div>
                </div>
              </div>
              <div className="result-progress-container">
                <div
                  className="result-progress-bar"
                  style={{
                    width: `${candidate.percentage}%`,
                    backgroundColor: candidate.partyColor
                  }}
                >
                  <span className="result-progress-text">
                    {candidate.percentage > 5 ? `${candidate.percentage}%` : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Results
