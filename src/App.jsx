import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import SpreadsheetGrid from './components/SpreadsheetGrid';
import SheetTabs from './components/SheetTabs';
import AdvancedFeatures from './components/AdvancedFeatures';
import './App.css';

function App() {
  // State management
  const [activeCell, setActiveCell] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState({});
  const [sheets, setSheets] = useState([
    { name: 'Sheet1', data: {} },
    { name: 'Sheet2', data: {} },
  ]);
  const [activeSheet, setActiveSheet] = useState('Sheet1');

  // Sheet management functions
  const handleAddSheet = (name, data = {}) => {
    setSheets([...sheets, { name, data }]);
  };

  const handleDeleteSheet = (sheetName) => {
    if (sheets.length > 1) {
      const newSheets = sheets.filter(sheet => sheet.name !== sheetName);
      setSheets(newSheets);
      if (activeSheet === sheetName) {
        setActiveSheet(newSheets[0].name);
      }
    }
  };

  const handleRenameSheet = (oldName, newName) => {
    setSheets(sheets.map(sheet => 
      sheet.name === oldName ? { ...sheet, name: newName } : sheet
    ));
    if (activeSheet === oldName) {
      setActiveSheet(newName);
    }
  };

  return (
    <div className="app">
      <MenuBar />
      <Toolbar />
      <FormulaBar 
        activeCell={activeCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
      <SpreadsheetGrid
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
      <SheetTabs
        sheets={sheets}
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        onAddSheet={handleAddSheet}
        onDeleteSheet={handleDeleteSheet}
        onRenameSheet={handleRenameSheet}
      />
      <AdvancedFeatures 
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
    </div>
  );
}

export default App;
