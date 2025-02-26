import React from 'react';

function Toolbar() {
  return (
    <div className="toolbar">
      <select>
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Calibri</option>
      </select>
      
      <button title="Bold"><strong>B</strong></button>
      <button title="Italic"><em>I</em></button>
      <button title="Underline"><u>U</u></button>
      
      <input type="color" title="Text Color" />
      <input type="color" title="Fill Color" />
      
      <select title="Functions">
        <option value="">Functions</option>
        <option value="SUM">SUM</option>
        <option value="AVERAGE">AVERAGE</option>
        <option value="MAX">MAX</option>
        <option value="MIN">MIN</option>
        <option value="COUNT">COUNT</option>
      </select>
    </div>
  );
}

export default Toolbar;
