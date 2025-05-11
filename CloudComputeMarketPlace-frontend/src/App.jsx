import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import MyListings from './pages/myListings';
import AddComputer from './pages/addComputer';
import MyRentals from './pages/rentals';
import Profile from './pages/profile';
import ComputerDetails from './pages/computerDetails';
import Checkout from './pages/checkout';  
import RentalConfirmation from './pages/rentalConfirmation';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import { DashboardModeProvider } from './context/DashboardModeContext';
import { NotificationsProvider } from './context/NotificationsContext';
import SellerDashboard from './pages/sellerDashboard';
import Settings from './pages/settings';
import RentalHistory from './pages/rentalHistory';
import { ThemeProvider } from './context/ThemeContext';
import PricingPage from './pages/pricingPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);
    return (
    <ThemeProvider>
      <DashboardModeProvider>
        <NotificationsProvider>
          <SidebarProvider>
            <div className="app">
              {/* Only show sidebar if user is logged in */}
              {currentUser && <Sidebar />}
              <div className="content">
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/computer/:id" element={<ComputerDetails />} />
                
                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mylistings" element={<MyListings />} />
                  <Route path="/rentals" element={<MyRentals />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/conversations" element={<Profile activeTab="conversations" />} />                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/rental-confirmation" element={<RentalConfirmation />} />                  <Route path="/add-computer" element={<AddComputer />} />
                  <Route path="/edit-computer/:id" element={<AddComputer />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/rental-history" element={<RentalHistory />} />
                </Route>
              </Routes>            </div>
          </div>
        </SidebarProvider>
        </NotificationsProvider>
      </DashboardModeProvider>
    </ThemeProvider>
  );
}

export default App;