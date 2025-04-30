import React, { createContext, useContext, useState } from 'react';

const DashboardModeContext = createContext();

export const DashboardModeProvider = ({ children }) => {
  const [dashboardMode, setDashboardMode] = useState('buyer');

  return (
    <DashboardModeContext.Provider value={{ dashboardMode, setDashboardMode }}>
      {children}
    </DashboardModeContext.Provider>
  );
};

export const useDashboardMode = () => {
  const context = useContext(DashboardModeContext);
  if (!context) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
};