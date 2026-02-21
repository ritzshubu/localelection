import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RegionProvider } from './context/RegionContext'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Under18 from './pages/Under18.jsx'
import VotingPage from './pages/VotingPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RegionProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="vote" element={<VotingPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
          <Route path="/under-18" element={<Under18 />} />
        </Routes>
      </RegionProvider>
    </BrowserRouter>
  </StrictMode>,
)
