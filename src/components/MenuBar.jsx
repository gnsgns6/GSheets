import React, { useRef } from 'react';
import '../styles/MenuBar.css';

function MenuBar({ onUndo, onRedo, canUndo, canRedo, onExport, onImport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="menu-bar">
      <div className="menu-item">
        <span>File</span>
        <div className="menu-dropdown">
          <button onClick={handleImportClick}>Import</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImport}
            accept=".json"
            style={{ display: 'none' }}
          />
          <button onClick={onExport}>Export</button>
        </div>
      </div>

      <div className="menu-item">
        <span>Edit</span>
        <div className="menu-dropdown">
          <button onClick={onUndo} disabled={!canUndo}>
            Undo
            <span className="shortcut">⌘Z</span>
          </button>
          <button onClick={onRedo} disabled={!canRedo}>
            Redo
            <span className="shortcut">⌘⇧Z</span>
          </button>
        </div>
      </div>

      <div className="menu-item">
        <span>View</span>
        <div className="menu-dropdown">
          <button>Zoom In</button>
          <button>Zoom Out</button>
          <button>100%</button>
        </div>
      </div>

      <div className="menu-item">
        <span>Format</span>
        <div className="menu-dropdown">
          <button>Number Format</button>
          <button>Text Format</button>
          <button>Alignment</button>
        </div>
      </div>
    </div>
  );
}

export default MenuBar; 