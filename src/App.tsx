import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { initializeUsers } from './utils/authUtils';
import { initializePortfolios } from './utils/portfolioUtils';

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Initialize demo data
    initializeUsers();
    initializePortfolios();
    
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };
  
  return (
    <div className="app">
      {user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;