const steps = ["장바구니", "주문서 작성", "결제", "완료"];

export function CheckoutStepHeader({ currentStep }) {
  return (
    <div className="checkout-steps">
      {steps.map((label, index) => {
        const stepKey =
          index === 0
            ? "cart"
            : index === 1
            ? "summary"
            : index === 2
            ? "payment"
            : "complete";

        const isActive = stepKey === currentStep;

        return (
          <div
            key={stepKey}
            className={`checkout-step ${isActive ? "active" : ""}`}
          >
            <span className="checkout-step-index">{index + 1}</span>
            <span className="checkout-step-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
