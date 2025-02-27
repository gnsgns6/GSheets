import React, { useState } from 'react';
import '../styles/MenuBar.css';

function MenuBar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    file: ['New', 'Open', 'Save', 'Download', 'Export PDF', 'Print'],
    edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find and Replace'],
    view: ['Freeze Rows', 'Freeze Columns', 'Gridlines', 'Formula Bar', 'Show Ruler'],
    insert: ['Row Above', 'Row Below', 'Column Left', 'Column Right', 'Chart', 'Image'],
    format: ['Number Format', 'Text Format', 'Alignment', 'Borders', 'Cell Style'],
    data: ['Sort Range', 'Filter', 'Group', 'Pivot Table', 'Data Validation'],
    tools: ['Spelling', 'Protect Sheet', 'Macros', 'Script Editor'],
    help: ['Documentation', 'Keyboard Shortcuts', 'About']
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (item) => {
    console.log(`Clicked: ${item}`);
    setActiveMenu(null);
  };

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <div className="sheet-title">
          <input 
            type="text" 
            defaultValue="Untitled spreadsheet" 
            className="title-input"
          />
        </div>
        <div className="menu-items">
          {Object.keys(menuItems).map((menu) => (
            <div 
              key={menu} 
              className={`menu-item ${activeMenu === menu ? 'active' : ''}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
              {activeMenu === menu && (
                <div className="menu-dropdown">
                  {menuItems[menu].map((item) => (
                    <div 
                      key={item}
                      className="menu-dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuItemClick(item);
                      }}
                    >
                      {item}
                    </div>
                  ))}
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
    </div>
  );
}

export default MenuBar; 