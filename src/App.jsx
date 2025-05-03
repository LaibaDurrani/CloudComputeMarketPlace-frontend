import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import MyListings from './pages/myListings';
import AddComputer from './pages/addComputer';
import MyRentals from './pages/rentals';
import Profile from './pages/profile';
import ComputerDetails from './pages/computerDetails';
import Checkout from './pages/checkout';  
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import { DashboardModeProvider } from './context/DashboardModeContext';
import SellerDashboard from './pages/sellerDashboard';
import Settings from './pages/settings';
import RentalHistory from './pages/rentalHistory';
import { ThemeProvider } from './context/ThemeContext';
import PricingPage from './pages/pricingPage';

function App() {
  return (
    <ThemeProvider>
      <DashboardModeProvider>
        <Router>
          <SidebarProvider>
            <div className="app">
              <Sidebar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mylistings" element={<MyListings />} />
                  <Route path="/rentals" element={<MyRentals />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/computer/:id" element={<ComputerDetails />} />
                  <Route path="/checkout" element={<Checkout />} /> {/* Add this route */}
                  <Route path="/add-computer" element={<AddComputer />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/rental-history" element={<RentalHistory />} />
                  <Route path="/pricing" element={<PricingPage />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </Router>
      </DashboardModeProvider>
    </ThemeProvider>
  );
}

export default App;