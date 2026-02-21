// Device fingerprinting service for preventing multiple votes per device
// Note: This is a basic client-side implementation. For production, use a proper backend solution.

export function getDeviceFingerprint() {
  try {
    // Create a fingerprint from various browser/device characteristics
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasHash: canvas.toDataURL().substring(0, 50), // Simplified
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0
    }

    // Create a simple hash from the fingerprint
    const fingerprintString = JSON.stringify(fingerprint)
    let hash = 0
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36)
  } catch (error) {
    console.error('Failed to generate device fingerprint:', error)
    // Fallback to a simple identifier
    return `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

export function getStoredDeviceId() {
  try {
    return localStorage.getItem('deviceId') || null
  } catch {
    return null
  }
}

export function storeDeviceId(deviceId) {
  try {
    localStorage.setItem('deviceId', deviceId)
    return true
  } catch {
    return false
  }
}

export function getOrCreateDeviceId() {
  let deviceId = getStoredDeviceId()
  if (!deviceId) {
    deviceId = getDeviceFingerprint()
    storeDeviceId(deviceId)
  }
  return deviceId
}
