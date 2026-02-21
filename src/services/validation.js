// Validation service for vote submission
// 
// ⚠️ IMPORTANT: This is a client-side implementation for demonstration purposes.
// In production, ALL validation and safeguards MUST be implemented on a secure backend:
//
// 1. IP-based rate limiting (server-side)
// 2. Device fingerprinting validation (server-side)
// 3. CAPTCHA verification (server-side, use services like reCAPTCHA)
// 4. Vote storage in secure database (not localStorage)
// 5. Vote integrity checks and audit logging
// 6. Protection against vote manipulation
// 7. Secure API endpoints with authentication
//
// Client-side safeguards can be bypassed and should only be used for UX.

export function validateVote(candidateId, candidateName, state, district, deviceId) {
  const errors = []

  // Validate candidate
  if (!candidateId || !candidateName) {
    errors.push('Invalid candidate selection')
  }

  // Validate region
  if (!state || !district) {
    errors.push('Region must be selected')
  }

  // Validate device ID
  if (!deviceId) {
    errors.push('Device identification failed')
  }

  // Additional validation
  if (typeof candidateId !== 'number' || candidateId < 1) {
    errors.push('Invalid candidate ID')
  }

  if (state.length < 2 || district.length < 1) {
    errors.push('Invalid region format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Rate limiting check (client-side, basic implementation)
// In production, this should be done on the backend with IP tracking
export function checkRateLimit(deviceId) {
  try {
    const rateLimitKey = `rateLimit_${deviceId}`
    const stored = localStorage.getItem(rateLimitKey)
    
    if (stored) {
      const { count, timestamp } = JSON.parse(stored)
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      
      // Reset if more than 1 hour has passed
      if (now - timestamp > oneHour) {
        localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, timestamp: now }))
        return { allowed: true, remaining: 4 }
      }
      
      // Allow max 5 votes per hour per device (for testing)
      if (count >= 5) {
        return { allowed: false, remaining: 0 }
      }
      
      const newCount = count + 1
      localStorage.setItem(rateLimitKey, JSON.stringify({ count: newCount, timestamp }))
      return { allowed: true, remaining: 5 - newCount }
    }
    
    // First vote
    localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, timestamp: Date.now() }))
    return { allowed: true, remaining: 4 }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Fail open for now, but log the error
    return { allowed: true, remaining: 0 }
  }
}
