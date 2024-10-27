import React from 'react';

const FormLayout = ({ children }) => {
  return (
    <section className="login_screen py-lg-0 py-md-4 py-4">
      <div className="container">
        <div className="form_card">
          <div className="row g-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormLayout;
