import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'ageVerified'

function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setIsOpen(true)
      }
    } catch {
      setIsOpen(true)
    }
  }, [])

  if (!isOpen) {
    return null
  }

  const handleYes = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore storage errors
    }
    setIsOpen(false)
  }

  const handleNo = () => {
    setIsOpen(false)
    navigate('/under-18', { replace: true })
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2 className="modal-title">Are you 18 years or older?</h2>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={handleYes}>
            Yes
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleNo}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgeVerificationModal

