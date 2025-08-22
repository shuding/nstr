'use client'

import { useState, useEffect } from 'react'
import nstr from 'nstr'

const problemExampleData = [
  {
    value: 0.1,
    display: '0.1',
    toStringStatus: 'ok',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: 0.1 + 0.2,
    display: '0.1 + 0.2',
    toStringStatus: 'error',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: 12.2 / 0.1,
    display: '12.2 / 0.1',
    toStringStatus: 'error',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: -0.0000001,
    display: '-0.0000001',
    toStringStatus: 'error',
    toFixed4Status: 'error',
    toPrecision4Status: 'error',
  },
  {
    value: 19.9 * 100,
    display: '19.9 * 100',
    toStringStatus: 'error',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: 1.9999999999,
    display: '1.9999999999',
    toStringStatus: 'warning',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: 12345.60000002,
    display: '12345.60000002',
    toStringStatus: 'warning',
    toFixed4Status: 'warning',
    toPrecision4Status: 'error',
  },
  {
    value: 9999999.123000001,
    display: '9999999.123000001',
    toStringStatus: 'error',
    toFixed4Status: 'warning',
    toPrecision4Status: 'error',
  },
]

const problemExamples = problemExampleData.map((example) => ({
  ...example,
  toString: example.value.toString(),
  toFixed4: example.value.toFixed(4),
  toPrecision4: example.value.toPrecision(4),
  nstr: nstr(example.value),
}))

const presetExamples = [
  { value: 0.1 + 0.2, display: '0.1 + 0.2' },
  { value: 0.0000001, display: '0.0000001' },
  { value: -0.0000001, display: '-0.0000001' },
  { value: 12.2 / 0.1, display: '12.2 / 0.1' },
  { value: 19.9 * 100, display: '19.9 * 100' },
  { value: 0.14499999582767487, display: '0.14499999582767487' },
  { value: 1.9999999999, display: '1.9999999999' },
  { value: 456.78999999456789, display: '456.78999999456789' },
  { value: 9999999.123000001, display: '9999999.123000001' },
  { value: -0.30000000000000004, display: '-0.30000000000000004' },
  { value: -123.4560000002, display: '-123.4560000002' },
  { value: -1.9999999999, display: '-1.9999999999' },
  { value: 3.1415926, display: '3.1415926' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ok':
      return 'bg-green-50 border-green-400 text-green-900'
    case 'warning':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    case 'error':
      return 'bg-red-100 border-red-300 text-red-800'
    default:
      return 'bg-white'
  }
}

const CHAR = '"'

const baseAscii = `\
##    ##  ######  ######## ######## 
###   ## ##    ##    ##    ##     ##
####  ## ##          ##    ##     ##
## ## ##  ######     ##    ######## 
##  ####       ##    ##    ##   ##  
##   ### ##    ##    ##    ##    ## 
##    ##  ######     ##    ##     ##`.replaceAll('#', CHAR)

export default function Home() {
  const [inputValue, setInputValue] = useState('0.1 + 0.2')
  const [customNumber, setCustomNumber] = useState<number>(0.1 + 0.2)
  const [animationFrame, setAnimationFrame] = useState(0)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  )
  const [loadTime] = useState(Date.now())

  useEffect(() => {
    // Inject nstr to window for global access
    ;(window as any).nstr = nstr
    console.log('nstr() is available globally! Use it in your console.')
    console.log('Example: nstr(0.1 + 0.2) ===', JSON.stringify(nstr(0.1 + 0.2)))
  }, [])

  const getCharPosition = (ascii: string, hashIndex: number) => {
    const lines = ascii.split('\n')
    let currentHashCount = 0

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      for (
        let charIndex = 0;
        charIndex < lines[lineIndex].length;
        charIndex++
      ) {
        if (lines[lineIndex][charIndex] === CHAR) {
          if (currentHashCount === hashIndex) {
            return { x: charIndex * 8, y: lineIndex * 16 } // Approximate char dimensions
          }
          currentHashCount++
        }
      }
    }
    return { x: 0, y: 0 }
  }

  const animateAscii = (
    ascii: string,
    frame: number,
    mousePosition?: { x: number; y: number } | null
  ) => {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const elapsed = (Date.now() - loadTime) / 1000 - 0.5 // seconds since load
    const loadAnimationDuration = 3 // 3 seconds to fully load

    let result = ''
    let hashCount = 0
    const lines = ascii.split('\n')
    const maxColumn = Math.max(...lines.map((line) => line.length))
    let currentLine = 0
    let currentColumn = 0

    for (let i = 0; i < ascii.length; i++) {
      if (ascii[i] === '\n') {
        result += '\n'
        currentLine++
        currentColumn = 0
        continue
      }

      if (ascii[i] === CHAR) {
        // Progress animation by X/Y axis
        const loadProgress = Math.min(elapsed / loadAnimationDuration, 1)
        const posProgress =
          (currentColumn + currentLine) / (maxColumn + lines.length)

        // Easing function for load animation
        const easedProgress = 1 - Math.pow(1 - loadProgress, 5)

        let shouldShowHash = easedProgress > posProgress

        // Spotlight effect when mouse is present
        if (mousePosition) {
          const charPos = getCharPosition(ascii, hashCount)
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - charPos.x - 24, 2) +
              Math.pow(mousePosition.y - charPos.y - 16, 2)
          )
          const spotlightRadius = 60

          if (distance < spotlightRadius) {
            shouldShowHash = false // Show random numbers in spotlight
          }
        }

        if (shouldShowHash) {
          result += CHAR
        } else {
          // Show random number
          const seed = hashCount + frame
          const randomIndex =
            Math.floor(Math.sin(seed * 0.7 + hashCount * 1.3) * 1000) %
            chars.length
          const charIndex =
            randomIndex < 0 ? randomIndex + chars.length : randomIndex
          result += chars[charIndex]
        }

        hashCount++
      } else {
        result += ascii[i]
      }

      currentColumn++
    }
    return result
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => prev + 1)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    try {
      // Safely evaluate simple expressions
      const result = Function(`"use strict"; return (${value})`)()
      if (typeof result === 'number') {
        setCustomNumber(result)
      }
    } catch {
      // Invalid expression, keep previous value
    }
  }

  const handlePresetClick = (example: { value: number; display: string }) => {
    setCustomNumber(example.value)
    setInputValue(example.display)
  }

  return (
    <div className='min-h-screen bg-white text-black p-8 pt-24 font-mono selection:bg-black selection:text-white tracking-[-0.005em] font-light'>
      <div className='mx-auto max-w-4xl flex flex-col gap-8'>
        {/* Header */}
        <div className='text-center pb-8 mb-8'>
          <a
            href='https://github.com/shuding/nstr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs font-bold mb-12 bg-black text-white inline-block px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] transition-all whitespace-pre-wrap tracking-tight leading-3 select-none'
            // disable font ligatures
            style={{ fontVariantLigatures: 'none' }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              })
            }}
            onMouseLeave={() => setMousePos(null)}
          >
            {animateAscii(baseAscii, animationFrame, mousePos)}
          </a>
          <p className='text-xl font-normal mb-2 text-neutral-800'>
            number → string, but looks good
          </p>
          <p className='text-sm text-neutral-600'>
            Automatically detects and fixes floating-point precision issues •{' '}
            <a
              href='https://github.com/shuding/nstr'
              target='_blank'
              rel='noopener noreferrer'
              className='text-neutral-600 hover:text-white hover:bg-black transition-colors px-0.5'
            >
              [GitHub]
            </a>
          </p>
        </div>

        {/* The Problem */}
        <div className='bg-black text-white p-6 mb-8 border-2 border-white shadow-[10px_10px_0px_-2px_rgba(0,0,0,0.25)]'>
          <h2 className='text-2xl font-extralight mb-4 border-b-2 border-neutral-600 pb-2'>
            THE PROBLEM
          </h2>
          <p className='mb-3 text-white text-sm'>
            Floating-point arithmetic creates ugly precision artifacts that need
            smart formatting.
          </p>
          <p className='mb-3 text-neutral-400 text-sm'>
            Native APIs require fixed parameters. For example `toFixed(4)` works
            for 123.45670001 but destroys 0.0000001 → &ldquo;0.0000&rdquo;.
          </p>
          <p className='mb-6 text-neutral-400 text-sm'>
            `nstr()` automatically detects the best precision for you, and
            rounds numbers to the closest human-friendly format.
          </p>
          <div className='flex flex-col gap-4'>
            {problemExamples.map((example, idx) => (
              <div
                key={idx}
                className='flex flex-col md:flex-row md:items-center md:justify-between p-3 pl-5 border-l-4 border-neutral-700 bg-neutral-800 gap-4'
              >
                <code className='text-sm text-neutral-300 md:w-42 flex-shrink-0'>
                  {example.display}
                </code>
                <div className='grid grid-cols-2 md:flex md:items-center gap-3 md:space-x-4 md:gap-0'>
                  <div className='text-left md:text-right md:w-42'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toString()
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block whitespace-nowrap ${getStatusColor(
                        example.toStringStatus
                      )}`}
                    >
                      {example.toString}
                    </code>
                  </div>
                  <div className='text-left md:text-right md:w-26'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toFixed(4)
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block whitespace-nowrap ${getStatusColor(
                        example.toFixed4Status
                      )}`}
                    >
                      {example.toFixed4}
                    </code>
                  </div>
                  <div className='text-left md:text-right md:w-28'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toPrecision(4)
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block whitespace-nowrap ${getStatusColor(
                        example.toPrecision4Status
                      )}`}
                    >
                      {example.toPrecision4}
                    </code>
                  </div>
                  <div className='text-left md:text-right md:w-24 col-span-2 md:col-span-1'>
                    <div className='text-xs mb-1 text-white font-semibold'>
                      nstr()
                    </div>
                    <code className='text-xs px-2 py-1 border border-green-400 bg-green-50 text-green-900 block whitespace-nowrap'>
                      {example.nstr}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className='bg-neutral-100 border-2 border-white p-6 mb-8 shadow-[10px_10px_0px_-2px_rgba(0,0,0,0.15)]'>
          <h2 className='text-2xl font-extralight mb-4 border-b border-neutral-300 pb-2'>
            INTERACTIVE DEMO
          </h2>

          {/* Preset Examples */}
          <div className='mb-6'>
            <h3 className='text-sm mb-3 text-neutral-800'>
              Try these examples:
            </h3>
            <div className='flex flex-wrap gap-2'>
              {presetExamples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(example)}
                  className='px-3 py-1 bg-neutral-800 text-white border-2 border-neutral-800 hover:bg-neutral-200 hover:text-black transition-colors text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]'
                >
                  {example.display}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className='mb-6'>
            <label
              htmlFor='custom-input'
              className='block text-sm mb-3 text-neutral-800'
            >
              Or enter your own expression:
            </label>
            <input
              id='custom-input'
              type='text'
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='> e.g., 0.1 + 0.2, 1/3, Math.PI'
              className='w-full px-3 py-2 border-2 border-neutral-400 focus:outline-none focus:border-black bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]'
            />
          </div>

          {/* Comparison */}
          <div className='grid md:grid-cols-2 gap-4 mb-6'>
            <div className='border-2 border-neutral-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] bg-neutral-50'>
              <h4 className='font-bold mb-3 text-neutral-800'>
                JavaScript Built-ins
              </h4>
              <div className='space-y-2'>
                <div>
                  <div className='text-xs text-neutral-600 mb-1'>
                    .toString()
                  </div>
                  <code className='block bg-neutral-100 text-black px-2 py-1 border border-neutral-300 text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]'>
                    {customNumber.toString()}
                  </code>
                </div>
                <div>
                  <div className='text-xs text-neutral-600 mb-1'>
                    .toFixed(3)
                  </div>
                  <code className='block bg-neutral-100 text-black px-2 py-1 border border-neutral-300 text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]'>
                    {customNumber.toFixed(3)}
                  </code>
                </div>
                <div>
                  <div className='text-xs text-neutral-600 mb-1'>
                    .toPrecision(5)
                  </div>
                  <code className='block bg-neutral-100 text-black px-2 py-1 border border-neutral-300 text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]'>
                    {customNumber.toPrecision(5)}
                  </code>
                </div>
              </div>
            </div>
            <div className='border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] bg-white'>
              <h4 className='font-bold mb-3 text-black'>nstr (Smart)</h4>
              <div className='space-y-2'>
                <div>
                  <div className='text-xs text-neutral-600 mb-1'>nstr()</div>
                  <code className='block bg-white text-black px-2 py-1 border-2 border-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'>
                    {nstr(customNumber)}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className='bg-neutral-100 border-2 border-white p-6 mb-8 shadow-[10px_10px_0px_-2px_rgba(0,0,0,0.15)]'>
          <h2 className='text-2xl font-extralight mb-4 border-b border-neutral-300 pb-2'>
            USAGE
          </h2>
          <div className='bg-neutral-900 text-white p-4 text-sm overflow-x-auto'>
            <div className='mb-2 text-neutral-500'># Install</div>
            <div className='mb-8'>pnpm install nstr</div>
            <div className='mb-2 text-neutral-500'># Basic usage</div>
            <div className='mb-2'>import nstr from &apos;nstr&apos;</div>
            <div className='mb-0'>const result = nstr(0.1 + 0.2)</div>
            <div className='mb-8 text-neutral-500'>{`// result: "0.3"`}</div>
            <div className='mb-2 text-neutral-500'>
              # Advanced: configure max decimals, defaults to 10
            </div>
            <div className='mb-0'>nstr(Math.PI, {'{ maxDecimals: 4 }'})</div>
            <div className='mb-8 text-neutral-500'>{`// result: "3.1416"`}</div>
            <div className='mb-2 text-neutral-500'>
              # Advanced: configure precision detection, defaults to 4
            </div>
            <div className='mb-0'>nstr(0.1239991, {'{ threshold: 2 }'})</div>
            <div className='mb-2 text-neutral-500'>
              {`// result: "0.123" (detects shorter patterns)`}
            </div>
            <div className='mb-0'>nstr(0.1239991, {'{ threshold: 5 }'})</div>
            <div className='mb-2 text-neutral-500'>
              {`// result: "0.1239991" (be more precise)`}
            </div>
          </div>
        </div>

        {/* How Does It Work */}
        <div className='bg-neutral-100 border-2 border-white p-6 mb-8 shadow-[10px_10px_0px_-2px_rgba(0,0,0,0.15)]'>
          <h2 className='text-2xl font-extralight mb-4 border-b border-neutral-300 pb-2'>
            HOW DOES IT WORK?
          </h2>
          <p className='mb-6 text-neutral-600 text-sm'>
            Let&apos;s trace through the algorithm using `0.14499999582767487`
            as an example:
          </p>

          <div className='bg-neutral-50 border border-neutral-300 p-4 mb-6'>
            <div className='mb-4'>
              <div className='text-sm font-bold text-neutral-800 mb-2'>
                Step 1: Convert to fixed decimal
              </div>
              <div className='text-xs text-neutral-600 mb-1'>
                number.toFixed(maxDecimals=10) to avoid scientific notation and
                cap maximum digits
              </div>
              <div className='font-mono text-sm bg-white px-3 py-2 border border-neutral-300'>
                0.14499999582767487 → &ldquo;0.1449999958&rdquo;
              </div>
            </div>

            <div className='mb-4'>
              <div className='text-sm font-bold text-neutral-800 mb-2'>
                Step 2: Detect consecutive patterns
              </div>
              <div className='text-xs text-neutral-600 mb-2'>
                Look for consecutive &ldquo;0&rdquo;s or &ldquo;9&rdquo;s longer
                than threshold=4
              </div>
              <div className='font-mono text-sm bg-white px-3 py-2 pb-6 border border-neutral-300 relative'>
                <span>0.144</span>
                <span className='bg-yellow-100'>99999</span>
                <div className='absolute top-7 flex whitespace-nowrap select-none'>
                  <span className='text-transparent'>0.144</span>
                  <span className='relative text-transparent border-t border-neutral-500'>
                    99999
                    <span className='absolute left-0 -top-1 text-[10px] text-neutral-500 mt-1'>
                      5 consecutive &ldquo;9&rdquo;s detected
                    </span>
                  </span>
                </div>
                <span>58</span>
              </div>
            </div>

            <div>
              <div className='text-sm font-bold text-neutral-800 mb-2'>
                Step 3: Truncate and clean up
              </div>
              <div className='text-xs text-neutral-600 mb-1'>
                Remove succeeding digits after the pattern
              </div>
              <div className='font-mono text-sm bg-white px-3 py-2 border border-neutral-300'>
                &ldquo;0.1449999958&rdquo; → &ldquo;0.145&rdquo;
              </div>
            </div>
          </div>

          <div className='text-sm text-neutral-600'>
            <div className='mb-2'>
              <strong>Key parameters:</strong>
            </div>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>
                <code className='bg-neutral-100 px-1'>maxDecimals</code>{' '}
                (default: 10) - Maximum decimal places to consider
              </li>
              <li>
                <code className='bg-neutral-100 px-1'>threshold</code> (default:
                4) - Minimum consecutive 0s/9s to trigger cleanup
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center text-neutral-600 text-sm border-t-1 border-neutral-200 pt-8 mt-8'>
          <p>
            Built by{' '}
            <a
              href='https://x.com/shuding_'
              target='_blank'
              rel='noopener noreferrer'
              className='text-neutral-600 hover:text-white hover:bg-black transition-colors px-0.5'
            >
              [@shuding_]
            </a>{' '}
            with{' '}
            <a
              href='https://v0.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-neutral-600 hover:text-white hover:bg-black transition-colors px-0.5'
            >
              [v0.dev]
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
