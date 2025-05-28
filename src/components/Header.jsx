import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          Mental Health Nursing
        </div>
        <nav className="header-nav">
          <span className="header-link active">Dashboard</span>
          <span className="header-link">Progress</span>
          <span className="header-link">Resources</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;