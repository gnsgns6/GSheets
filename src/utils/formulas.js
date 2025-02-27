export const evaluateFormula = (formula, spreadsheetData) => {
  try {
    // Remove the '=' sign and get the function name and range
    const cleanFormula = formula.substring(1).trim().toUpperCase();
    const functionMatch = cleanFormula.match(/^(\w+)\((.*)\)$/);
    
    if (!functionMatch) return '#ERROR!';
    
    const [_, functionName, range] = functionMatch;
    const values = getCellValuesFromRange(range.trim(), spreadsheetData);
    
    console.log('Function:', functionName, 'Values:', values); // Debug log

    switch (functionName) {
      case 'SUM':
        return calculateSum(values).toString();
      case 'AVERAGE':
        return calculateAverage(values).toString();
      case 'MAX':
        return calculateMax(values).toString();
      case 'MIN':
        return calculateMin(values).toString();
      case 'COUNT':
        return calculateCount(values).toString();
      default:
        return '#INVALID!';
    }
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
};

const getCellValuesFromRange = (range, spreadsheetData) => {
  try {
    const [start, end] = range.split(':');
    if (!end) {
      // Single cell reference
      const value = getCellNumericValue(spreadsheetData[start]);
      return value !== null ? [value] : [];
    }

    const startCol = start.match(/[A-Z]+/)[0];
    const startRow = parseInt(start.match(/\d+/)[0]);
    const endCol = end.match(/[A-Z]+/)[0];
    const endRow = parseInt(end.match(/\d+/)[0]);

    const values = [];
    for (let row = startRow; row <= endRow; row++) {
      for (
        let col = startCol.charCodeAt(0);
        col <= endCol.charCodeAt(0);
        col++
      ) {
        const cellId = `${String.fromCharCode(col)}${row}`;
        const value = getCellNumericValue(spreadsheetData[cellId]);
        if (value !== null) values.push(value);
      }
    }
    
    console.log('Extracted values:', values); // Debug log
    return values;
  } catch (error) {
    console.error('Range parsing error:', error);
    return [];
  }
};

const getCellNumericValue = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

const calculateSum = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + (val || 0), 0);
};

const calculateAverage = (values) => {
  const validValues = values.filter(val => val !== null);
  if (validValues.length === 0) return '#DIV/0!';
  const sum = calculateSum(validValues);
  return (sum / validValues.length).toFixed(2);
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