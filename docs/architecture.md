# 여행 상품 서비스 설계 개요

## 라우트 구조
- `/` – `ProductsPage`: 검색/필터 가능한 상품 리스트와 반응형 카드 UI.
- `/product/:id` – `ProductDetailPage`: 상세 설명, 옵션, 수량 선택 및 장바구니 모달.
- `/cart` – `CartPage`: 수량 조절/삭제/요약을 제공하는 장바구니.
- `/order-summary` – `OrderSummaryPage`: 단계 표시, 금액 합계, 주문 확인/요청 처리.
- `/order-complete` – `OrderCompletePage`: 주문 번호 및 초기화 버튼 제공.

## 주요 페이지 & 컴포넌트 트리
- `App`
  - `Header/Nav` (검색 토글, 지역 필터, 내비게이션 링크)
  - `Routes`
    - `ProductsPage`
      - `ProductCard`(반복) – 이미지, 가격, CTA
    - `ProductDetailPage`
      - 이미지/본문/교통 정보/옵션/장바구니 섹션
      - 장바구니 완료 모달
    - `CartPage`
      - `cart-list` (수량 조절 스텝퍼 포함)
      - `cart-summary` (금액 상세)
    - `OrderSummaryPage`
      - `order-items` 목록
      - `order-totals`
      - 확인 체크박스 + CTA
    - `OrderCompletePage`
      - 주문 번호, 금액, 홈 이동 버튼

## Context API (CartContext)
- 상태 구조
  - `cartItems`: `{ id, name, counts, selectedOptions, transportSelection, pricingSource, totals, totalPrice }[]`
  - `totals`: `{ productsTotal, optionsTotal, seatExtraTotal, grandTotal }`
  - `totalPrice`: `totals.grandTotal` 별칭
- 제공 함수
- `addToCart(product, options, counts, transportSelection, customSelections?)`
  - `updateItemCount(itemId, type, newCount)`
  - `toggleItemOption(itemId, optionId)`
  - `removeFromCart(itemId)`
  - `clearCart()`
- 사용 위치
  - `ProductsPage`는 검색만 담당 (context 미사용)
  - `ProductDetailPage` → `addToCart`, 장바구니 모달
  - `CartPage` → `cartItems`, `totals`, `updateItemCount`, `removeFromCart`, `clearCart`
  - `OrderSummaryPage` → `cartItems`, `totals`, `totalPrice`, `clearCart` (주문 확정)
  - `OrderCompletePage` → `clearCart` (보호적 초기화)
