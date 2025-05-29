import React from 'react';

const Header = ({ currentView = 'dashboard', onNavigate }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'progress', label: 'Progress' },
    { id: 'resources', label: 'Resources' }
  ];

  const handleNavClick = (viewId) => {
    if (onNavigate) {
      onNavigate(viewId);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          Mental Health Nursing
        </div>
        <nav className="header-nav">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`header-link ${currentView === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;