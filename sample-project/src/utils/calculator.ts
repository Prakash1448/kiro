// Sample calculator utility with some quality issues for demonstration

export function add(a: number, b: number): number {
  console.log('Adding:', a, b); // Debug statement - should be removed
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  // TODO: Add input validation
  return a * b;
}

export async function divide(a: number, b: number): Promise<number> {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// This function is intentionally long to demonstrate the long function detection
export function complexCalculation(
  x: number,
  y: number,
  z: number
): number {
  let result = 0;
  
  // Step 1: Initialize
  result = x + y + z;
  
  // Step 2: Apply some transformations
  result = result * 2;
  result = result + 10;
  result = result / 5;
  
  // Step 3: More operations
  result = result - 3;
  result = result * result;
  
  // Step 4: Conditional logic
  if (result > 100) {
    result = result / 2;
  } else {
    result = result * 2;
  }
  
  // Step 5: More transformations
  result = Math.sqrt(result);
  result = Math.round(result);
  
  // Step 6: Final adjustments
  if (result < 0) {
    result = 0;
  }
  
  // Step 7: Apply multiplier
  result = result * 1.5;
  
  // Step 8: Round to integer
  result = Math.floor(result);
  
  // Step 9: Add offset
  result = result + 5;
  
  // Step 10: Final validation
  if (result > 1000) {
    result = 1000;
  }
  
  // Step 11: Return
  return result;
}

export function parseNumber(value: string): number {
  try {
    return parseInt(value, 10);
  } catch (error) {
    // Empty catch block - bad practice
  }
  return 0;
}
