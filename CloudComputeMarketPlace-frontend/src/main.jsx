import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'
import { DashboardModeProvider } from './context/DashboardModeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <DashboardModeProvider>
              <App />
            </DashboardModeProvider>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
