import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import { CheckoutStepHeader } from "../components/checkout/CheckoutStepHeader";
import "../styles/payment.css";

const emptyOrderInfo = {
  items: [],
  totals: { productsTotal: 0, optionsTotal: 0, seatExtraTotal: 0 },
  totalPrice: 0,
};

const initialFormState = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  phone: "",
  email: "",
  consent: false,
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totals, totalPrice } = useCart();
  const { user, addOrderHistory } = useAuth();
  const currentPathWithQuery = `${location.pathname}${location.search ?? ""}`;
  const fallbackOrderInfo = useMemo(() => {
    if (!cartItems.length) return null;
    return {
      items: cartItems,
      totals,
      totalPrice,
    };
  }, [cartItems, totals, totalPrice]);

  const orderInfo = location.state?.orderInfo ?? fallbackOrderInfo ?? emptyOrderInfo;

  useEffect(() => {
    if (!orderInfo.items?.length) {
      navigate("/order-summary", { replace: true });
    }
  }, [orderInfo.items?.length, navigate]);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const formatCurrency = (value = 0) =>
    `${Number(value).toLocaleString("ko-KR")}원`;

  const validate = () => {
    const nextErrors = {};
    if (!formData.cardName.trim()) nextErrors.cardName = "카드 소유자 이름을 입력해주세요.";
    if (!/^\d{12,19}$/.test(formData.cardNumber.replace(/\s+/g, ""))) {
      nextErrors.cardNumber = "카드 번호를 정확히 입력해주세요.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry.trim())) {
      nextErrors.expiry = "유효기간을 MM/YY 형식으로 입력해주세요.";
    }
    if (!/^\d{3,4}$/.test(formData.cvc.trim())) {
      nextErrors.cvc = "CVC 3~4자리를 입력해주세요.";
    }
    if (!/^\d{10,11}$/.test(formData.phone.trim())) {
      nextErrors.phone = "휴대폰 번호를 숫자만 입력해주세요.";
    }
    if (formData.email && !/.+@.+\..+/.test(formData.email)) {
      nextErrors.email = "이메일 형식이 올바르지 않습니다.";
    }
    if (!formData.consent) {
      nextErrors.consent = "결제 및 개인정보 처리에 동의해주세요.";
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFillTestData = () => {
    setFormData({
      cardName: "테스트 사용자",
      cardNumber: "4242424242424242",
      expiry: "12/29",
      cvc: "123",
      phone: "01012345678",
      email: "test@example.com",
      consent: true,
    });
    setErrors({});
  };

  const executePayment = async () => {
    setIsPaying(true);
    setPaymentError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const orderId = `ORD-${Date.now()}`;
      const summaryItems = orderInfo.items.map((item) => ({
        id: item.id,
        name: item.name,
        selectedOptions: item.selectedOptions ?? [],
      }));
      const firstProduct = summaryItems[0]?.name ?? "여행 상품";
      const optionLabels = summaryItems.flatMap((item) =>
        (item.selectedOptions ?? []).map((option) => option.label)
      );
      const optionsSummary = optionLabels.length
        ? optionLabels.join(", ")
        : "선택 옵션 없음";
      if (user) {
        addOrderHistory({
          orderId,
          orderDate: new Date().toISOString(),
          totalAmount: orderInfo.totalPrice,
          productTitle: firstProduct,
          optionsSummary,
          items: summaryItems,
        });
      }

      navigate("/order-complete", {
        state: {
          orderId,
          totalPrice: orderInfo.totalPrice,
          items: summaryItems,
          fromPayment: true,
        },
        replace: true,
      });
    } catch (error) {
      setPaymentError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isPaying) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!orderInfo.items?.length) {
      setPaymentError("결제할 주문 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    if (!user) {
      setShowPointModal(true);
      return;
    }

    executePayment();
  };

  const handleGuestPaymentProceed = () => {
    setShowPointModal(false);
    executePayment();
  };

  const handleAuthRedirect = () => {
    setShowPointModal(false);
    navigate(`/login?redirect=${encodeURIComponent(currentPathWithQuery)}`);
  };

  const highlightedItems = orderInfo.items?.slice(0, 2) ?? [];

  return (
    <CheckoutLayout>
      <CheckoutStepHeader currentStep="payment" />
      <div className="checkout-outer">
        <h1 className="page-title">결제 정보 입력</h1>
        <p className="page-subtitle">
          안전한 결제를 위해 카드 정보를 입력하고 약관에 동의해주세요.
        </p>
        <div className="card checkout-inner checkout-content-box payment-card payment-inner-narrow">
          <div className="card payment-summary">
            <div>
              <span>결제 금액</span>
              <strong>{formatCurrency(orderInfo.totalPrice)}</strong>
            </div>
            <div>
              <span>상품 요약</span>
              <p>
                {highlightedItems.length
                  ? highlightedItems.map((item) => item.name).join(", ")
                  : "선택된 상품이 없습니다."}
              </p>
            </div>
          </div>
          <form className="payment-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className="btn btn-secondary btn-sm payment-fill"
            onClick={handleFillTestData}
          >
            테스트용 정보 자동 입력
          </button>
          <div className="payment-field">
            <label htmlFor="cardName">카드 소유자 이름</label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="홍길동"
            />
            {errors.cardName && <p className="payment-error">{errors.cardName}</p>}
          </div>
          <div className="payment-field">
            <label htmlFor="cardNumber">카드 번호</label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234123412341234"
            />
            {errors.cardNumber && <p className="payment-error">{errors.cardNumber}</p>}
          </div>
          <div className="payment-field-row">
            <div className="payment-field">
              <label htmlFor="expiry">유효기간 (MM/YY)</label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="04/28"
              />
              {errors.expiry && <p className="payment-error">{errors.expiry}</p>}
            </div>
            <div className="payment-field">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                name="cvc"
                type="text"
                inputMode="numeric"
                value={formData.cvc}
                onChange={handleChange}
                placeholder="3자리"
              />
              {errors.cvc && <p className="payment-error">{errors.cvc}</p>}
            </div>
          </div>
          <div className="payment-field">
            <label htmlFor="phone">연락처</label>
            <input
              id="phone"
              name="phone"
              type="text"
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01012345678"
            />
            {errors.phone && <p className="payment-error">{errors.phone}</p>}
          </div>
          <div className="payment-field">
            <label htmlFor="email">이메일 (선택)</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <p className="payment-error">{errors.email}</p>}
          </div>
          <label className="payment-consent">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            결제 및 개인정보 처리에 동의합니다.
          </label>
          {errors.consent && <p className="payment-error">{errors.consent}</p>}
          {paymentError && <p className="payment-error">{paymentError}</p>}
          <div className="checkout-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/order-summary")}
            >
              주문서로 돌아가기
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg payment-submit"
              disabled={isPaying}
            >
              {isPaying ? "결제 처리 중..." : "결제하기"}
            </button>
          </div>
          </form>
        </div>
        {showPointModal ? (
          <div className="point-modal-overlay" role="presentation">
            <div className="point-modal" role="dialog" aria-modal="true">
              <h3>회원가입 후 결제하면 포인트가 적립됩니다.</h3>
              <p>
                지금 비회원으로 결제를 진행하실 수 있지만,
                회원가입 및 로그인 후 결제하시면 포인트 적립 혜택을 받으실 수 있습니다.
              </p>
              <div className="point-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleGuestPaymentProceed}
                >
                  결제 진행하기
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAuthRedirect}
                >
                  회원가입 및 로그인 후 결제하기
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </CheckoutLayout>
  );
};

export default PaymentPage;
