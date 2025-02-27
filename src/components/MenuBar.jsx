import React from 'react';

function MenuBar() {
  return (
    <div className="menu-bar">
      <div className="sheet-title">Untitled spreadsheet</div>
      <div className="menu-items">
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Insert</div>
        <div className="menu-item">Format</div>
        <div className="menu-item">Data</div>
        <div className="menu-item">Tools</div>
        <div className="menu-item">Help</div>
      </div>
    </div>
  );
}

export default MenuBar; 