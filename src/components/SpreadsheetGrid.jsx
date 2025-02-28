import React, { useState, useCallback, useRef, useEffect } from 'react';
import '../styles/SpreadsheetGrid.css';

function SpreadsheetGrid({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [resizingCol, setResizingCol] = useState(null);
  const [resizingRow, setResizingRow] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [rowHeights, setRowHeights] = useState({});
  const gridRef = useRef(null);
  const startResizePos = useRef(null);
  const startResizeSize = useRef(null);
  const inputRef = useRef(null);

  // Formula functions
  const formulaFunctions = {
    // Mathematical Functions
    SUM: (range) => {
      const values = getCellRangeValues(range);
      return values.reduce((sum, val) => sum + (Number(val) || 0), 0);
    },
    AVERAGE: (range) => {
      const values = getCellRangeValues(range);
      const validValues = values.filter(val => !isNaN(Number(val)));
      return validValues.length ? validValues.reduce((sum, val) => sum + Number(val), 0) / validValues.length : 0;
    },
    COUNT: (range) => {
      const values = getCellRangeValues(range);
      return values.filter(val => val !== '' && !isNaN(Number(val))).length;
    },
    MAX: (range) => {
      const values = getCellRangeValues(range);
      const validValues = values.map(val => Number(val)).filter(val => !isNaN(val));
      return validValues.length ? Math.max(...validValues) : 0;
    },
    MIN: (range) => {
      const values = getCellRangeValues(range);
      const validValues = values.map(val => Number(val)).filter(val => !isNaN(val));
      return validValues.length ? Math.min(...validValues) : 0;
    },
    // Data Quality Functions
    TRIM: (cellRef) => {
      const value = getCellValue(cellRef);
      return typeof value === 'string' ? value.trim() : value;
    },
    UPPER: (cellRef) => {
      const value = getCellValue(cellRef);
      return typeof value === 'string' ? value.toUpperCase() : value;
    },
    LOWER: (cellRef) => {
      const value = getCellValue(cellRef);
      return typeof value === 'string' ? value.toLowerCase() : value;
    },
    REMOVE_DUPLICATES: (range) => {
      const values = getCellRangeValues(range);
      return [...new Set(values)].join(', ');
    },
    FIND_AND_REPLACE: (range, find, replace) => {
      const values = getCellRangeValues(range);
      return values.map(val => 
        typeof val === 'string' ? val.replace(new RegExp(find, 'g'), replace) : val
      ).join(', ');
    }
  };

  // Get values from a cell range (e.g., "A1:B3")
  const getCellRangeValues = useCallback((range) => {
    const [start, end] = range.trim().split(':');
    if (!end) return [getCellValue(start)];

    const startCol = start.match(/[A-Z]+/)[0];
    const startRow = parseInt(start.match(/\d+/)[0]);
    const endCol = end.match(/[A-Z]+/)[0];
    const endRow = parseInt(end.match(/\d+/)[0]);

    const values = [];
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol.charCodeAt(0), endCol.charCodeAt(0)); 
           col <= Math.max(startCol.charCodeAt(0), endCol.charCodeAt(0)); col++) {
        const cellId = `${String.fromCharCode(col)}${row}`;
        values.push(getCellValue(cellId));
      }
    }
    return values;
  }, [spreadsheetData]);

  // Get raw value from a cell
  const getCellValue = useCallback((cellId) => {
    const value = spreadsheetData[cellId];
    if (!value) return '';
    if (typeof value === 'string' && value.startsWith('=')) {
      try {
        return evaluateFormula(value.substring(1));
      } catch (error) {
        return '#ERROR!';
      }
    }
    return value;
  }, [spreadsheetData]);

  // Evaluate formula
  const evaluateFormula = useCallback((formula) => {
    try {
      // Handle function calls
      const functionMatch = formula.trim().match(/^([A-Z_]+)\((.*)\)$/);
      if (functionMatch) {
        const [, funcName, args] = functionMatch;
        if (formulaFunctions[funcName]) {
          const parsedArgs = args.split(',').map(arg => arg.trim());
          return formulaFunctions[funcName](...parsedArgs);
        }
      }

      // Handle cell references and basic arithmetic
      let evaluatedFormula = formula.replace(/[A-Z]+[0-9]+/g, (cellRef) => {
        const value = getCellValue(cellRef);
        return isNaN(value) ? `"${value}"` : value;
      });

      // Safely evaluate the arithmetic expression
      const result = Function(`"use strict"; return (${evaluatedFormula})`)();
      return isNaN(result) ? '#ERROR!' : result;
    } catch (error) {
      return '#ERROR!';
    }
  }, [spreadsheetData, formulaFunctions]);

  // Handle cell double click for editing
  const handleCellDoubleClick = useCallback((cellId) => {
    setIsEditing(true);
    setEditValue(spreadsheetData[cellId] || '');
  }, [spreadsheetData]);

  // Handle cell selection start
  const handleCellMouseDown = useCallback((row, col, e) => {
    if (e.button !== 0) return; // Only handle left click
    
    const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
    setActiveCell(cellId);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
    setIsSelecting(true);

    if (isEditing) {
      e.preventDefault();
      return;
    }
  }, [isEditing, setActiveCell]);

  // Handle cell value changes
  const handleCellChange = useCallback((cellId, value) => {
    setEditValue(value);
  }, []);

  // Handle cell key press
  const handleCellKeyDown = useCallback((e, cellId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitEdit(cellId);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit(cellId);
      const col = cellId.match(/[A-Z]+/)[0];
      const row = parseInt(cellId.match(/\d+/)[0]);
      const nextCellId = `${String.fromCharCode(col.charCodeAt(0) + (e.shiftKey ? -1 : 1))}${row}`;
      setActiveCell(nextCellId);
    }
  }, [setActiveCell]);

  // Commit the edit to spreadsheet data
  const commitEdit = useCallback((cellId) => {
    if (!isEditing) return;

    let finalValue = editValue;
    if (finalValue.startsWith('=')) {
      try {
        // Validate formula before committing
        evaluateFormula(finalValue.substring(1));
      } catch (error) {
        finalValue = '#ERROR!';
      }
    }

    setSpreadsheetData(prev => ({
      ...prev,
      [cellId]: finalValue
    }));
    setIsEditing(false);
    setEditValue('');
  }, [isEditing, editValue, setSpreadsheetData, evaluateFormula]);

  // Handle cell hover during selection
  const handleCellMouseEnter = useCallback((row, col) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ row, col });
    }
  }, [isSelecting, selectionStart]);

  // Handle mouse up to end selection
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Check if a cell is in the current selection
  const isInSelection = useCallback((row, col) => {
    if (!selectionStart || !selectionEnd) return false;
    
    const minRow = Math.min(selectionStart.row, selectionEnd.row);
    const maxRow = Math.max(selectionStart.row, selectionEnd.row);
    const minCol = Math.min(selectionStart.col, selectionEnd.col);
    const maxCol = Math.max(selectionStart.col, selectionEnd.col);
    
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  }, [selectionStart, selectionEnd]);

  // Get displayed cell value
  const getCellDisplayValue = useCallback((cellId) => {
    if (isEditing && cellId === activeCell) {
      return spreadsheetData[cellId] || '';
    }
    return getCellValue(cellId);
  }, [isEditing, activeCell, spreadsheetData, getCellValue]);

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
  const renderCell = useCallback((row, col) => {
    const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
    const isActive = cellId === activeCell;
    const isSelected = isInSelection(row, col);
    
    return (
      <td
        key={`${row}-${col}`}
        className={`cell ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
        style={{ 
          width: columnWidths[col] || 100,
          height: rowHeights[row] || 25
        }}
        onMouseDown={(e) => handleCellMouseDown(row, col, e)}
        onMouseEnter={() => handleCellMouseEnter(row, col)}
        onDoubleClick={() => handleCellDoubleClick(cellId)}
      >
        <div className="cell-content">
          {!isEditing || !isActive 
            ? (spreadsheetData[cellId]?.toString().startsWith('=') 
                ? evaluateFormula(spreadsheetData[cellId].substring(1)) 
                : spreadsheetData[cellId])
            : ''}
        </div>
        {isActive && (isEditing || spreadsheetData[cellId]?.toString().startsWith('=')) && (
          <input
            ref={inputRef}
            className="cell-input"
            value={isEditing ? editValue : (spreadsheetData[cellId] || '')}
            onChange={(e) => handleCellChange(cellId, e.target.value)}
            onKeyDown={(e) => handleCellKeyDown(e, cellId)}
            onBlur={() => commitEdit(cellId)}
          />
        )}
      </td>
    );
  }, [activeCell, spreadsheetData, isEditing, editValue, isInSelection, handleCellMouseDown, 
      handleCellMouseEnter, handleCellDoubleClick, handleCellChange, handleCellKeyDown, 
      commitEdit, evaluateFormula]);

  return (
    <div 
      className="spreadsheet-grid"
      ref={gridRef}
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