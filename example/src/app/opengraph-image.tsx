import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'nstr - number to string, but looks good'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const boldFont = fs.readFileSync(
  path.resolve(process.cwd(), 'src/app/GeistMono-SemiBold.otf')
)

const title = `\
##    ##  ######  ######## ######## 
###   ## ##    ##    ##    ##     ##
####  ## ##          ##    ##     ##
## ## ##  ######     ##    ######## 
##  ####       ##    ##    ##   ##  
##   ### ##    ##    ##    ##    ## 
##    ##  ######     ##    ##     ##`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            fontFamily: 'monospace',
            marginBottom: '20px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '26px',
            color: '#eee',
            fontFamily: 'monospace',
            textAlign: 'center',
            maxWidth: '500px',
            marginTop: '24px',
            lineHeight: 1.6,
          }}
        >
          Stringify numbers in JavaScript with smart precision detection
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '32px',
            gap: '16px',
            fontSize: '20px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(0, 217, 255, 0.1)',
              color: '#00d9ff',
              borderRadius: '4px',
              border: '1px solid rgba(0, 217, 255, 0.3)',
            }}
          >
            0.30000000000000004
          </div>
          <div
            style={{
              padding: '8px 16px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            →
          </div>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              borderRadius: '4px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            {'"0.3"'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'GeistMono',
          data: boldFont,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
