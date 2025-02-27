export const evaluateFormula = (formula, spreadsheetData) => {
  // Remove the '=' sign and get the function name and range
  const cleanFormula = formula.substring(1).trim();
  const functionMatch = cleanFormula.match(/^(\w+)\((.*)\)$/);
  
  if (!functionMatch) return '#ERROR!';
  
  const [_, functionName, range] = functionMatch;
  const values = getCellValuesFromRange(range, spreadsheetData);
  
  switch (functionName.toUpperCase()) {
    case 'SUM':
      return calculateSum(values);
    case 'AVERAGE':
      return calculateAverage(values);
    case 'MAX':
      return calculateMax(values);
    case 'MIN':
      return calculateMin(values);
    case 'COUNT':
      return calculateCount(values);
    default:
      return '#ERROR!';
  }
};

// Helper function to get cell values from a range (e.g., "A1:B3")
const getCellValuesFromRange = (range, spreadsheetData) => {
  const [start, end] = range.split(':');
  if (!end) {
    // Single cell reference
    return [getCellNumericValue(spreadsheetData[start])];
  }

  const startCol = start.match(/[A-Z]+/)[0];
  const startRow = parseInt(start.match(/\d+/)[0]);
  const endCol = end.match(/[A-Z]+/)[0];
  const endRow = parseInt(end.match(/\d+/)[0]);

  const values = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
      const cellId = `${String.fromCharCode(col)}${row}`;
      const value = getCellNumericValue(spreadsheetData[cellId]);
      if (value !== null) values.push(value);
    }
  }
  return values;
};

// Helper function to convert cell value to number
const getCellNumericValue = (value) => {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Mathematical function implementations
const calculateSum = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + (val || 0), 0);
};

const calculateAverage = (values) => {
  const validValues = values.filter(val => val !== null);
  if (validValues.length === 0) return '#DIV/0!';
  return calculateSum(validValues) / validValues.length;
};

const calculateMax = (values) => {
  const validValues = values.filter(val => val !== null);
  if (validValues.length === 0) return '#ERROR!';
  return Math.max(...validValues);
};

const calculateMin = (values) => {
  const validValues = values.filter(val => val !== null);
  if (validValues.length === 0) return '#ERROR!';
  return Math.min(...validValues);
};

const calculateCount = (values) => {
  return values.filter(val => val !== null).length;
}; 