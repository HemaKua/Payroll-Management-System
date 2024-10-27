import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {
  return (
    <div>
      <h2>Registration Successful!</h2>
      <p>Your registration was successful. You can now log in.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default ConfirmationPage;
