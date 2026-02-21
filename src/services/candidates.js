// Mock candidate data service

// Generate mock candidates for a given region
export function getCandidatesForRegion(state, district) {
  // Mock candidates - in production, this would come from an API
  const allCandidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      party: 'Democratic',
      partyColor: '#1e40af',
      bio: 'Experienced public servant with 15 years in local government.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      party: 'Republican',
      partyColor: '#dc2626',
      bio: 'Business leader and community advocate.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      party: 'Independent',
      partyColor: '#059669',
      bio: 'Education reform advocate and former teacher.'
    },
    {
      id: 4,
      name: 'David Thompson',
      party: 'Democratic',
      partyColor: '#1e40af',
      bio: 'Environmental policy expert and former city council member.'
    },
    {
      id: 5,
      name: 'James Wilson',
      party: 'Republican',
      partyColor: '#dc2626',
      bio: 'Veteran and small business owner.'
    }
  ]

  // Deterministically select 3-5 candidates based on region
  // Create a simple hash from state and district
  const hash = (state + district).split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  
  // Use hash to determine how many candidates (3-5)
  const count = 3 + (Math.abs(hash) % 3)
  
  // Return candidates deterministically based on hash
  return allCandidates.slice(0, count)
}

// Get party abbreviation
export function getPartyAbbreviation(party) {
  const abbreviations = {
    'Democratic': 'D',
    'Republican': 'R',
    'Independent': 'I',
    'Green': 'G',
    'Libertarian': 'L'
  }
  return abbreviations[party] || party.charAt(0)
}
