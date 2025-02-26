import React from 'react';

function FormulaBar({ activeCell }) {
  return (
    <div className="formula-bar">
      <div className="cell-reference">
        {activeCell || ''}
      </div>
      <input 
        type="text" 
        className="formula-input"
        placeholder="Enter formula or value"
      />
    </div>
  );
}

export default FormulaBar;