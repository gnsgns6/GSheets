import React, { useCallback } from 'react';

function Spreadsheet({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;

  const getCellId = (row, col) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  };

  const handleCellClick = useCallback((cellId) => {
    setActiveCell(cellId);
  }, [setActiveCell]);

  const renderCell = (row, col) => {
    const cellId = getCellId(row, col);
    const isActive = cellId === activeCell;
    
    return (
      <td 
        key={cellId}
        className={`cell ${isActive ? 'active' : ''}`}
        onClick={() => handleCellClick(cellId)}
        contentEditable
        suppressContentEditableWarning
      >
        {spreadsheetData[cellId] || ''}
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