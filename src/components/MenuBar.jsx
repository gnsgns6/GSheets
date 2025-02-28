import React, { useState, useRef } from 'react';
import '../styles/MenuBar.css';

function MenuBar({ spreadsheetData, setSpreadsheetData }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = useRef(null);

  const saveSpreadsheet = () => {
    const data = {
      content: spreadsheetData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  const loadSpreadsheet = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setSpreadsheetData(data.content);
      } catch (error) {
        console.error('Error loading spreadsheet:', error);
        alert('Error loading spreadsheet. Please check the file format.');
      }
    };
    reader.readAsText(file);
    setActiveMenu(null);
  };

  const handleNewDocument = () => {
    if (window.confirm('Create new spreadsheet? Any unsaved changes will be lost.')) {
      setSpreadsheetData({});
    }
    setActiveMenu(null);
  };

  const menuItems = {
    file: [
      { label: 'New', icon: 'add', action: handleNewDocument },
      { label: 'Open...', icon: 'folder_open', action: () => fileInputRef.current.click() },
      { label: 'Save', icon: 'save', action: saveSpreadsheet },
      { type: 'separator' },
      { label: 'Download as', icon: 'download', submenu: [
        { label: 'JSON (.json)', action: saveSpreadsheet },
        { label: 'CSV (.csv)', action: () => {} }, // To be implemented
        { label: 'Excel (.xlsx)', action: () => {} }, // To be implemented
      ]},
      { type: 'separator' },
      { label: 'Print', icon: 'print', action: window.print },
    ],
    edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
    view: ['Freeze', 'Gridlines', 'Formula Bar'],
    insert: ['Row Above', 'Row Below', 'Column Left', 'Column Right'],
    format: ['Number', 'Text', 'Alignment', 'Borders'],
    data: ['Sort Range', 'Filter', 'Pivot Table'],
    tools: ['Spelling', 'Protect Sheet'],
    help: ['Documentation', 'Keyboard Shortcuts']
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const renderMenuItem = (item) => {
    if (item.type === 'separator') {
      return <div className="menu-separator" />;
    }

    const menuItem = typeof item === 'string' ? { label: item } : item;

    return (
      <div 
        key={menuItem.label}
        className="menu-item"
        onClick={(e) => {
          e.stopPropagation();
          if (menuItem.action) {
            menuItem.action();
          }
        }}
      >
        {menuItem.icon && <i className="material-icons">{menuItem.icon}</i>}
        <span>{menuItem.label}</span>
        {menuItem.submenu && <i className="material-icons submenu-arrow">arrow_right</i>}
        
        {menuItem.submenu && (
          <div className="submenu">
            {menuItem.submenu.map(subItem => renderMenuItem(subItem))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <div className="sheet-title">
          <input 
            type="text"
            className="title-input"
            placeholder="Untitled spreadsheet"
          />
        </div>
        <div className="menu-items">
          {Object.keys(menuItems).map(menu => (
            <div
              key={menu}
              className={`menu-trigger ${activeMenu === menu ? 'active' : ''}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
              {activeMenu === menu && (
                <div className="menu-dropdown">
                  {Array.isArray(menuItems[menu])
                    ? menuItems[menu].map(item => renderMenuItem(item))
                    : menuItems[menu].map(item => renderMenuItem(item))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="menu-bar-right">
        <button className="share-button">
          <i className="material-icons">share</i>
          Share
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={loadSpreadsheet}
      />
      {activeMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

export default MenuBar; 