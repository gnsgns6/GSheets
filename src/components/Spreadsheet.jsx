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

const MemoizedCell = React.memo(({ 
  cellId, 
  isActive, 
  content, 
  onCellClick, 
  onCellBlur, 
  onCellInput, 
  onKeyDown, 
  cellRef,
  style 
}) => {
  const [editValue, setEditValue] = useState(content);

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  return (
    <td 
      className={`cell ${isActive ? 'active' : ''}`}
      onClick={() => onCellClick(cellId)}
      style={style}
    >
      {isActive ? (
        <div
          ref={cellRef}
          contentEditable
          suppressContentEditableWarning
          className="cell-input"
          onBlur={(e) => onCellBlur(cellId, e.target.textContent)}
          onInput={(e) => onCellInput(e, cellId)}
          onKeyDown={(e) => onKeyDown(e, cellId)}
        >
          {content}
        </div>
      ) : (
        <div className="cell-content">{content}</div>
      )}
    </td>
  );
});

function Spreadsheet({ activeCell, setActiveCell, spreadsheetData, setSpreadsheetData }) {
  const ROWS = 100;
  const COLS = 26;
  const [editingCell, setEditingCell] = useState(null);
  const [showFormulaDropdown, setShowFormulaDropdown] = useState(false);
  const [formulaSearch, setFormulaSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState(0);
  const activeCellRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  useEffect(() => {
    if (activeCellRef.current) {
      activeCellRef.current.focus();
      // Set cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      const node = activeCellRef.current;
      if (node.childNodes.length > 0) {
        const lastChild = node.childNodes[node.childNodes.length - 1];
        range.setStartAfter(lastChild);
      } else {
        range.setStart(node, 0);
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [activeCell]);

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

  const handleCellClick = useCallback((cellId) => {
    setActiveCell(cellId);
    setEditingCell(cellId);
    setShowFormulaDropdown(false);
  }, [setActiveCell]);

  const handleCellBlur = (cellId, value) => {
    const newData = { ...spreadsheetData };
    if (value.trim() === '') {
      delete newData[cellId];
    } else {
      newData[cellId] = value;
    }
    setSpreadsheetData(newData);
    setEditingCell(null);
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
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const content = e.target.textContent;
      
      const newData = { ...spreadsheetData };
      if (content.trim() === '') {
        delete newData[cellId];
      } else {
        newData[cellId] = content;
      }
      setSpreadsheetData(newData);

      if (content.startsWith('=')) {
        const result = evaluateFormula(content, newData);
        e.target.textContent = result;
      }

      setEditingCell(null);
      
      const nextRow = parseInt(cellId.match(/\d+/)[0]);
      const col = cellId.match(/[A-Z]+/)[0];
      const nextCellId = `${col}${nextRow + 1}`;
      setActiveCell(nextCellId);
    }
  };

  const insertFormula = (formulaName) => {
    if (editingCell && activeCellRef.current) {
      activeCellRef.current.textContent = `=${formulaName}()`;
      setShowFormulaDropdown(false);
      
      const range = document.createRange();
      const sel = window.getSelection();
      const text = activeCellRef.current.firstChild || activeCellRef.current;
      const position = activeCellRef.current.textContent.length - 1;
      
      range.setStart(text, position);
      range.setEnd(text, position);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const getCellContent = (cellId) => {
    if (editingCell === cellId) {
      return spreadsheetData[cellId] || '';
    }

    const value = spreadsheetData[cellId];
    if (!value) return '';

    if (typeof value === 'string' && value.startsWith('=')) {
      return evaluateFormula(value, spreadsheetData);
    }

    return value;
  };

  const getCellId = (row, col) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  };

  const handleResizeMouseDown = (e, colIndex) => {
    e.preventDefault();
    setResizingColumn(colIndex);
    setStartX(e.clientX);
    const currentWidth = columnWidths[colIndex] || 80; // default width
    setStartWidth(currentWidth);
  };

  const handleResizeMouseMove = useCallback((e) => {
    if (resizingColumn === null) return;
    
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff); // minimum width of 50px
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
  }, [resizingColumn, startX, startWidth]);

  const handleResizeMouseUp = useCallback(() => {
    setResizingColumn(null);
  }, []);

  useEffect(() => {
    if (resizingColumn !== null) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [resizingColumn, handleResizeMouseMove, handleResizeMouseUp]);

  const renderColumnHeader = (colIndex) => {
    const colLetter = String.fromCharCode(65 + colIndex);
    const width = columnWidths[colIndex] || 80; // default width
    
    return (
      <th 
        key={colIndex} 
        style={{ width: `${width}px` }}
        className="column-header"
      >
        {colLetter}
        <div
          className="resize-handle"
          onMouseDown={(e) => handleResizeMouseDown(e, colIndex)}
        />
      </th>
    );
  };

  const renderCell = (row, col) => {
    const cellId = getCellId(row, col);
    const isActive = cellId === activeCell;
    const content = getCellContent(cellId);
    const width = columnWidths[col] || 80; // default width
    
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
        style={{ width: `${width}px` }}
      />
    );
  };

  const filteredFormulas = FORMULAS.filter(formula =>
    formula.name.toLowerCase().startsWith(formulaSearch.toLowerCase())
  );

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

  return (
    <div className={`spreadsheet ${resizingColumn !== null ? 'resizing' : ''}`}>
      <table>
        <thead>
          <tr>
            <th className="corner-header"></th>
            {Array(COLS).fill().map((_, i) => renderColumnHeader(i))}
          </tr>
        </thead>
        <tbody>
          {Array(ROWS).fill().map((_, row) => (
            <tr key={row}>
              <th className="row-header">{row + 1}</th>
              {Array(COLS).fill().map((_, col) => renderCell(row, col))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderFormulaDropdown()}
    </div>
  );
}

export default React.memo(Spreadsheet);