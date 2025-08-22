# nstr

**number → string, but looks good**

Automatically detects and fixes floating-point precision issues. No more `0.30000000000000004` in your UI.

## The Problem

Floating-point arithmetic creates ugly precision artifacts that show up in your UI:

```js
0.1 + 0.2                 // => 0.30000000000000004
12.2 / 0.1                // => 121.99999999999999
19.9 * 100                // => 1989.9999999999998
0.14499999582767487       // => 0.14499999582767487
-0.0000001                // => -1e-7
```

**Real-world impact:**
```jsx
// Your draggable component
<div style={{
  transform: `translateX(${currentMouseX - startMouseX}px)`
}}>
// 😱 Results in: translateX(146.23999999999998px)

// Your price display
<span>${(price * rate).toString()}</span>
// 😱 Shows: $1989.9999999999998 instead of $1990
```

**Why traditional solutions fall short:**
- `toString()` → Shows the ugly decimals
- `toFixed(4)` → Turns `0.0000001` into `"0.0000"` 
- `toPrecision(4)` → Converts `12345.6` to `"1.235e+4"`

Native APIs force you to pick fixed precision parameters, but **nstr()** automatically detects the best precision for each number.

## Solution

```js
import nstr from 'nstr'

// ✨ Smart precision detection
nstr(0.1 + 0.2)                 // "0.3"
nstr(12.2 / 0.1)                // "122"
nstr(19.9 * 100)                // "1990"
nstr(0.14499999582767487)       // "0.145"  
nstr(1.9999999999)              // "2"
nstr(9999999.123000001)         // "9999999.123"
nstr(-0.0000001)                // "0"

// ✨ Preserves intentional precision  
nstr(42)                        // "42"
nstr(3.1415926)                 // "3.1415926"
nstr(9999999.12345)             // "9999999.12345"
```

**Perfect for UI components:**
```jsx
// ✨ Clean CSS transforms
<div style={{
  transform: `translateX(${nstr(currentMouseX - startMouseX)}px)`
}}>

// ✨ Clean price displays
<span>${nstr(price * rate)}</span>
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

// Just wrap any number
const result = nstr(0.1 + 0.2)  // "0.3"

// Works with any arithmetic
nstr(price * rate * taxRate)    // Clean decimals
nstr(mouseX - startX)           // Perfect for transforms  
nstr(Math.random() * 100)       // Clean random numbers
```

### Advanced Options

```js
// Customize precision detection sensitivity
nstr(0.1239991, { threshold: 2 })     // "0.123" (detects shorter patterns)
nstr(0.1239991, { threshold: 5 })     // "0.1239991" (more precise)

// Limit maximum decimal places  
nstr(Math.PI, { maxDecimals: 4 })     // "3.1416"
nstr(1/3, { maxDecimals: 6 })         // "0.333333"
```

**Options:**
- `threshold` (default: `4`) - Minimum consecutive 0s/9s to trigger cleanup
- `maxDecimals` (default: `10`) - Maximum decimal places to preserve

## How It Works

Let's trace through the algorithm using `0.14499999582767487` as an example:

**Step 1: Convert to fixed decimal**
```js
0.14499999582767487.toFixed(10)  // "0.1449999958"
```

**Step 2: Detect consecutive patterns**
```js
"0.1449999958"
//    ^^^^^
//    5 consecutive "9"s detected (≥ threshold of 4)
```

**Step 3: Truncate and clean up**
```js
"0.1449999958" → "0.145"
```

The algorithm detects floating-point artifacts by looking for consecutive identical digits (0s or 9s) longer than the threshold. When found, it intelligently truncates or rounds to produce clean results.

## License

MIT
