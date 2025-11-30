import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutLayout from "../../components/layout/CheckoutLayout";
import "../../styles/auth.css";

// [TASK] 비밀번호 찾기 목업 페이지
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setEmail("user@example.com");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    navigate("/password-reset-complete", { replace: true, state: { email } });
  };

  return (
    <CheckoutLayout>
      <div className="checkout-outer auth-outer">
        <h1 className="page-title">비밀번호 찾기</h1>
        <p className="page-subtitle">
          가입할 때 사용한 이메일을 입력하면 비밀번호 재설정 안내를 보내는 것처럼 동작하는 목업
          화면입니다.
        </p>
        <div className="card checkout-inner auth-inner-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              이메일
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary btn-lg auth-submit">
              비밀번호 재설정 링크 보내기
            </button>
            <button
              type="button"
              className="btn btn-secondary auth-outline-button"
              onClick={handleDemoFill}
            >
              예시 이메일 자동입력
            </button>
          </form>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default ForgotPasswordPage;
