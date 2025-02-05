# BOJ Tester

BOJ Tester는 [백준 온라인 저지(BOJ)](https://www.acmicpc.net)의 문제를 더욱 효율적으로 풀 수 있도록 도와주는 Visual Studio Code 확장 프로그램입니다.
이 확장 기능을 사용하면 vs code 안에서 **문제 파일을 열고**, **문제 정보를 확인하며**, **테스트 케이스 실행,추가,수정,삭제** 및 **코드 제출**을 쉽게 할 수 있습니다.

## 주요 기능
![사용 예](https://github.com/user-attachments/assets/7a163b5f-3525-4a39-97d7-84217c5e3a0d)

### 1. VS Code 안에서 문제 보기
- 문제 번호로 된 파일을 열고 “문제 보기” 버튼을 클릭하면, 오른쪽 패널에 해당 문제의 정보를 띄워줍니다.
- 파일 이름이 문제 번호가 아닐 경우, 직접 문제 번호를 입력하여 문제 정보를 확인할 수 있습니다.

### 2. 테스트 케이스 실행
- 작성한 코드를 파일 확장자에 맞는 언어로 실행하여 테스트할 수 있습니다.
- 단일 테스트 케이스 실행 및 전체 테스트 케이스 실행 기능을 제공합니다.
#### 지원 언어
`python`, `java`, `java script`, `c++`, `c`, `c#`, `kotlin`, `swift`

### 3. 테스트 케이스 추가하기
- 문제에서 기본으로 제공하는 테스트 케이스 외에 다양한 테스트 케이스를 임의로 추가할 수 있습니다.
- 추가한 테스트 케이스의 값은 수정 및 삭제가 가능합니다.
![화면 기록 2025-01-31 오후 7 48 13](https://github.com/user-attachments/assets/0368085c-b8a3-4563-ad36-70295f14cc03)

### 4. IDE 기능 비활성화
- 대부분의 코딩테스트에서는 IDE 의 기능을 사용할 수 없습니다. 
- 이에 대비하여 연습할 수 있도록 IDE 기능을 비활성화 할 수 있습니다.

### 5. 코드 제출 기능
- “제출하기” 버튼을 클릭하면 BOJ 제출 창이 열리며, 코드가 클립보드에 자동으로 복사됩니다.
- 제출 페이지에서 손쉽게 코드를 붙여넣고 제출할 수 있습니다.

### 6. 문제 파일 생성
- “문제 파일 생성” 버튼을 클릭하고 문제 번호를 입력하면, 해당 번호의 문제 파일을 자동으로 생성합니다.
- 생성된 문제 파일을 자동으로 열고 문제 정보를 띄워줍니다.

## 요구 사항

BOJ Tester를 사용하려면 해당 프로그래밍 언어의 실행 환경이 필요합니다:




## Extension Settings
BOJ Tester는 다음과 같은 설정을 제공합니다:

* `BOJ-Tester.defaultLanguage`: 문제 파일 생성 시 사용할 기본 확장자 (예: py, java, cpp)
### 설정 방법
1. BOJ Tester 사이드바 열기
2. 사이드바의 제목 오른쪽에 위치한 톱니바퀴 아이콘 클릭
3. 설정창에서 설정 변경

## 알려진 문제

- BOJ 서버가 다운되었거나 네트워크 연결이 불안정한 경우 문제 정보 보기 기능이 원활하지 않을 수 있습니다.
- 테스트 케이스 실행 중 지원되지 않는 확장자를 사용할 경우 오류가 발생할 수 있습니다.

## 개발자
- [koomin1227](https://github.com/koomin1227)

## 문의 및 피드백

문제가 발생하거나 개선이 필요한 사항이 있다면 아래의 링크를 통해 문의해 주세요.
- GitHub 이슈 등록: [GitHub Issues](https://github.com/koomin1227/BOJ-Tester/issues)
- email : koomin1227@naver.com

**Enjoy BOJ Tester! 🚀**
