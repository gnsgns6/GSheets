import React from 'react';

function CollaborationPanel({ isOpen, onClose }) {
  return (
    <div className={`collaboration-panel ${isOpen ? 'open' : ''}`}>
      <div className="user-avatars">
        <div className="avatar">JD</div>
        <div className="avatar">AS</div>
      </div>
      <div className="comments">
        {/* Add comment threads here */}
      </div>
    </div>
  );
}

export default CollaborationPanel; 