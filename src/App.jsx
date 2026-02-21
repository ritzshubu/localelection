import { NavLink, Outlet } from 'react-router-dom'
import AgeVerificationModal from './components/AgeVerificationModal.jsx'
import DisclaimerBanner from './components/DisclaimerBanner.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <DisclaimerBanner />
      <header className="app-header">
        <div className="brand">Local Election</div>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/vote" className="nav-link">
            Vote
          </NavLink>
          <NavLink to="/results" className="nav-link">
            Results
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>
      </header>

      <div className="app-body">
        <AgeVerificationModal />
        <Outlet />
      </div>
    </div>
  )
}

export default App
