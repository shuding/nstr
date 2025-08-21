/**
 * Automatically determines the appropriate precision for a number by detecting
 * floating point artifacts (consecutive 0s or 9s) and truncating accordingly.
 */
function nstr(
  value: number,
  options: {
    /** Minimum consecutive digits to consider as floating point artifact */
    threshold?: number
    /** Maximum decimal places to preserve */
    maxDecimals?: number
  } = {}
): string {
  const { threshold = 4, maxDecimals = 10 } = options

  if (Number.isNaN(value)) return 'NaN'

  // Handle special cases
  if (!isFinite(value)) return value.toString()
  if (Number.isInteger(value)) return value.toString()

  // Convert to string with sufficient precision
  const str = value.toFixed(maxDecimals)

  // Find patterns of consecutive 0s or 9s in the decimal part only
  let patternStart = -1
  let patternChar = ''
  const decimalIndex = str.indexOf('.')

  // Only look for patterns after the decimal point
  const startIndex = decimalIndex >= 0 ? decimalIndex + 1 : str.length

  for (let i = startIndex; i < str.length; i++) {
    const char = str[i]
    if (char === '0' || char === '9') {
      let consecutiveCount = 1
      let j = i + 1

      // Count consecutive identical digits
      while (j < str.length && str[j] === char) {
        consecutiveCount++
        j++
      }

      // If we found enough consecutive digits, mark the pattern
      if (consecutiveCount >= threshold) {
        patternStart = i
        patternChar = char
        break
      }

      // Skip ahead to avoid rechecking
      i = j - 1
    }
  }

  if (patternStart !== -1) {
    // Truncate at the start of the pattern
    let truncated = str.substring(0, patternStart)

    // If we found 9s, we might need to round up
    if (patternChar === '9') {
      const beforeNines = truncated
      const rounded = Number.parseFloat(beforeNines)

      // Check if rounding up changes the result significantly
      const increment = Math.pow(
        10,
        -(beforeNines.length - beforeNines.indexOf('.') - 1)
      )
      // For negative numbers, subtract the increment to round away from zero
      const roundedUp = rounded < 0 ? rounded - increment : rounded + increment

      // Use the rounded version if it's cleaner
      if (roundedUp.toString().length <= beforeNines.length) {
        truncated = roundedUp.toString()
      }
    }

    // Clean up trailing zeros and decimal point
    let result = truncated.replace(/\.?0+$/, '')
    
    // Handle edge cases: "-0." becomes "0", "0." becomes "0", "-0" becomes "0"
    if (result === '-0.' || result === '0.' || result === '-0') {
      result = '0'
    }
    
    return result
  }

  // No pattern found, clean up trailing zeros
  let result = str.replace(/\.?0+$/, '')
  
  // Handle edge cases: "-0." becomes "0", "0." becomes "0", "-0" becomes "0"
  if (result === '-0.' || result === '0.' || result === '-0') {
    result = '0'
  }
  
  return result
}

// Default export
export default nstr
