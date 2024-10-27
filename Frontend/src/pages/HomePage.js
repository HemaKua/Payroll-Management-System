import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Azikya software solution </h1>
      <div>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
      <br></br>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
