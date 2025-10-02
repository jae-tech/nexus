// 패키지별 ESLint 오버라이드 예시
// 루트 .eslintrc.js 설정을 상속받아 확장

module.exports = {
  // 루트 설정 상속
  extends: ['../../.eslintrc.js'],

  // 이 패키지에만 적용할 환경 설정
  env: {
    browser: true,
    node: false, // 브라우저 전용 앱이면 node 비활성화
  },

  // 이 패키지에만 적용할 규칙 오버라이드
  rules: {
    // 예시: 이 앱에서는 console.log 허용
    'no-console': 'off',

    // 예시: 이 앱에서는 any 타입 에러로 처리
    '@typescript-eslint/no-explicit-any': 'error',

    // 예시: TailwindCSS 클래스 정렬 비활성화 (필요 시)
    // 'tailwindcss/classnames-order': 'off',
  },

  // 이 패키지 내에서 추가 무시 패턴
  ignorePatterns: [
    // 루트 설정의 무시 패턴 외 추가
    'src/generated/**',
  ],
};
