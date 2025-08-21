# nstr

[![npm version](https://img.shields.io/npm/v/nstr.svg)](https://www.npmjs.com/package/nstr)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Number to string, but elegantly. Automatically detects and fixes floating-point precision issues.

## The Problem

JavaScript's floating-point arithmetic can produce unexpected results:

```js
0.1 + 0.2                 // => 0.30000000000000004
0.14499999582767487       // => 0.14499999582767487  
1.9999999999              // => 1.9999999999
123.456000007890123       // => 123.456000007890123
```

When these numbers are converted to strings in real applications, you get ugly results:

```jsx
<DraggableDiv style={{
  transform: `translateX(${currentMouseX - startMouseX}px)`
}}>
// Results in: translateX(146.23999999999998px) 😱
```

Traditional solutions require fixed precision:
- `toFixed()` and `toPrecision()` can turn integers into floats or add unnecessary zeros
- `toLocaleString()` adds commas and requires capped precision
- `Math.round(x * 100) / 100` requires manual precision handling

**nstr** provides an automatic way to handle all cases intelligently.

## Solution

```js
import nstr from 'nstr'

nstr(0.1 + 0.2)                 // "0.3"
nstr(0.14499999582767487)       // "0.145"  
nstr(1.9999999999)              // "2"
nstr(123.456000007890123)       // "123.456"
nstr(42)                        // "42"
nstr(3.1415926)                 // "3.1415926"
```

## Installation

```bash
npm install nstr
# or
pnpm add nstr
# or
yarn add nstr
```

## Usage

### Basic Usage

```js
import nstr from 'nstr'

const result = nstr(0.1 + 0.2)
console.log(result) // "0.3"

// Perfect for UI components
<DraggableDiv style={{
  transform: `translateX(${nstr(currentMouseX - startMouseX)}px)`
}}>
// Clean result: translateX(146.24px) ✨
```

### With Options

```js
import nstr from 'nstr'

// Customize detection threshold
nstr(0.14499999582767487, { threshold: 3 })  // "0.145"

// Limit maximum decimal places
nstr(Math.PI, { maxDecimals: 4 })            // "3.1416"
```

### Options

- `threshold` (number, default: 4): Minimum consecutive digits to consider as floating point artifact
- `maxDecimals` (number, default: 10): Maximum decimal places to preserve

## How It Works

nstr detects floating-point artifacts by looking for patterns of consecutive identical digits (0s or 9s). When found, it intelligently truncates or rounds the number to produce a clean string representation.

## Demo

Check out the interactive demo at the [examples](./examples) directory, built with Next.js and Tailwind CSS. See live examples including the DraggableDiv use case.

To run the demo:

```bash
pnpm install
pnpm dev
```

## Development

This project uses a pnpm workspace structure:

```
├── packages/nstr/     # Main library
└── examples/          # Next.js demo app
```

### Commands

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Run tests
pnpm test

# Start demo
pnpm dev
```

## License

ISC