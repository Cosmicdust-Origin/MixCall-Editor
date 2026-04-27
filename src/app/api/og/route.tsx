import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || '콜표'
  const artist = searchParams.get('artist') || ''
  const author = searchParams.get('author') || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* 상단 빨간 바 */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '12px',
          background: '#ef4444',
        }} />

        {/* 로고 */}
        <div style={{
          position: 'absolute',
          top: '36px', left: '60px',
          fontSize: '28px',
          fontWeight: 900,
          color: '#ef4444',
          display: 'flex',
        }}>
          📣 믹스콜 에디터
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
          width: '100%',
        }}>
          {artist && (
            <div style={{
              fontSize: '40px',
              color: '#9ca3af',
              fontWeight: 600,
              display: 'flex',
            }}>
              {artist}
            </div>
          )}
          <div style={{
            fontSize: title.length > 15 ? '72px' : '90px',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.1,
            display: 'flex',
            textAlign: 'center',
          }}>
            {title}
          </div>
          {author && (
            <div style={{
              fontSize: '36px',
              color: '#6b7280',
              fontWeight: 500,
              display: 'flex',
            }}>
              콜표 by {author}
            </div>
          )}
        </div>

        {/* 하단 */}
        <div style={{
          position: 'absolute',
          bottom: '36px',
          fontSize: '22px',
          color: '#d1d5db',
          display: 'flex',
        }}>
          mix-call-editor.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}