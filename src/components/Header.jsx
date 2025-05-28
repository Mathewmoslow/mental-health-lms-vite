import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          Mental Health Nursing
        </div>
        <nav className="header-nav">
          <Link to="/dashboard" className="header-link active">Dashboard</Link>
          <Link to="/progress" className="header-link">Progress</Link>
          <Link to="/resources" className="header-link">Resources</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;