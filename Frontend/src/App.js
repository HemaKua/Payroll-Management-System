import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
