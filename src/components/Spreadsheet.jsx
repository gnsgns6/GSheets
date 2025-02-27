import React, { useCallback, useState } from 'react';
import { evaluateFormula } from '../utils/formulas';

function Spreadsheet({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [editingCell, setEditingCell] = useState(null);

  const getCellId = (row, col) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  };

  const handleCellClick = useCallback((cellId) => {
    setActiveCell(cellId);
    setEditingCell(cellId);
  }, [setActiveCell]);

  const handleCellBlur = (cellId, value) => {
    setEditingCell(null);
    if (value === spreadsheetData[cellId]) return;

    const newData = { ...spreadsheetData };
    newData[cellId] = value;
    setSpreadsheetData(newData);
  };

  const getCellContent = (cellId) => {
    const value = spreadsheetData[cellId];
    if (!value) return '';
    
    // If we're editing, show the raw formula
    if (editingCell === cellId) return value;
    
    // If it's a formula, evaluate it
    if (typeof value === 'string' && value.startsWith('=')) {
      return evaluateFormula(value, spreadsheetData);
    }
    
    return value;
  };

  const renderCell = (row, col) => {
    const cellId = getCellId(row, col);
    const isActive = cellId === activeCell;
    const content = getCellContent(cellId);
    
    return (
      <td 
        key={cellId}
        className={`cell ${isActive ? 'active' : ''}`}
        onClick={() => handleCellClick(cellId)}
        onBlur={(e) => handleCellBlur(cellId, e.target.textContent)}
        contentEditable
        suppressContentEditableWarning
      >
        {content}
      </td>
    );
  };

  return (
    <div className="spreadsheet">
      <table>
        <thead>
          <tr>
            <th></th>
            {Array(COLS).fill().map((_, i) => (
              <th key={i}>{String.fromCharCode(65 + i)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(ROWS).fill().map((_, row) => (
            <tr key={row}>
              <th>{row + 1}</th>
              {Array(COLS).fill().map((_, col) => renderCell(row, col))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Spreadsheet;