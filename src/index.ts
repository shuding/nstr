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

  // Handle Infinity and -Infinity
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

      // If enough consecutive digits found, mark as artifact
      if (consecutiveCount >= threshold) {
        patternStart = i
        patternChar = char
        break
      }

      // Skip ahead to avoid redundant checks
      i = j - 1
    }
  }

  let result: string

  if (patternStart !== -1) {
    // Truncate at the start of the detected artifact
    let truncated = str.substring(0, patternStart)

    if (patternChar === '9') {
      // If we found a run of 9s, round up properly
      const beforeNines = truncated
      const rounded = Number.parseFloat(beforeNines)

      // Determine increment based on decimal precision
      const decimals =
        beforeNines.indexOf('.') >= 0
          ? beforeNines.length - beforeNines.indexOf('.') - 1
          : 0
      const increment = Math.pow(10, -decimals)

      // Round away from zero
      const roundedUp = rounded < 0 ? rounded - increment : rounded + increment

      truncated = roundedUp.toFixed(decimals)
    }

    result = truncated
  } else {
    // No artifact found → use the original fixed string
    result = str
  }

  // Clean up trailing zeros and decimal point
  result = result.replace(/\.?0+$/, '')

  // Remove trailing decimal point if it exists (e.g., "122." → "122")
  if (result.endsWith('.')) {
    result = result.slice(0, -1)
  }

  // Normalize negative zero to plain zero
  if (result === '-0') {
    result = '0'
  }

  return result
}

// Default export
export default nstr
