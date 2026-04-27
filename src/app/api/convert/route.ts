import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text?.trim()) {
      return NextResponse.json({ hira: '', ko: '' })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `다음 일본어 텍스트의 독음을 변환해줘. 반드시 아래 JSON 형식으로만 응답해. 다른 말은 절대 하지 마.

입력: ${text}

응답 형식:
{"hira":"히라가나 독음","ko":"한국어 발음 표기"}

규칙:
- hira: 한자를 히라가나로 변환. 이미 히라가나/카타카나는 그대로. 영어/숫자는 그대로.
- ko: 일본어 발음을 한국어로 표기. 예) この→코노, 世界→세카이, たくさん→타쿠산, かわいい→카와이이
- JSON만 출력, 마크다운 코드블록 없이`
      }]
    })

    const raw = (message.content[0] as { text: string }).text.trim()
    const result = JSON.parse(raw)
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '변환 실패' }, { status: 500 })
  }
}