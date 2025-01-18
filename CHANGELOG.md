# Change Log

All notable changes to the "boj-tester" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.
## Folder Architecture
```
project-root/
├── src/
│   ├── commands/        # 명령 관련 로직
│   ├── providers/       # TreeDataProvider 등 데이터 제공자
│   ├── panels/          # Webview 로직 분리
│   ├── utils/           # 유틸리티 함수 (공통 로직)
│   ├── extension.ts     # 메인 진입점 (activate 함수)
│   └── types.ts         # 타입 정의
├── media/               # Webview 관련 정적 파일 (HTML, CSS, JS, 이미지)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── package.json          # 확장 정의
├── tsconfig.json         # TypeScript 설정
└── README.md             # 프로젝트 설명
```
## [Unreleased]

- Initial release