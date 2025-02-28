import React, { useState } from 'react';
import '../styles/AdvancedFeatures.css';

function AdvancedFeatures({ spreadsheetData, setSpreadsheetData }) {
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);

  // Complex formula handling with relative and absolute references
  const handleComplexFormula = (formula, cellId) => {
    const absoluteRegex = /\$[A-Z]+\$[0-9]+/g;
    const relativeRegex = /[A-Z]+[0-9]+/g;
    
    try {
      // Handle absolute references
      formula = formula.replace(absoluteRegex, (match) => {
        return spreadsheetData[match.replace(/\$/g, '')] || 0;
      });

      // Handle relative references
      formula = formula.replace(relativeRegex, (match) => {
        return spreadsheetData[match] || 0;
      });

      return eval(formula);
    } catch (error) {
      return '#ERROR!';
    }
  };

  // Save and load spreadsheet data
  const saveSpreadsheet = () => {
    const data = {
      content: spreadsheetData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
  };

  const loadSpreadsheet = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setSpreadsheetData(data.content);
      } catch (error) {
        console.error('Error loading spreadsheet:', error);
      }
    };

    reader.readAsText(file);
  };

  // Chart creation
  const createChart = (data, type = 'bar') => {
    if (!selectedRange) return;

    const chartData = {
      type,
      data: processRangeData(selectedRange),
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };

    // Implementation would continue with chart library integration
    // (e.g., Chart.js, D3.js, etc.)
  };

  // Data visualization helpers
  const processRangeData = (range) => {
    // Extract and process data from the selected range
    // Returns formatted data for charting
  };

  return (
    <div className="advanced-features">
      {/* File Operations */}
      <div className="file-operations">
        <button onClick={saveSpreadsheet}>
          <i className="material-icons">save</i>
          Save Spreadsheet
        </button>
        <label className="load-button">
          <i className="material-icons">folder_open</i>
          Load Spreadsheet
          <input
            type="file"
            accept=".json"
            onChange={loadSpreadsheet}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Chart Creation */}
      <div className="chart-tools">
        <button onClick={() => setShowChartModal(true)}>
          <i className="material-icons">insert_chart</i>
          Create Chart
        </button>
      </div>

      {/* Chart Modal */}
      {showChartModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Chart</h2>
            <div className="chart-options">
              <button onClick={() => createChart(selectedRange, 'bar')}>Bar Chart</button>
              <button onClick={() => createChart(selectedRange, 'line')}>Line Chart</button>
              <button onClick={() => createChart(selectedRange, 'pie')}>Pie Chart</button>
              <button onClick={() => createChart(selectedRange, 'scatter')}>Scatter Plot</button>
            </div>
            <button onClick={() => setShowChartModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFeatures; 