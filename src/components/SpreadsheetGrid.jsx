import React, { useState, useCallback, useRef, useEffect } from 'react';
import '../styles/SpreadsheetGrid.css';

function SpreadsheetGrid({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [resizingCol, setResizingCol] = useState(null);
  const [resizingRow, setResizingRow] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [rowHeights, setRowHeights] = useState({});
  const gridRef = useRef(null);
  const startResizePos = useRef(null);
  const startResizeSize = useRef(null);

  // Handle cell selection
  const handleCellMouseDown = (row, col, e) => {
    const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
    setActiveCell(cellId);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
  };

  // Handle cell selection drag
  const handleCellMouseMove = useCallback((e) => {
    if (selectionStart && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate cell from position
      const col = Math.min(Math.max(Math.floor(x / 100), 0), COLS - 1);
      const row = Math.min(Math.max(Math.floor(y / 25), 0), ROWS - 1);
      
      setSelectionEnd({ row, col });
    }
  }, [selectionStart, COLS, ROWS]);

  // Handle resize operations
  const handleResizeMouseDown = (e, index, type) => {
    e.preventDefault();
    if (type === 'column') {
      setResizingCol(index);
      startResizePos.current = e.clientX;
      startResizeSize.current = columnWidths[index] || 100;
    } else {
      setResizingRow(index);
      startResizePos.current = e.clientY;
      startResizeSize.current = rowHeights[index] || 25;
    }
  };

  const handleResizeMouseMove = useCallback((e) => {
    if (resizingCol !== null) {
      const diff = e.clientX - startResizePos.current;
      const newWidth = Math.max(50, startResizeSize.current + diff);
      setColumnWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
    } else if (resizingRow !== null) {
      const diff = e.clientY - startResizePos.current;
      const newHeight = Math.max(20, startResizeSize.current + diff);
      setRowHeights(prev => ({ ...prev, [resizingRow]: newHeight }));
    }
  }, [resizingCol, resizingRow]);

  const handleResizeMouseUp = () => {
    setResizingCol(null);
    setResizingRow(null);
  };

  useEffect(() => {
    if (resizingCol !== null || resizingRow !== null) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleResizeMouseMove);
        window.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [resizingCol, resizingRow, handleResizeMouseMove]);

  // Render cell content
  const getCellContent = (cellId) => {
    const value = spreadsheetData[cellId];
    if (!value) return '';
    if (typeof value === 'string' && value.startsWith('=')) {
      // Formula evaluation would go here
      return value;
    }
    return value;
  };

  // Render column headers
  const renderColumnHeaders = () => (
    <tr className="header-row">
      <th className="corner-header"></th>
      {Array(COLS).fill().map((_, col) => (
        <th 
          key={col} 
          className="column-header"
          style={{ width: columnWidths[col] || 100 }}
        >
          {String.fromCharCode(65 + col)}
          <div 
            className="column-resize-handle"
            onMouseDown={(e) => handleResizeMouseDown(e, col, 'column')}
          />
        </th>
      ))}
    </tr>
  );

  // Render grid cells
  const renderCell = (row, col) => {
    const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
    const isActive = cellId === activeCell;
    const isSelected = selectionStart && selectionEnd && (
      row >= Math.min(selectionStart.row, selectionEnd.row) &&
      row <= Math.max(selectionStart.row, selectionEnd.row) &&
      col >= Math.min(selectionStart.col, selectionEnd.col) &&
      col <= Math.max(selectionStart.col, selectionEnd.col)
    );

    return (
      <td
        key={`${row}-${col}`}
        className={`cell ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
        style={{ 
          width: columnWidths[col] || 100,
          height: rowHeights[row] || 25
        }}
        onClick={(e) => handleCellMouseDown(row, col, e)}
      >
        {getCellContent(cellId)}
      </td>
    );
  };

  return (
    <div 
      className="spreadsheet-grid"
      ref={gridRef}
      onMouseMove={handleCellMouseMove}
      onMouseUp={() => setSelectionStart(null)}
    >
      <table>
        <thead>
          {renderColumnHeaders()}
        </thead>
        <tbody>
          {Array(ROWS).fill().map((_, row) => (
            <tr key={row}>
              <th className="row-header">
                {row + 1}
                <div 
                  className="row-resize-handle"
                  onMouseDown={(e) => handleResizeMouseDown(e, row, 'row')}
                />
              </th>
              {Array(COLS).fill().map((_, col) => renderCell(row, col))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpreadsheetGrid; 