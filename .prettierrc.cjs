// Prettier 3.x 최신 설정
module.exports = {
  // 기본 포맷팅 옵션
  semi: true, // 세미콜론 사용
  singleQuote: true, // 작은따옴표 사용
  tabWidth: 2, // 탭 너비 2칸
  useTabs: false, // 스페이스 사용 (탭 사용 안 함)
  trailingComma: 'es5', // ES5 호환 trailing comma (객체, 배열)
  printWidth: 80, // 한 줄 최대 길이 80자
  bracketSpacing: true, // 중괄호 내부 공백 { foo: bar }
  arrowParens: 'always', // 화살표 함수 매개변수 괄호 항상 사용 (x) => x
  endOfLine: 'lf', // 줄바꿈 형식 LF

  // JSX 옵션
  jsxSingleQuote: false, // JSX에서는 큰따옴표 사용
  bracketSameLine: false, // JSX 닫는 태그 다음 줄에 위치

  // 파일별 설정 오버라이드
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120, // JSON 파일은 길게
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always', // 마크다운 줄바꿈
      },
    },
  ],

  // Tailwind CSS 플러그인 설정
  plugins: ['prettier-plugin-tailwindcss'],
};
