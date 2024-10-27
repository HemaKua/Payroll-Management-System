import React from 'react';
// import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ConfirmationPage from './pages/ConfirmationPage';
import HomePage from './pages/HomePage';
import BlankPage from './pages/BlankPage';
import NotFoundPage from './pages/NotFoundPage'; 

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/confirmation', element: <ConfirmationPage /> },
  {path: '/blank-page', element:<BlankPage/>},
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
