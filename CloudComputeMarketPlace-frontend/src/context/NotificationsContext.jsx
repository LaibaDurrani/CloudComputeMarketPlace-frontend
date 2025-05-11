import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUnreadMessageCount } from '../services/api';
import { AuthContext } from './AuthContext';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch unread messages when user logs in
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!currentUser) {
        setUnreadMessageCount(0);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await getUnreadMessageCount();
        if (response && response.data && response.data.data) {
          setUnreadMessageCount(response.data.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
        // Reset count if there's an error (likely due to authentication)
        setUnreadMessageCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnreadMessages();
    
    // Poll for new messages every minute, only if user is logged in
    let interval = null;
    if (currentUser) {
      interval = setInterval(fetchUnreadMessages, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentUser]);
  
  // Function to decrement unread count when messages are read
  const decrementUnreadCount = (count = 1) => {
    setUnreadMessageCount(prev => Math.max(0, prev - count));
  };
  
  // Function to increment unread count when new messages arrive
  const incrementUnreadCount = (count = 1) => {
    setUnreadMessageCount(prev => prev + count);
  };
    // Function to refresh the unread count
  const refreshUnreadCount = async () => {
    if (!currentUser) {
      setUnreadMessageCount(0);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await getUnreadMessageCount();
      if (response && response.data && response.data.data) {
        setUnreadMessageCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error refreshing unread messages count:', error);
      // Don't reset count on refresh error as we want to maintain state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        unreadMessageCount, 
        isLoading, 
        decrementUnreadCount, 
        incrementUnreadCount,
        refreshUnreadCount
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
