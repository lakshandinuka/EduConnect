import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * About page has been merged into Home (per requirements).
 * Keeping this route for backward compatibility.
 */
export default function AboutPage() {
  return <Navigate to="/home#about" replace />;
}
