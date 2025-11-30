import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import { CheckoutStepHeader } from "../components/checkout/CheckoutStepHeader";
import "../styles/cart.css";

// [TASK] 장바구니 UI/디자인과 수량 조정 기능을 보완했습니다.
const CartPage = () => {
  const {
    cartItems,
    totals,
    totalPrice,
    updateItemCount,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    setSelectedIds(new Set(cartItems.map((item) => item.id)));
  }, [cartItems]);

  const handleMoveToSummary = () => {
    if (!cartItems.length) {
      window.alert("담긴 상품이 없습니다.");
      return;
    }
    navigate("/order-summary");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const formatCurrencyText = (value = 0) =>
    `${Number(value).toLocaleString("ko-KR")}원`;

  const renderCurrencyHighlight = (value = 0) => (
    <span className="currency-highlight">
      <span className="currency-number">
        {Number(value).toLocaleString("ko-KR")}
      </span>
      <span className="currency-unit">원</span>
    </span>
  );

  const getUnitPrice = (item, type) => {
    const count = item.counts?.[type] ?? 0;
    const subtotal = item.totals?.typeTotals?.[type];
    if (count > 0 && subtotal) {
      return subtotal / count;
    }
    const pricesByType = item.pricingSource?.pricesByType ?? {};
    if (type === "adult") {
      return pricesByType.adult ?? item.pricingSource?.basePrice ?? 0;
    }
    return pricesByType[type] ?? 0;
  };

  const getTotalTravelerCount = (counts = {}) =>
    (counts.adult ?? 0) + (counts.child ?? 0) + (counts.infant ?? 0);

  const renderTypeLine = (item, type, label) => {
    const count = item.counts?.[type] ?? 0;
    const unit = getUnitPrice(item, type);
    const hasPricing =
      typeof item.pricingSource?.pricesByType?.[type] !== "undefined" ||
      (type === "adult" && (item.pricingSource?.basePrice ?? 0) > 0) ||
      count > 0;
    if (!hasPricing) return null;
    const subtotal = item.totals?.typeTotals?.[type] ?? unit * count;
    return (
      <div
        key={type}
        className={`cart-quantity-row ${
          type === "infant" ? "cart-quantity-row-infant" : ""
        }`}
      >
        <div className="cart-breakdown-line">
          {label} {count}명 × {formatCurrencyText(unit)} =
        </div>
        <div className="cart-quantity-controls">
          <button
            type="button"
            onClick={() =>
              updateItemCount(item.id, type, Math.max(0, count - 1))
            }
          >
            −
          </button>
          <span>{count}</span>
          <button
            type="button"
            onClick={() => updateItemCount(item.id, type, count + 1)}
          >
            +
          </button>
        </div>
        <span className="cart-breakdown-amount">
          {renderCurrencyHighlight(subtotal)}
        </span>
      </div>
    );
  };

  return (
    <CheckoutLayout>
      <CheckoutStepHeader currentStep="cart" />
      <div className="checkout-outer">
        <div className="cart-header">
          <div>
            <h1 className="checkout-title">장바구니</h1>
            <p className="checkout-desc">
              담아둔 상품을 확인하고 수량과 옵션을 조정해 주세요.
            </p>
          </div>
        </div>
        {cartItems.length === 0 ? (
          <div className="checkout-inner checkout-content-box">
            <p className="cart-empty">장바구니가 비어 있어요.</p>
            <div className="checkout-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinueShopping}
              >
                계속 쇼핑하기
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <section className="cart-card cart-list-card">
              <div className="cart-card-header">
                <h2>선택 상품 리스트</h2>
                <div className="cart-card-toolbar">
                  <label className="cart-select-all">
                    <input
                      type="checkbox"
                      checked={
                        cartItems.length > 0 &&
                        cartItems.every((item) => selectedIds.has(item.id))
                      }
                      onChange={() => {
                        const allSelected =
                          cartItems.length > 0 &&
                          cartItems.every((item) => selectedIds.has(item.id));
                        if (allSelected) {
                          setSelectedIds(new Set());
                        } else {
                          setSelectedIds(new Set(cartItems.map((item) => item.id)));
                        }
                      }}
                    />
                    <span>전체 선택</span>
                  </label>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm cart-clear"
                    onClick={clearCart}
                  >
                    <span>전체 삭제</span>
                  </button>
                </div>
              </div>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <article key={item.id} className="cart-item">
                    <div className="cart-item-header">
                      <div className="cart-item-title">
                        <label className="cart-item-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => {
                              setSelectedIds((prev) => {
                                const next = new Set(prev);
                                if (next.has(item.id)) next.delete(item.id);
                                else next.add(item.id);
                                return next;
                              });
                            }}
                          />
                        </label>
                        <h3>{item.name}</h3>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm cart-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        삭제
                      </button>
                    </div>
                    <div className="cart-item-body">
                      <p className="cart-item-path">
                        {item.transportSelection
                          ? item.transportSelection.departureAirport
                            ? `${item.transportSelection.departureAirport} → ${item.transportSelection.arrivalAirport}`
                            : `${item.transportSelection.departureStation} → ${item.transportSelection.arrivalStation}`
                          : "자유 일정"}
                      </p>
                      <div className="cart-item-breakdown">
                        {renderTypeLine(item, "adult", "성인")}
                        {renderTypeLine(item, "child", "어린이")}
                        {renderTypeLine(item, "infant", "유아")}
                      </div>
                      {item.selectedOptions?.length > 0 && (
                        <div className="cart-options">
                          <p>선택 옵션</p>
                          <ul>
                            {item.selectedOptions.map((option) => (
                          <li key={option.id} className="cart-option-line">
                            <span className="cart-option-text">
                                {option.label} (+{formatCurrencyText(option.extraPrice)}) × 총{" "}
                                <strong className="cart-option-em">
                                  {getTotalTravelerCount(item.counts)}명
                                </strong>{" "}
                                =
                              </span>
                              <span className="cart-option-amount">
                                {renderCurrencyHighlight(
                                  (option.extraPrice ?? 0) *
                                    getTotalTravelerCount(item.counts)
                                )}
                              </span>
                          </li>
                        ))}
                          </ul>
                        </div>
                      )}
                      {item.transportSelection && (
                        <div className="cart-train-info">
                          <p>
                            교통편: {item.transportSelection.transportType}
                            {item.transportSelection.selectedSeatClass?.label
                              ? ` · ${item.transportSelection.selectedSeatClass.label}`
                              : ""}
                          </p>
                          {item.transportSelection.selectedTime?.label && (
                            <p>시간: {item.transportSelection.selectedTime.label}</p>
                          )}
                        </div>
                      )}
                      {item.customSelections?.rental && (
                        <div className="cart-rental-info">
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
                      <p className="cart-item-total">
                        항목 총 금액 :{" "}
                        <strong>{renderCurrencyHighlight(item.totalPrice)}</strong>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="cart-summary cart-card">
              <h2>결제 예상 금액</h2>
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>상품 금액</span>
                  <strong>{renderCurrencyHighlight(totals.productsTotal)}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>옵션 금액</span>
                  <strong>{renderCurrencyHighlight(totals.optionsTotal)}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>좌석/교통 추가금</span>
                  <strong>{renderCurrencyHighlight(totals.seatExtraTotal)}</strong>
                </div>
                <div className="cart-summary-row cart-summary-total">
                  <span>총 금액</span>
                  <strong>{renderCurrencyHighlight(totalPrice)}</strong>
                </div>
              </div>
              <div className="checkout-footer cart-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleContinueShopping}
                >
                  계속 쇼핑하기
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleMoveToSummary}
                >
                  주문서 작성하기
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </CheckoutLayout>
  );
};

export default CartPage;
