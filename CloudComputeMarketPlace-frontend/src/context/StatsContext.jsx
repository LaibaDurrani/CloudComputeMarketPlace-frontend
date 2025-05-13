import React, { createContext, useContext, useState } from 'react';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [statsVersion, setStatsVersion] = useState(1);

  // Call this function whenever stats should be refreshed
  const refreshStats = () => {
    setStatsVersion(prevVersion => prevVersion + 1);
  };

  return (
    <StatsContext.Provider value={{ statsVersion, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
