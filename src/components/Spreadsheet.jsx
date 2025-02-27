import React, { useCallback, useState, useEffect, useRef } from 'react';
import { evaluateFormula } from '../utils/formulas';
import '../styles/FormulaDropdown.css';

const FORMULAS = [
  { name: 'SUM', description: 'Adds up the values in a range of cells' },
  { name: 'AVERAGE', description: 'Calculates the average of values in a range' },
  { name: 'MAX', description: 'Finds the maximum value in a range' },
  { name: 'MIN', description: 'Finds the minimum value in a range' },
  { name: 'COUNT', description: 'Counts the number of cells with numbers in a range' }
];

function Spreadsheet({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [editingCell, setEditingCell] = useState(null);
  const [showFormulaDropdown, setShowFormulaDropdown] = useState(false);
  const [formulaSearch, setFormulaSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState(0);
  const activeCellRef = useRef(null);

  const filteredFormulas = FORMULAS.filter(formula =>
    formula.name.toLowerCase().startsWith(formulaSearch.toLowerCase())
  );

  const getCellId = (row, col) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  };

  const handleCellClick = useCallback((cellId) => {
    setActiveCell(cellId);
    setEditingCell(cellId);
    setShowFormulaDropdown(false);
  }, [setActiveCell]);

  const handleCellBlur = (cellId, value) => {
    if (value === spreadsheetData[cellId]) return;

    const newData = { ...spreadsheetData };
    if (value.trim() === '') {
      delete newData[cellId];
    } else {
      newData[cellId] = value;
    }
    setSpreadsheetData(newData);
    setEditingCell(null);
  };

  const handleCellInput = (e, cellId) => {
    const content = e.target.textContent;
    if (content === '=') {
      const rect = e.target.getBoundingClientRect();
      setDropdownPosition({
        x: rect.left,
        y: rect.bottom
      });
      setShowFormulaDropdown(true);
      setFormulaSearch('');
      setSelectedFormulaIndex(0);
    } else if (content.startsWith('=')) {
      const searchTerm = content.substring(1);
      setFormulaSearch(searchTerm);
      setShowFormulaDropdown(true);
    } else {
      setShowFormulaDropdown(false);
    }
  };

  const insertFormula = (formulaName) => {
    if (editingCell && activeCellRef.current) {
      activeCellRef.current.textContent = `=${formulaName}()`;
      setShowFormulaDropdown(false);
      
      // Place cursor between parentheses
      const range = document.createRange();
      const sel = window.getSelection();
      const text = activeCellRef.current.childNodes[0];
      range.setStart(text, text.length - 1);
      range.setEnd(text, text.length - 1);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleKeyDown = (e, cellId) => {
    if (showFormulaDropdown) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedFormulaIndex(prev => 
            prev < filteredFormulas.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedFormulaIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredFormulas.length > 0) {
            insertFormula(filteredFormulas[selectedFormulaIndex].name);
          }
          break;
        case 'Escape':
          setShowFormulaDropdown(false);
          break;
        default:
          break;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const content = e.target.textContent;
      
      // Update the spreadsheet data
      const newData = { ...spreadsheetData };
      if (content.trim() === '') {
        delete newData[cellId];
      } else {
        newData[cellId] = content;
      }
      setSpreadsheetData(newData);

      // If it's a formula, immediately show the result
      if (content.startsWith('=')) {
        const result = evaluateFormula(content, newData);
        e.target.textContent = result;
      }

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
      // Show raw formula when editing
      return spreadsheetData[cellId] || '';
    }

    const value = spreadsheetData[cellId];
    if (!value) return '';

    // If it's a formula, evaluate it
    if (typeof value === 'string' && value.startsWith('=')) {
      const result = evaluateFormula(value, spreadsheetData);
      return result;
    }

    // Return regular value
    return value;
  };

  const renderFormulaDropdown = () => {
    if (!showFormulaDropdown) return null;

    return (
      <div 
        className="formula-dropdown"
        style={{
          left: dropdownPosition.x + 'px',
          top: dropdownPosition.y + 'px'
        }}
      >
        {filteredFormulas.length > 0 ? (
          filteredFormulas.map((formula, index) => (
            <div
              key={formula.name}
              className={`formula-item ${index === selectedFormulaIndex ? 'selected' : ''}`}
              onClick={() => insertFormula(formula.name)}
            >
              <span className="formula-name">{formula.name}</span>
              <span className="formula-description">{formula.description}</span>
            </div>
          ))
        ) : (
          <div className="no-results">No matching formulas</div>
        )}
      </div>
    );
  };

  const MemoizedCell = React.memo(({ 
    cellId, 
    isActive, 
    content, 
    onCellClick, 
    onCellBlur, 
    onCellInput, 
    onKeyDown, 
    cellRef 
  }) => (
    <td 
      className={`cell ${isActive ? 'active' : ''}`}
      onClick={() => onCellClick(cellId)}
      onBlur={(e) => onCellBlur(cellId, e.target.textContent)}
      onInput={(e) => onCellInput(e, cellId)}
      onKeyDown={(e) => onKeyDown(e, cellId)}
      ref={cellRef}
      contentEditable
      suppressContentEditableWarning
    >
      {content}
    </td>
  ));

  const renderCell = (row, col) => {
    const cellId = getCellId(row, col);
    const isActive = cellId === activeCell;
    const content = getCellContent(cellId);
    
    return (
      <MemoizedCell
        key={cellId}
        cellId={cellId}
        isActive={isActive}
        content={content}
        onCellClick={handleCellClick}
        onCellBlur={handleCellBlur}
        onCellInput={handleCellInput}
        onKeyDown={handleKeyDown}
        cellRef={isActive ? activeCellRef : null}
      />
    );
  };

  // Use virtualization for large spreadsheets
  const visibleRows = 50; // Number of rows to render at once
  const [startRow, setStartRow] = useState(0);

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const newStartRow = Math.floor(scrollTop / 24); // 24px is row height
    setStartRow(newStartRow);
  }, []);

  return (
    <div className="spreadsheet" onScroll={handleScroll}>
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
          {Array(visibleRows).fill().map((_, index) => {
            const row = startRow + index;
            if (row >= ROWS) return null;
            return (
              <tr key={row}>
                <th>{row + 1}</th>
                {Array(COLS).fill().map((_, col) => renderCell(row, col))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {renderFormulaDropdown()}
    </div>
  );
}

export default React.memo(Spreadsheet);