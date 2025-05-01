import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../../components/Header';
import './styles.css';

const RentalHistory = () => {
  const { isSidebarOpen } = useSidebar();
  const [rentalHistory] = useState([
    {
      id: 1,
      computerName: 'Deep Learning Workstation',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      duration: '24 hours',
      totalCost: 204.00,
      status: 'Completed'
    },
    {
      id: 2,
      computerName: 'Gaming Rig Pro',
      startDate: '2024-01-10',
      endDate: '2024-01-11',
      duration: '12 hours',
      totalCost: 96.00,
      status: 'Completed'
    }
  ]);

  return (
    <div className={`rental-history-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="rental-history-content">
        <h1>Rental History</h1>
        
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Computer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Total Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentalHistory.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.computerName}</td>
                  <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                  <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                  <td>{rental.duration}</td>
                  <td>${rental.totalCost.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${rental.status.toLowerCase()}`}>
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalHistory;