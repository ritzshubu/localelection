import { useState, useEffect } from 'react'
import './Captcha.css'

function Captcha({ onVerify, onReset }) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    generateQuestion()
  }, [])

  useEffect(() => {
    if (onReset) {
      const resetListener = () => {
        setIsVerified(false)
        setAnswer('')
        setError('')
        generateQuestion()
      }
      // Store reset function for parent to call
      if (typeof onReset === 'function') {
        window.captchaReset = resetListener
      }
    }
  }, [onReset])

  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 10) + 1
    const n2 = Math.floor(Math.random() * 10) + 1
    setNum1(n1)
    setNum2(n2)
    setAnswer('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userAnswer = parseInt(answer, 10)
    const correctAnswer = num1 + num2

    if (userAnswer === correctAnswer) {
      setIsVerified(true)
      setError('')
      if (onVerify) {
        onVerify(true)
      }
    } else {
      setError('Incorrect answer. Please try again.')
      setAnswer('')
      generateQuestion()
      if (onVerify) {
        onVerify(false)
      }
    }
  }

  if (isVerified) {
    return (
      <div className="captcha-container verified">
        <div className="captcha-success">
          <span className="success-icon">✓</span>
          <span>Verified</span>
        </div>
      </div>
    )
  }

  return (
    <div className="captcha-container">
      <div className="captcha-header">
        <span className="captcha-label">Security Verification</span>
      </div>
      <form onSubmit={handleSubmit} className="captcha-form">
        <div className="captcha-question">
          <span className="captcha-numbers">{num1}</span>
          <span className="captcha-operator">+</span>
          <span className="captcha-numbers">{num2}</span>
          <span className="captcha-equals">=</span>
          <input
            type="number"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setError('')
            }}
            className="captcha-input"
            placeholder="?"
            required
            autoComplete="off"
          />
        </div>
        {error && <div className="captcha-error">{error}</div>}
        <button type="submit" className="captcha-submit">
          Verify
        </button>
      </form>
      <button
        type="button"
        onClick={generateQuestion}
        className="captcha-refresh"
        title="Get new question"
      >
        ↻ New Question
      </button>
    </div>
  )
}

export default Captcha
