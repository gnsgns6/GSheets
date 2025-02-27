import React from 'react';

function Toolbar() {
  return (
    <div className="toolbar">
      {/* File Operations Group */}
      <div className="toolbar-group">
        <button title="New"><i className="material-icons">add</i></button>
        <button title="Open"><i className="material-icons">folder_open</i></button>
        <button title="Save"><i className="material-icons">save</i></button>
        <button title="Download"><i className="material-icons">download</i></button>
      </div>

      {/* Edit Operations Group */}
      <div className="toolbar-group">
        <button title="Undo"><i className="material-icons">undo</i></button>
        <button title="Redo"><i className="material-icons">redo</i></button>
        <button title="Copy"><i className="material-icons">content_copy</i></button>
        <button title="Cut"><i className="material-icons">content_cut</i></button>
        <button title="Paste"><i className="material-icons">content_paste</i></button>
      </div>

      {/* Formatting Group */}
      <div className="toolbar-group">
        <select className="font-family" title="Font">
          <option>Arial</option>
          <option>Google Sans</option>
          <option>Roboto</option>
        </select>
        <select className="font-size" title="Font size">
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Text Formatting */}
      <div className="toolbar-group">
        <button title="Bold"><i className="material-icons">format_bold</i></button>
        <button title="Italic"><i className="material-icons">format_italic</i></button>
        <button title="Underline"><i className="material-icons">format_underlined</i></button>
        <button title="Text Color"><i className="material-icons">format_color_text</i></button>
        <button title="Fill Color"><i className="material-icons">format_color_fill</i></button>
      </div>

      {/* Alignment Group */}
      <div className="toolbar-group">
        <button title="Align Left"><i className="material-icons">format_align_left</i></button>
        <button title="Align Center"><i className="material-icons">format_align_center</i></button>
        <button title="Align Right"><i className="material-icons">format_align_right</i></button>
      </div>

      {/* Data Operations */}
      <div className="toolbar-group">
        <button title="Sort"><i className="material-icons">sort</i></button>
        <button title="Filter"><i className="material-icons">filter_list</i></button>
        <button title="Chart"><i className="material-icons">insert_chart</i></button>
        <button title="Functions"><i className="material-icons">functions</i></button>
      </div>

      {/* Insert Options */}
      <div className="toolbar-group">
        <button title="Insert Row"><i className="material-icons">add_box</i></button>
        <button title="Insert Column"><i className="material-icons">view_column</i></button>
        <button title="Insert Comment"><i className="material-icons">comment</i></button>
        <button title="Insert Image"><i className="material-icons">image</i></button>
      </div>
    </div>
  );
}

export default Toolbar;
