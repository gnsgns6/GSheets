import React, { useState } from 'react';
import '../styles/SheetTabs.css';

function SheetTabs({ activeSheet, setActiveSheet, sheets, onAddSheet, onDeleteSheet, onRenameSheet }) {
  const [editingSheet, setEditingSheet] = useState(null);
  const [newSheetName, setNewSheetName] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(null);

  const handleAddSheet = () => {
    const sheetNumber = sheets.length + 1;
    const newSheetName = `Sheet${sheetNumber}`;
    onAddSheet(newSheetName);
  };

  const handleRenameStart = (sheetName) => {
    setEditingSheet(sheetName);
    setNewSheetName(sheetName);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (newSheetName.trim() && newSheetName !== editingSheet) {
      onRenameSheet(editingSheet, newSheetName.trim());
    }
    setEditingSheet(null);
  };

  const handleContextMenu = (e, sheetName) => {
    e.preventDefault();
    setShowContextMenu({
      sheet: sheetName,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleSheetAction = (action, sheet) => {
    switch (action) {
      case 'rename':
        handleRenameStart(sheet);
        break;
      case 'delete':
        onDeleteSheet(sheet);
        break;
      case 'duplicate':
        const newName = `${sheet} (Copy)`;
        onAddSheet(newName, sheets.find(s => s.name === sheet)?.data);
        break;
      case 'hide':
        // Implement hide sheet functionality
        break;
      default:
        break;
    }
    setShowContextMenu(null);
  };

  return (
    <div className="sheet-tabs">
      <div className="tabs-container">
        {sheets.map(sheet => (
          <div
            key={sheet.name}
            className={`sheet-tab ${activeSheet === sheet.name ? 'active' : ''}`}
            onClick={() => setActiveSheet(sheet.name)}
            onContextMenu={(e) => handleContextMenu(e, sheet.name)}
          >
            {editingSheet === sheet.name ? (
              <form onSubmit={handleRenameSubmit}>
                <input
                  type="text"
                  value={newSheetName}
                  onChange={(e) => setNewSheetName(e.target.value)}
                  onBlur={handleRenameSubmit}
                  autoFocus
                />
              </form>
            ) : (
              <>
                <span className="sheet-name">{sheet.name}</span>
                <button 
                  className="sheet-options"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, sheet.name);
                  }}
                >
                  <i className="material-icons">more_horiz</i>
                </button>
              </>
            )}
          </div>
        ))}
        <button className="add-sheet" onClick={handleAddSheet}>
          <i className="material-icons">add</i>
        </button>
      </div>

      {showContextMenu && (
        <>
          <div 
            className="context-menu-overlay" 
            onClick={() => setShowContextMenu(null)}
          />
          <div 
            className="context-menu"
            style={{
              left: showContextMenu.x,
              top: showContextMenu.y
            }}
          >
            <div onClick={() => handleSheetAction('rename', showContextMenu.sheet)}>
              <i className="material-icons">edit</i>
              Rename
            </div>
            <div onClick={() => handleSheetAction('duplicate', showContextMenu.sheet)}>
              <i className="material-icons">content_copy</i>
              Duplicate
            </div>
            <div onClick={() => handleSheetAction('delete', showContextMenu.sheet)}>
              <i className="material-icons">delete</i>
              Delete
            </div>
            <div onClick={() => handleSheetAction('hide', showContextMenu.sheet)}>
              <i className="material-icons">visibility_off</i>
              Hide sheet
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SheetTabs; 