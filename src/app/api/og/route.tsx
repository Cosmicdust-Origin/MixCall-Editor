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
          background: 'radial-gradient(circle at center, #1a0000 0%, #000000 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
        }}
      >
        {/* 스포트라이트 효과 */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          width: '800px',
          height: '900px',
          marginLeft: '-400px',
          background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.15), transparent 70%)',
          display: 'flex',
        }} />

        {/* 좌측 하단 글로우 */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.12), transparent 70%)',
          display: 'flex',
        }} />

        {/* 우측 상단 글로우 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.1), transparent 70%)',
          display: 'flex',
        }} />

        {/* 브랜드명 */}
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '48px',
          fontSize: '28px',
          fontWeight: 600,
          opacity: 0.9,
          display: 'flex',
        }}>
          📣 믹스콜 에디터
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '20px',
        }}>
          {artist && (
            <div style={{
              fontSize: '40px',
              fontWeight: 600,
              opacity: 0.7,
              letterSpacing: '2px',
              display: 'flex',
            }}>
              {artist}
            </div>
          )}

          <div style={{
            fontSize: title.length > 15 ? '80px' : '110px',
            fontWeight: 800,
            letterSpacing: '4px',
            color: 'white',
            textShadow: '0 0 40px rgba(239,68,68,0.9)',
            display: 'flex',
            textAlign: 'center',
            lineHeight: 1.1,
          }}>
            {title}
          </div>

          {author && (
            <div style={{
              fontSize: '30px',
              opacity: 0.85,
              display: 'flex',
              marginTop: '8px',
            }}>
              🔖 콜/믹스표 by {author}
            </div>
          )}
        </div>

        {/* 하단 URL */}
        <div style={{
          position: 'absolute',
          bottom: '28px',
          fontSize: '22px',
          opacity: 0.3,
          letterSpacing: '1px',
          display: 'flex',
        }}>
          mix-call-editor.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}