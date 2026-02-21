// Mock candidate data service (India-focused)

// Generate mock candidates for a given region
export function getCandidatesForRegion(state, district) {
  // Mock candidates - in production, this would come from an API
  const allCandidates = [
    {
      id: 1,
      name: 'Amit Sharma',
      party: 'Bharatiya Janata Party',
      partyColor: '#ff8f00',
      bio: 'Grassroots leader focused on infrastructure and development.'
    },
    {
      id: 2,
      name: 'Priya Nair',
      party: 'Indian National Congress',
      partyColor: '#1e40af',
      bio: 'Lawyer and social worker advocating for inclusive growth.'
    },
    {
      id: 3,
      name: 'Ravi Kumar',
      party: 'Aam Aadmi Party',
      partyColor: '#16a34a',
      bio: 'Anti-corruption activist with a focus on local governance.'
    },
    {
      id: 4,
      name: 'Farah Siddiqui',
      party: 'All India Trinamool Congress',
      partyColor: '#0ea5e9',
      bio: 'Education and health champion with years of field work.'
    },
    {
      id: 5,
      name: 'Sanjay Verma',
      party: 'Independent',
      partyColor: '#64748b',
      bio: 'Local entrepreneur representing non-partisan citizens voice.'
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
    'Bharatiya Janata Party': 'BJP',
    'Indian National Congress': 'INC',
    'Aam Aadmi Party': 'AAP',
    'All India Trinamool Congress': 'TMC',
    'Bahujan Samaj Party': 'BSP',
    'Independent': 'IND'
  }
  return abbreviations[party] || party.charAt(0)
}
