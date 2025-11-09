
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkStyle = {
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          🇷🇸 PIM-PAM Serbia
        </NavLink>
        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors pb-1"
            style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/map"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors pb-1"
            style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          >
            Map View
          </NavLink>
          <NavLink
            to="/mapper"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors pb-1"
            style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          >
            Mapper
          </NavLink>
          <NavLink
            to="/about"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors pb-1"
            style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;