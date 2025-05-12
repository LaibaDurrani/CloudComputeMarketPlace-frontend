import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

/**
 * A container component for page content that handles closing the sidebar when clicked
 * This provides consistent behavior across all pages
 */
const PageContainer = ({ children, className = '' }) => {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const handleContentClick = (e) => {
    // Only close if sidebar is open
    if (isSidebarOpen) {
      closeSidebar();
    }
  };

  return (
    <div 
      className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''} ${className}`}
      onClick={handleContentClick}
      aria-hidden={isSidebarOpen ? "true" : "false"}
    >
      {children}
    </div>
  );
};

export default PageContainer;
