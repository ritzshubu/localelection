// Vote storage service using localStorage
// Note: In production, votes should be stored on a secure backend

const VOTE_STORAGE_KEY = 'userVote'
const ALL_VOTES_STORAGE_KEY = 'allVotes'
const DEVICE_VOTES_STORAGE_KEY = 'deviceVotes'

export function saveVote(candidateId, candidateName, state, district, deviceId) {
  const vote = {
    candidateId,
    candidateName,
    state,
    district,
    deviceId,
    timestamp: new Date().toISOString()
  }
  
  try {
    // Save user's vote
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(vote))
    
    // Save to all votes collection (for results)
    const allVotes = getAllVotes()
    allVotes.push(vote)
    localStorage.setItem(ALL_VOTES_STORAGE_KEY, JSON.stringify(allVotes))
    
    // Track device votes
    const deviceVotes = getDeviceVotes()
    if (!deviceVotes.includes(deviceId)) {
      deviceVotes.push(deviceId)
      localStorage.setItem(DEVICE_VOTES_STORAGE_KEY, JSON.stringify(deviceVotes))
    }
    
    return true
  } catch (error) {
    console.error('Failed to save vote:', error)
    return false
  }
}

export function getVote() {
  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to retrieve vote:', error)
  }
  return null
}

export function hasVoted() {
  return getVote() !== null
}

export function clearVote() {
  try {
    localStorage.removeItem(VOTE_STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear vote:', error)
    return false
  }
}

// Get all votes (for results calculation)
export function getAllVotes() {
  try {
    const stored = localStorage.getItem(ALL_VOTES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to retrieve all votes:', error)
  }
  return []
}

// Get votes for a specific region
export function getVotesForRegion(state, district) {
  const allVotes = getAllVotes()
  return allVotes.filter(vote => vote.state === state && vote.district === district)
}

// Check if device has already voted
export function hasDeviceVoted(deviceId) {
  const deviceVotes = getDeviceVotes()
  return deviceVotes.includes(deviceId)
}

function getDeviceVotes() {
  try {
    const stored = localStorage.getItem(DEVICE_VOTES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to retrieve device votes:', error)
  }
  return []
}

// Clear all votes (for testing/reset purposes)
export function clearAllVotes() {
  try {
    localStorage.removeItem(VOTE_STORAGE_KEY)
    localStorage.removeItem(ALL_VOTES_STORAGE_KEY)
    localStorage.removeItem(DEVICE_VOTES_STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear all votes:', error)
    return false
  }
}
