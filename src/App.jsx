import React, { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar';
import './App.css';

// Initial sheet structure
const initialSheets = [
  { id: 'sheet1', name: 'Sheet1', data: {} },
  { id: 'sheet2', name: 'Sheet2', data: {} }
];

function App() {
  // Load data from localStorage or use initial state
  const loadInitialState = () => {
    const savedState = localStorage.getItem('spreadsheetState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Error loading saved state:', e);
        return initialSheets;
      }
    }
    return initialSheets;
  };

  // State management
  const [activeCell, setActiveCell] = useState(null);
  const [sheets, setSheets] = useState(loadInitialState);
  const [activeSheet, setActiveSheet] = useState(sheets[0].id);
  const [spreadsheetData, setSpreadsheetData] = useState(sheets[0].data || {});
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spreadsheetState', JSON.stringify(sheets));
  }, [sheets]);

  // Update spreadsheet data when switching sheets
  useEffect(() => {
    const currentSheet = sheets.find(sheet => sheet.id === activeSheet);
    if (currentSheet) {
      setSpreadsheetData(currentSheet.data || {});
    }
  }, [activeSheet, sheets]);

  // Handle spreadsheet data changes
  const handleDataChange = (newData) => {
    // Save current state to undo stack
    setUndoStack(prev => [...prev, spreadsheetData]);
    setRedoStack([]); // Clear redo stack on new change

    // Update current sheet's data
    setSpreadsheetData(newData);
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheet 
        ? { ...sheet, data: newData }
        : sheet
    ));
  };

  // Undo/Redo functions
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, spreadsheetData]);
      setSpreadsheetData(previousState);
      setUndoStack(prev => prev.slice(0, -1));
      
      setSheets(prev => prev.map(sheet => 
        sheet.id === activeSheet 
          ? { ...sheet, data: previousState }
          : sheet
      ));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, spreadsheetData]);
      setSpreadsheetData(nextState);
      setRedoStack(prev => prev.slice(0, -1));
      
      setSheets(prev => prev.map(sheet => 
        sheet.id === activeSheet 
          ? { ...sheet, data: nextState }
          : sheet
      ));
    }
  };

  // Sheet management functions
  const handleAddSheet = () => {
    const newSheetId = `sheet${sheets.length + 1}`;
    const newSheet = {
      id: newSheetId,
      name: `Sheet${sheets.length + 1}`,
      data: {}
    };
    setSheets(prev => [...prev, newSheet]);
    setActiveSheet(newSheetId);
  };

  const handleDeleteSheet = (sheetId) => {
    if (sheets.length > 1) {
      const newSheets = sheets.filter(sheet => sheet.id !== sheetId);
      setSheets(newSheets);
      if (activeSheet === sheetId) {
        setActiveSheet(newSheets[0].id);
      }
    }
  };

  const handleRenameSheet = (sheetId, newName) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? { ...sheet, name: newName }
        : sheet
    ));
  };

  // Export spreadsheet data
  const handleExport = () => {
    const exportData = {
      sheets,
      activeSheet,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import spreadsheet data
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.sheets && importedData.activeSheet) {
            setSheets(importedData.sheets);
            setActiveSheet(importedData.activeSheet);
          }
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="app">
      <MenuBar 
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onExport={handleExport}
        onImport={handleImport}
      />
      <SpreadsheetGrid
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        spreadsheetData={spreadsheetData}
        setSpreadsheetData={handleDataChange}
      />
      <SheetTabs
        sheets={sheets}
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        onAddSheet={handleAddSheet}
        onDeleteSheet={handleDeleteSheet}
        onRenameSheet={handleRenameSheet}
      />
    </div>
  );
}

export default App;
