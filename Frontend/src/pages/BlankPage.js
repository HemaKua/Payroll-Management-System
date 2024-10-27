import React from 'react';

const BlankPage = () => {
  const handleInvitation = () => {
    alert('Invitation sent!');
  };

  return (
    <div>
      <h2>Welcome to the blank page!</h2>
      <p>This is where you can add your user-invitation button.</p>
      <button onClick={handleInvitation}>Send Invitation</button>
    </div>
  );
};

export default BlankPage;
