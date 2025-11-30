import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import { CheckoutStepHeader } from "../components/checkout/CheckoutStepHeader";
import "../styles/orderSummary.css";

// [TASK] 주문 요약/결제 단계 UI와 주문 요청 로직을 구현했습니다.
const OrderSummaryPage = () => {
  const { cartItems, totals, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const formatCurrency = (value = 0) =>
    `${Number(value).toLocaleString("ko-KR")}원`;

  const handleProceedToPayment = () => {
    if (!isConfirmed) {
      setOrderError("주문 확인에 동의해주세요.");
      return;
    }
    if (!cartItems.length) {
      setOrderError("장바구니에 담긴 상품이 없습니다.");
      return;
    }

    setIsProcessing(true);
    setOrderError("");

    const orderInfo = {
      items: cartItems,
      totals,
      totalPrice,
    };

    navigate("/payment", { state: { orderInfo } });
    setIsProcessing(false);
  };

  if (!cartItems.length) {
    return (
      <CheckoutLayout>
        <CheckoutStepHeader currentStep="summary" />
        <div className="checkout-outer">
          <h1 className="page-title">주문서 작성</h1>
          <p className="page-subtitle">
            선택한 상품과 금액을 확인한 후 결제를 진행해 주세요.
          </p>
          <div className="card checkout-inner checkout-content-box">
            <p className="order-empty">
              장바구니가 비어 있습니다. 상품을 먼저 담아주세요.
            </p>
            <div className="checkout-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/")}
              >
                상품 살펴보기
              </button>
            </div>
          </div>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutStepHeader currentStep="summary" />
      <div className="checkout-outer">
        <h1 className="page-title">주문서 작성</h1>
        <p className="page-subtitle">
          선택한 상품과 금액을 확인한 후 결제를 진행해 주세요.
        </p>
        <div className="card checkout-inner checkout-content-box">
        <div className="order-items">
          {cartItems.map((item) => (
            <article key={item.id} className="order-item">
              <div>
                <h3>{item.name}</h3>
                <p className="order-item-desc">
                  인원: 성인 {item.counts.adult} · 어린이 {item.counts.child} · 유아{" "}
                  {item.counts.infant}
                </p>
                {item.selectedOptions?.length > 0 && (
                  <ul className="order-options">
                    {item.selectedOptions.map((option) => (
                      <li key={option.id}>
                        {option.label} (+{formatCurrency(option.extraPrice)})
                      </li>
                    ))}
                  </ul>
                )}
                {item.customSelections?.rental && (
                  <div className="order-rental-info">
                    <p>렌터카 옵션</p>
                    <ul>
                      <li>차량: {item.customSelections.rental.vehicleType}</li>
                      <li>
                        일정: {item.customSelections.rental.startDate || "-"} ~{" "}
                        {item.customSelections.rental.endDate || "-"}
                      </li>
                      <li>보험: {item.customSelections.rental.insurance}</li>
                      <li>
                        네비게이션: {item.customSelections.rental.navigation}
                      </li>
                      <li>
                        반납:{" "}
                        {item.customSelections.rental.returnLocation === "different"
                          ? "다른 지점 반납"
                          : "동일 지점 반납"}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <strong>{formatCurrency(item.totalPrice)}</strong>
            </article>
          ))}
        </div>
        <div className="order-totals">
          <div>
            <span>상품 금액</span>
            <strong>{formatCurrency(totals.productsTotal)}</strong>
          </div>
          <div>
            <span>옵션 금액</span>
            <strong>{formatCurrency(totals.optionsTotal)}</strong>
          </div>
          <div>
            <span>좌석/교통 추가금</span>
            <strong>{formatCurrency(totals.seatExtraTotal)}</strong>
          </div>
          <div className="order-totals-total">
            <span>총 결제 금액</span>
            <strong>{formatCurrency(totalPrice)}</strong>
          </div>
        </div>
          <label className="order-confirm">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(event) => setIsConfirmed(event.target.checked)}
            />
            위 주문 내용을 모두 확인했습니다.
          </label>
          {orderError && <p className="order-error">{orderError}</p>}
          <div className="checkout-footer order-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/cart")}
            >
              장바구니로 돌아가기
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProceedToPayment}
              disabled={!isConfirmed || isProcessing}
            >
              {isProcessing ? "이동 중..." : "결제 정보 입력하기"}
            </button>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default OrderSummaryPage;
