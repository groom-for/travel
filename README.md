🧭 여행 상품 판매 서비스 (Travel Booking Service)

React 기반으로 구현한 여행 상품 커머스 웹 서비스입니다.
상품 조회 → 상세 → 장바구니 → 주문서 → 결제 완료까지의 기본 커머스 흐름을 구현했습니다.
현재 프론트엔드 개발이 완료되었으며, AWS 배포 단계는 팀원이 담당 예정입니다.

🚀 주요 기능

✔ 상품 리스트 페이지
여행 상품 목록 카드 UI
검색 기능
카테고리 필터
가격 범위 필터
가격 정렬 기능
모바일/데스크탑 반응형 필터 UI

✔ 상품 상세 페이지
큰 이미지 + 상품 설명
옵션 구성
장바구니 담기

✔ 장바구니 (Context API)
담기/삭제
옵션 수량 변경
총 금액 계산
Context API 기반 전역 상태 관리

✔ 주문서 & 결제
사용자 정보 입력
주문 금액 최종 확인
결제 완료 페이지

✔ 테스트 자동화 (Vitest)
CartContext 테스트
ProductsPage 테스트
CheckoutFlow 전체 흐름 테스트

🗂 기술 스택

Frontend
- React
- React Router
- Context API
- CSS
- Vitest

Backend (현재 mock)
- REST API 구조 기반 Mock 데이터
- 추후 Spring Boot 연동 가능

Deploy
- AWS S3 (정적 사이트 호스팅)
- AWS CloudFront (CDN)
- 🚧 AWS 배포는 팀원이 진행 예정

🧩 프로젝트 구조
```
📦 src
 ┣ 📂 components
 ┃ ┣ 📂 products
 ┃ ┣ 📂 cart
 ┃ ┗ 📂 common
 ┣ 📂 contexts
 ┣ 📂 pages
 ┣ 📂 api
 ┣ 📂 styles
 ┗ 📂 tests
```

💡 팀 작업 분담
👩‍💻 프론트엔드

전체 페이지 UI 개발
React 환경 세팅
상품 리스트 및 상세 UI 구성
Context API 장바구니 로직
주문/결제 화면 개발
검색 및 필터 기능 완성
테스트 자동화 (Vitest)
반응형 디자인
GitHub 업로드

👨‍💻 팀원 (AWS & Backend 담당)
AWS S3 + CloudFront 배포
(선택) Spring Boot REST API 연동
(선택) 로그인/회원 기능 추가
배포 문서 / 환경 변수 정리
프로젝트 정리 
발표자료 정리 

📝 실행 방법
npm install
npm start

🌐 AWS 배포 URL
🚧 팀원이 배포하면 링크를 여기에 추가할 예정입니다.

🎉 마무리
이 프로젝트는
React 기반 커머스의 전형적인 흐름 + 상태관리 + 테스트 + 필터 기능까지 포함한
풀스택 실습 프로젝트입니다.

프론트엔드는 완료된 상태이며,
AWS 배포 및 백엔드 연동은 팀원의 작업 후 업데이트될 예정입니다.


---


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Testing

- Run `npm test` to execute the Vitest suite that covers the basic product list rendering, cart context calculations, and checkout flow navigation.
- Use `npm run test:ui` when you want to launch the Vitest UI runner, which provides interactive filtering of the existing tests.
