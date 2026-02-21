import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'
import { getCandidatesForRegion, getPartyAbbreviation } from '../services/candidates'
import { saveVote, getVote, hasDeviceVoted } from '../services/voteStorage'
import { getOrCreateDeviceId } from '../services/deviceFingerprint'
import { validateVote, checkRateLimit } from '../services/validation'
import Captcha from '../components/Captcha'
import './VotingPage.css'

function VotingPage() {
  const { region } = useRegion()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hasVotedState, setHasVotedState] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [deviceId, setDeviceId] = useState(null)
  const [safeguardErrors, setSafeguardErrors] = useState([])

  useEffect(() => {
    // Get device ID
    const id = getOrCreateDeviceId()
    setDeviceId(id)

    // Check if device has already voted
    if (hasDeviceVoted(id)) {
      const vote = getVote()
      if (vote) {
        setHasVotedState(true)
        setSelectedCandidate({
          id: vote.candidateId,
          name: vote.candidateName
        })
        setShowSuccess(true)
      }
    }

    // Load candidates for the region
    if (region.state && region.district) {
      const regionCandidates = getCandidatesForRegion(region.state, region.district)
      setCandidates(regionCandidates)
      setLoading(false)
    } else {
      // If no region selected, redirect to home
      navigate('/', { replace: true })
    }
  }, [region, navigate])

  const handleCaptchaVerify = (verified) => {
    setCaptchaVerified(verified)
    if (!verified) {
      setSafeguardErrors(['Please complete the CAPTCHA verification'])
    } else {
      setSafeguardErrors([])
    }
  }

  const handleVote = (candidate) => {
    if (hasVotedState) {
      return // Prevent voting if already voted
    }

    // Check safeguards
    const errors = []

    // Check CAPTCHA
    if (!captchaVerified) {
      errors.push('Please complete the CAPTCHA verification before voting')
    }

    // Check device ID
    if (!deviceId) {
      errors.push('Device identification failed. Please refresh the page.')
    }

    // Check if device has already voted
    if (deviceId && hasDeviceVoted(deviceId)) {
      errors.push('This device has already cast a vote')
      setHasVotedState(true)
    }

    // Rate limiting check
    if (deviceId) {
      const rateLimit = checkRateLimit(deviceId)
      if (!rateLimit.allowed) {
        errors.push('Rate limit exceeded. Please try again later.')
      }
    }

    // Validate vote data
    if (deviceId) {
      const validation = validateVote(
        candidate.id,
        candidate.name,
        region.state,
        region.district,
        deviceId
      )
      if (!validation.isValid) {
        errors.push(...validation.errors)
      }
    }

    if (errors.length > 0) {
      setSafeguardErrors(errors)
      return
    }

    // All checks passed, save vote
    const success = saveVote(
      candidate.id,
      candidate.name,
      region.state,
      region.district,
      deviceId
    )

    if (success) {
      setSelectedCandidate(candidate)
      setHasVotedState(true)
      setShowSuccess(true)
      setSafeguardErrors([])
      // Trigger results update (in a real app, this would be a backend call)
      window.dispatchEvent(new Event('voteSubmitted'))
    } else {
      setSafeguardErrors(['Failed to save your vote. Please try again.'])
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="loading-container">
          <p>Loading candidates...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="voting-page">
        <div className="voting-header">
          <h1>Cast Your Vote</h1>
          {region.state && region.district && (
            <div className="region-info">
              <p>
                <strong>Region:</strong> {region.district}, {region.state}
              </p>
            </div>
          )}
        </div>

        {showSuccess && (
          <div className="success-message" role="alert">
            <div className="success-icon">✓</div>
            <div>
              <h3>Thank you for voting!</h3>
              <p>
                Your vote for <strong>{selectedCandidate?.name}</strong> has been recorded.
              </p>
            </div>
          </div>
        )}

        {!hasVotedState && (
          <div className="safeguards-section">
            <h3>Security Verification</h3>
            <Captcha onVerify={handleCaptchaVerify} />
            {safeguardErrors.length > 0 && (
              <div className="safeguard-errors">
                {safeguardErrors.map((error, index) => (
                  <p key={index} className="error-message">
                    ⚠️ {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="candidates-section">
          <h2>Candidates</h2>
          <p className="candidates-subtitle">
            {hasVotedState
              ? 'You have already cast your vote.'
              : 'Select a candidate to vote for:'}
          </p>

          <div className="candidates-list">
            {candidates.map((candidate) => {
              const isSelected = selectedCandidate?.id === candidate.id
              const isDisabled = hasVotedState

              return (
                <div
                  key={candidate.id}
                  className={`candidate-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                >
                  <div className="candidate-header">
                    <div className="candidate-info">
                      <h3 className="candidate-name">{candidate.name}</h3>
                      <div className="candidate-party">
                        <span
                          className="party-badge"
                          style={{ backgroundColor: candidate.partyColor }}
                        >
                          {getPartyAbbreviation(candidate.party)}
                        </span>
                        <span className="party-name">{candidate.party}</span>
                      </div>
                    </div>
                  </div>
                  <p className="candidate-bio">{candidate.bio}</p>
                  <button
                    className={`vote-button ${isSelected ? 'voted' : ''}`}
                    onClick={() => handleVote(candidate)}
                    disabled={isDisabled || !captchaVerified}
                  >
                    {isSelected ? '✓ Voted' : captchaVerified ? 'Vote' : 'Complete CAPTCHA'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="voting-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  )
}

export default VotingPage
