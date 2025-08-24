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
        break
      }

      // Skip ahead to avoid rechecking
      i = j - 1
    }
  }

  let resultStr = ''

  if (patternStart !== -1) {
    // Truncate at the start of the pattern
    const n = patternStart - decimalIndex - 1
    resultStr = value.toFixed(Math.max(0, n))
  } else {
    resultStr = str
  }

  // No pattern found, clean up trailing zeros and decimal point
  let result = resultStr.replace(/(?<=.\d*)0+$/, '')

  // Remove trailing decimal point if it exists (e.g., "122." -> "122")
  if (result.endsWith('.')) {
    result = result.slice(0, -1)
  }

  // Handle edge cases: "-0." becomes "0", "0." becomes "0", "-0" becomes "0"
  if (result === '-0') {
    result = '0'
  }

  return result
}

// Default export
export default nstr
