
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Serbia Public Investment Tracker. All rights reserved.</p>
        <p className="text-sm mt-1">Data sourced from public records of the Ministry of Finance.</p>
      </div>
    </footer>
  );
};

export default Footer;
