import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import { CheckoutStepHeader } from "../components/checkout/CheckoutStepHeader";
import "../styles/orderComplete.css";

// [TASK] 주문 완료 페이지와 상태 초기화 플로우를 구현했습니다.
const OrderCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const orderId = location.state?.orderId ?? `ORD-${Date.now()}`;
  const totalPrice = location.state?.totalPrice ?? 0;
  const orderedItems = location.state?.items ?? [];

  useEffect(() => {
    // 주문 완료 페이지에 진입한 시점에 장바구니를 비워 안전하게 초기화합니다.
    clearCart();
  }, [clearCart]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <CheckoutLayout>
      <CheckoutStepHeader currentStep="complete" />
      <div className="checkout-outer">
        <h1 className="page-title">결제가 완료되었습니다.</h1>
        <p className="page-subtitle">주문해 주셔서 감사합니다.</p>
        <div className="card checkout-inner checkout-content-box order-complete-card">
          <div className="order-complete-info">
            <div>
              <span>주문 번호</span>
              <strong>{orderId}</strong>
            </div>
            <div>
              <span>결제 금액</span>
              <strong>{totalPrice.toLocaleString("ko-KR")}원</strong>
            </div>
          </div>
          {orderedItems.length ? (
            <div className="order-complete-summary">
              <p>주요 상품 및 옵션</p>
              <ul>
                {orderedItems.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <span className="order-item-name">{item.name}</span>
                    {item.selectedOptions?.length ? (
                      <ul className="order-item-options">
                        {item.selectedOptions.map((option) => (
                          <li key={option.id}>{option.label}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
                {orderedItems.length > 2 && (
                  <li>외 {orderedItems.length - 2}건</li>
                )}
              </ul>
            </div>
          ) : null}
          <div className="checkout-footer order-complete-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGoHome}
            >
              계속 쇼핑하기
            </button>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default OrderCompletePage;
