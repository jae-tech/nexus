// 루트 ESLint 설정 상속
import rootConfig from '../../eslint.config.js';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // 루트 설정 상속
  ...rootConfig,

  // 이 패키지 전용 규칙 추가
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 필요 시 추가 오버라이드
      // 'no-console': 'off',
    },
  },
];
