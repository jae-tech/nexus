import nexusConfig from "@nexus/eslint-config";

export default [
  ...nexusConfig,
  {
    // 프로젝트별 추가 설정
    rules: {
      // 필요시 프로젝트별 규칙 오버라이드
    },
  },
];