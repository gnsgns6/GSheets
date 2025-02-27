import React, { useState, useEffect } from 'react';

function FormulaBar({ activeCell, spreadsheetData, setSpreadsheetData }) {
  const [formulaValue, setFormulaValue] = useState('');

  // Update formula bar when active cell changes
  useEffect(() => {
    if (activeCell && spreadsheetData[activeCell]) {
      setFormulaValue(spreadsheetData[activeCell]);
    } else {
      setFormulaValue('');
    }
  }, [activeCell, spreadsheetData]);

  const handleFormulaChange = (e) => {
    setFormulaValue(e.target.value);
  };

  const handleFormulaSubmit = (e) => {
    if (e.key === 'Enter' && activeCell) {
      setSpreadsheetData(prev => ({
        ...prev,
        [activeCell]: formulaValue
      }));
    }
  };

  return (
    <div className="formula-bar">
      <div className="cell-reference">
        {activeCell || ''}
      </div>
      <input 
        type="text" 
        className="formula-input"
        value={formulaValue}
        onChange={handleFormulaChange}
        onKeyDown={handleFormulaSubmit}
        placeholder="Enter formula or value"
      />
    </div>
  );
}

export default FormulaBar;