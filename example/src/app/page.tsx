'use client'

import { useState } from 'react'
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
    value: 0.1449999999582767487,
    display: '0.1449999999582767487',
    toStringStatus: 'warning',
    toFixed4Status: 'warning',
    toPrecision4Status: 'warning',
  },
  {
    value: 1.9999999999,
    display: '1.9999999999',
    toStringStatus: 'ok',
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
  { value: 0.14499999582767487, display: '0.14499999582767487' },
  { value: 1.9999999999, display: '1.9999999999' },
  { value: 0.9999999999, display: '0.9999999999' },
  { value: 123.4560000002, display: '123.4560000002' },
  { value: 456.78999999456789, display: '456.78999999456789' },
  { value: 199999999.12300001, display: '199999999.12300001' },
  { value: 9999999.123000001, display: '9999999.123000001' },
  { value: -0.30000000000000004, display: '-0.30000000000000004' },
  { value: -123.4560000002, display: '-123.4560000002' },
  { value: -1.9999999999, display: '-1.9999999999' },
  { value: 42, display: '42' },
  { value: -42, display: '-42' },
  { value: 3.1415926, display: '3.1415926' },
  { value: 0.0000001, display: '0.0000001' },
  { value: -0.0000001, display: '-0.0000001' },
  { value: -0.00123, display: '-0.00123' },
  { value: -0, display: '-0' },
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

export default function Home() {
  const [inputValue, setInputValue] = useState('0.1 + 0.2')
  const [customNumber, setCustomNumber] = useState<number>(0.1 + 0.2)

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
    <div className='min-h-screen bg-white text-black p-8 pt-24 font-mono'>
      <div className='mx-auto max-w-4xl flex flex-col gap-8'>
        {/* Header */}
        <div className='text-center pb-8 mb-8'>
          <a
            href='https://github.com/shuding/nstr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-6xl font-bold mb-12 bg-black text-white inline-block px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] transition-all'
          >
            nstr
          </a>
          <p className='text-xl font-bold mb-2 text-neutral-800'>
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
        <div className='bg-neutral-900 text-white p-6 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]'>
          <h2 className='text-2xl font-bold mb-4 border-b-2 border-neutral-600 pb-2'>
            THE PROBLEM
          </h2>
          <p className='mb-3 text-white text-base'>
            Floating-point arithmetic creates ugly precision artifacts that need
            smart formatting.
          </p>
          <p className='mb-6 text-neutral-400 text-sm'>
            The challenge: native APIs require fixed parameters. `toFixed(4)`
            works for 123.45670001 but destroys 0.0000001 → &ldquo;0.0000&rdquo;
          </p>
          <div className='flex flex-col gap-4'>
            {problemExamples.map((example, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between p-4 border-l-4 border-neutral-500 bg-neutral-800'
              >
                <code className='text-sm text-neutral-300 w-42 flex-shrink-0'>
                  {example.display}
                </code>
                <div className='flex items-center space-x-4'>
                  <div className='text-right w-42'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toString()
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block ${getStatusColor(
                        example.toStringStatus
                      )}`}
                    >
                      {example.toString}
                    </code>
                  </div>
                  <div className='text-right w-26'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toFixed(4)
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block ${getStatusColor(
                        example.toFixed4Status
                      )}`}
                    >
                      {example.toFixed4}
                    </code>
                  </div>
                  <div className='text-right w-28'>
                    <div className='text-xs mb-1 text-neutral-400'>
                      .toPrecision(4)
                    </div>
                    <code
                      className={`text-xs text-black px-2 py-1 border block ${getStatusColor(
                        example.toPrecision4Status
                      )}`}
                    >
                      {example.toPrecision4}
                    </code>
                  </div>
                  <div className='text-right w-24'>
                    <div className='text-xs mb-1 text-white font-semibold'>
                      nstr()
                    </div>
                    <code className='text-xs px-2 py-1 border border-green-400 bg-green-50 text-green-900 block'>
                      {example.nstr}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className='bg-white border-4 border-neutral-400 p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]'>
          <h2 className='text-2xl font-bold mb-4 border-b-2 border-neutral-300 pb-2'>
            INTERACTIVE DEMO
          </h2>

          {/* Preset Examples */}
          <div className='mb-6'>
            <h3 className='text-lg font-bold mb-3 text-neutral-800'>
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
              className='block text-sm font-bold mb-2 text-neutral-800'
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
        <div className='bg-neutral-100 border-4 border-neutral-400 p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]'>
          <h2 className='text-2xl font-bold mb-4 border-b-2 border-neutral-400 pb-2'>
            USAGE
          </h2>
          <div className='bg-neutral-900 text-white p-4 border-2 border-neutral-700 text-sm overflow-x-auto shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.3)]'>
            <div className='mb-2 text-neutral-500'># Install</div>
            <div className='mb-8'>npm install nstr</div>
            <div className='mb-2 text-neutral-500'># Basic usage</div>
            <div className='mb-2'>import nstr from &apos;nstr&apos;</div>
            <div className='mb-0'>const result = nstr(0.1 + 0.2)</div>
            <div className='mb-8 text-neutral-500'>{"// result: “0.3”"}</div>
            <div className='mb-2 text-neutral-500'>
              # Advanced: configure precision detection
            </div>
            <div className='mb-0'>nstr(Math.PI, {'{ maxDecimals: 4 }'})</div>
            <div className='mb-2 text-neutral-500'>{"// result: “3.1416”"}</div>
            <div className='mb-0'>nstr(0.1239991, {'{ threshold: 2 }'})</div>
            <div className='mb-2 text-neutral-500'>
              {"// result: “0.123” (detects shorter patterns)"}
            </div>
            <div className='mb-0'>nstr(0.1239991, {'{ threshold: 5 }'})</div>
            <div className='mb-2 text-neutral-500'>
              {"// result: “0.1239991” (be more precise)"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center text-neutral-600 text-sm border-t-2 border-neutral-300 pt-8 mt-8'>
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
