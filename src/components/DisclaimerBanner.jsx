import './DisclaimerBanner.css'

function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner" role="alert">
      <div className="disclaimer-content">
        <span className="disclaimer-icon">⚠️</span>
        <p className="disclaimer-text">
          This is a virtual mock poll for engagement purposes only. Not an official election.
        </p>
      </div>
    </div>
  )
}

export default DisclaimerBanner
