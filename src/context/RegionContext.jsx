import { createContext, useContext, useState, useEffect } from 'react'

const RegionContext = createContext(null)

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('selectedRegion')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // ignore errors
    }
    return { state: '', district: '' }
  })

  // Save to localStorage whenever region changes
  useEffect(() => {
    if (region.state && region.district) {
      localStorage.setItem('selectedRegion', JSON.stringify(region))
    }
  }, [region])

  const updateRegion = (state, district) => {
    setRegion({ state, district })
  }

  return (
    <RegionContext.Provider value={{ region, updateRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion must be used within RegionProvider')
  }
  return context
}
