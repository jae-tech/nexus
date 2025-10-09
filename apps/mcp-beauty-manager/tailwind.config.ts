import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 디자인 토큰 색상 시스템 준비
        // 예: primary, secondary, accent, neutral, semantic colors
      },
      spacing: {
        // 디자인 토큰 간격 시스템 준비
        // 예: 4px 기반 스케일 시스템
      },
      fontSize: {
        // 디자인 토큰 타이포그래피 시스템 준비
        // 예: heading, body, caption 등
      },
      fontWeight: {
        // 디자인 토큰 폰트 굵기 시스템 준비
      },
      lineHeight: {
        // 디자인 토큰 행간 시스템 준비
      },
      borderRadius: {
        // 디자인 토큰 둥근 모서리 시스템 준비
        // 예: sm, md, lg, xl
      },
      boxShadow: {
        // 디자인 토큰 그림자 시스템 준비
        // 예: elevation 1-5 레벨
      },
    },
  },
  plugins: [],
} satisfies Config
