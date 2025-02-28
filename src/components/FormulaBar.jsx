import React, { useState, useEffect } from 'react';
import '../styles/FormulaBar.css';

function FormulaBar({ activeCell, spreadsheetData, setSpreadsheetData }) {
  const [formulaValue, setFormulaValue] = useState('');
  const [showFunctionHelper, setShowFunctionHelper] = useState(false);
  const [functionSearch, setFunctionSearch] = useState('');

  // Common spreadsheet functions with descriptions
  const functions = [
    { name: 'SUM', desc: 'Add up values in a range', syntax: 'SUM(number1, [number2, ...])' },
    { name: 'AVERAGE', desc: 'Calculate average of values', syntax: 'AVERAGE(number1, [number2, ...])' },
    { name: 'COUNT', desc: 'Count numbers in a range', syntax: 'COUNT(value1, [value2, ...])' },
    { name: 'MAX', desc: 'Find maximum value', syntax: 'MAX(number1, [number2, ...])' },
    { name: 'MIN', desc: 'Find minimum value', syntax: 'MIN(number1, [number2, ...])' },
    { name: 'IF', desc: 'Conditional logic', syntax: 'IF(logical_test, value_if_true, value_if_false)' }
  ];

  // Update formula bar when active cell changes
  useEffect(() => {
    if (activeCell && spreadsheetData[activeCell]) {
      setFormulaValue(spreadsheetData[activeCell]);
    } else {
      setFormulaValue('');
    }
  }, [activeCell, spreadsheetData]);

  const handleFormulaChange = (e) => {
    const value = e.target.value;
    setFormulaValue(value);

    // Show function helper when typing '=' followed by text
    if (value.startsWith('=')) {
      setShowFunctionHelper(true);
      setFunctionSearch(value.slice(1).toLowerCase());
    } else {
      setShowFunctionHelper(false);
    }
  };

  const handleFunctionSelect = (func) => {
    setFormulaValue(`=${func.name}()`);
    setShowFunctionHelper(false);
    // Position cursor between parentheses
    const input = document.querySelector('.formula-input');
    input.focus();
    input.setSelectionRange(func.name.length + 2, func.name.length + 2);
  };

  const handleFormulaSubmit = (e) => {
    if (e.key === 'Enter' && activeCell) {
      e.preventDefault();
      const newData = { ...spreadsheetData };
      newData[activeCell] = formulaValue;
      setSpreadsheetData(newData);
      setShowFunctionHelper(false);
    } else if (e.key === 'Escape') {
      setShowFunctionHelper(false);
    }
  };

  const filteredFunctions = functions.filter(func =>
    func.name.toLowerCase().includes(functionSearch)
  );

  return (
    <div className="formula-bar">
      <div className="formula-bar-left">
        <div className="fx-icon">
          <i className="material-icons">functions</i>
        </div>
        <div className="cell-reference">
          {activeCell || ''}
        </div>
      </div>
      <div className="formula-bar-right">
        <input
          type="text"
          className="formula-input"
          value={formulaValue}
          onChange={handleFormulaChange}
          onKeyDown={handleFormulaSubmit}
          placeholder="Enter formula or value"
        />
        {showFunctionHelper && (
          <div className="function-helper">
            {filteredFunctions.map(func => (
              <div
                key={func.name}
                className="function-item"
                onClick={() => handleFunctionSelect(func)}
              >
                <div className="function-name">{func.name}</div>
                <div className="function-desc">{func.desc}</div>
                <div className="function-syntax">{func.syntax}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormulaBar;