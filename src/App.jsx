import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Spreadsheet from './components/Spreadsheet';
import './App.css';

function App() {
  const [activeCell, setActiveCell] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState({});

  return (
    <div className="app">
      <Toolbar />
      <FormulaBar activeCell={activeCell} />
      <Spreadsheet 
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
    </div>
  );
}

export default App;
