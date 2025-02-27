import React from 'react';

function Toolbar() {
  return (
    <div className="toolbar">
      <select className="font-family">
        <option>Arial</option>
        <option>Google Sans</option>
        <option>Roboto</option>
        <option>Roboto Mono</option>
      </select>
      
      <select className="font-size">
        {[8, 9, 10, 11, 12, 14, 16, 18, 24, 36].map(size => (
          <option key={size}>{size}</option>
        ))}
      </select>

      <div className="separator" style={{ width: '1px', height: '20px', backgroundColor: '#e1e1e1', margin: '0 4px' }} />
      
      <button title="Bold (⌘B)">
        <i className="material-icons">format_bold</i>
      </button>
      <button title="Italic (⌘I)">
        <i className="material-icons">format_italic</i>
      </button>
      <button title="Underline (⌘U)">
        <i className="material-icons">format_underlined</i>
      </button>
      
      <div className="separator" style={{ width: '1px', height: '20px', backgroundColor: '#e1e1e1', margin: '0 4px' }} />
      
      <button title="Text color">
        <i className="material-icons">format_color_text</i>
      </button>
      <button title="Fill color">
        <i className="material-icons">format_color_fill</i>
      </button>
      
      <div className="separator" style={{ width: '1px', height: '20px', backgroundColor: '#e1e1e1', margin: '0 4px' }} />
      
      <button title="Align left">
        <i className="material-icons">format_align_left</i>
      </button>
      <button title="Align center">
        <i className="material-icons">format_align_center</i>
      </button>
      <button title="Align right">
        <i className="material-icons">format_align_right</i>
      </button>
      
      <div className="separator" style={{ width: '1px', height: '20px', backgroundColor: '#e1e1e1', margin: '0 4px' }} />
      
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
