import React from 'react';
import { Route, Navigate } from 'react-router-dom';

export default function PrivateRoute({ element: Element, ...rest }) {
  const token = localStorage.getItem('token');
  return token
    ? <Route {...rest} element={<Element />} />
    : <Route {...rest} element={<Navigate to="/login" replace />} />;
}
