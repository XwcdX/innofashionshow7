'use client';

import React from 'react';
import './ManualLoader.css'; // We'll create some basic CSS

interface ManualLoaderProps {
  isLoading: boolean;
  message?: string;
}

const ManualLoader: React.FC<ManualLoaderProps> = ({ isLoading, message }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="manual-loader-overlay">
      <div className="manual-loader-content">
        <div className="manual-loader-spinner"></div>
        {message && <p className="manual-loader-message">{message}</p>}
        {!message && <p className="manual-loader-message">Loading...</p>}
      </div>
    </div>
  );
};

export default ManualLoader;