import React, { useCallback, useState, useEffect } from 'react';
import { evaluateFormula } from '../utils/formulas';

function Spreadsheet({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [editingCell, setEditingCell] = useState(null);
  const [cellValues, setCellValues] = useState({});

  // Evaluate all formulas whenever spreadsheetData changes
  useEffect(() => {
    const newCellValues = {};
    Object.entries(spreadsheetData).forEach(([cellId, value]) => {
      if (typeof value === 'string' && value.startsWith('=')) {
        try {
          newCellValues[cellId] = evaluateFormula(value, spreadsheetData);
        } catch (error) {
          newCellValues[cellId] = '#ERROR!';
        }
      } else {
        newCellValues[cellId] = value;
      }
    });
    setCellValues(newCellValues);
  }, [spreadsheetData]);

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
    // Remove empty cells from the data
    if (value.trim() === '') {
      delete newData[cellId];
    } else {
      newData[cellId] = value;
    }
    setSpreadsheetData(newData);
  };

  const handleCellKeyDown = (e, cellId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellBlur(cellId, e.target.textContent);
      setEditingCell(null);
      // Move to the cell below
      const nextRow = parseInt(cellId.match(/\d+/)[0]);
      const col = cellId.match(/[A-Z]+/)[0];
      const nextCellId = `${col}${nextRow + 1}`;
      setActiveCell(nextCellId);
    }
  };

  const getCellContent = (cellId) => {
    if (editingCell === cellId) {
      return spreadsheetData[cellId] || '';
    }
    return cellValues[cellId] || '';
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
        onKeyDown={(e) => handleCellKeyDown(e, cellId)}
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