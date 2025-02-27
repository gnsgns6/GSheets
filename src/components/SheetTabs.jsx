import React from 'react';

function SheetTabs({ activeSheet, setActiveSheet }) {
  const sheets = ['Sheet1', 'Sheet2', 'Sheet3'];

  return (
    <div className="sheet-tabs">
      {sheets.map(sheet => (
        <div 
          key={sheet}
          className={`sheet-tab ${activeSheet === sheet ? 'active' : ''}`}
          onClick={() => setActiveSheet(sheet)}
        >
          {sheet}
        </div>
      ))}
      <div className="add-sheet">
        <i className="material-icons">add</i>
      </div>
    </div>
  );
}

export default SheetTabs; 