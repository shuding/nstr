import nstr from './dist/index.mjs'

// Test cases demonstrating the functionality
const testCases = [
  // Basic floating point artifacts
  { input: 0.1, expected: '0.1' },
  { input: 0.10000000000000001, expected: '0.1' },
  { input: 0.14499999582767487, expected: '0.145' },

  // Clean numbers should be preserved
  { input: 3.1415926, expected: '3.1415926' },
  { input: 2.5, expected: '2.5' },
  { input: 42, expected: '42' },

  // Edge cases
  { input: 0, expected: '0' },
  { input: 1.9999999999, expected: '2' }, // Should round up
  { input: 0.9999999999, expected: '1' }, // Should round up

  // Very small numbers
  { input: 0.00000000001, expected: '0' },
  { input: 1e-10, expected: '0' },

  // Large numbers with consecutive zeros in middle of fraction
  { input: 123.456000007890123, expected: '123.456' },
  { input: 987.123000000456789, expected: '987.123' },
  { input: 1234.567800000012345, expected: '1234.5678' },

  // Large numbers with consecutive nines in middle of fraction
  { input: 456.78999999456789, expected: '456.79' },
  { input: 789.123999999876543, expected: '789.124' },
  { input: 2468.135999999024681, expected: '2468.136' },
  { input: 451.78999999456789, expected: '451.79' },

  // Mixed cases with longer sequences
  { input: 12345.678900000123456, expected: '12345.6789' },
  { input: 98765.432199999987654, expected: '98765.4322' },

  // NaN handling
  { input: Number.NaN, expected: 'NaN' },

  // Bug fix: trailing decimal point should be removed
  { input: 12.2 / 0.1, expected: '122' },
]

console.log('Testing nstr function:')
console.log('======================')

testCases.forEach(({ input, expected }, index) => {
  const result = nstr(input)
  const passed = result === expected
  console.log(
    `Test ${index + 1}: ${input} → "${result}" ${passed ? '✅' : '❌'}`
  )
  if (!passed) {
    console.log(`  Expected: "${expected}"`)
  }
})

console.log('\nTesting different thresholds:')
console.log('============================')

const testValue = 0.14499999582767487
;[2, 3, 4, 5, 6].forEach((threshold) => {
  const result = nstr(testValue, { threshold })
  console.log(`Threshold ${threshold}: ${testValue} → "${result}"`)
})
