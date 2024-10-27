import React from 'react';

const Checkbox = ({ rememberMe, setRememberMe }) => {
  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="remember">
      <input
        id="rememberMe"
        type="checkbox"
        checked={rememberMe}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="rememberMe" style={{ marginLeft: "8px" }}>Remember Me</label>
    </div>
  );
};

export default Checkbox;