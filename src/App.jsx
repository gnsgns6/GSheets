import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Spreadsheet from './components/Spreadsheet';
import MenuBar from './components/MenuBar';
import SheetTabs from './components/SheetTabs';
import CollaborationPanel from './components/CollaborationPanel';
import './App.css';

function App() {
  const [activeCell, setActiveCell] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState({});
  const [activeSheet, setActiveSheet] = useState('Sheet1');
  const [showCollaboration, setShowCollaboration] = useState(false);

  return (
    <div className="app">
      <MenuBar />
      <Toolbar />
      <FormulaBar 
        activeCell={activeCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
      <Spreadsheet 
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={setSpreadsheetData}
      />
      <SheetTabs 
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
      />
      <CollaborationPanel 
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </div>
  );
}

export default App;
