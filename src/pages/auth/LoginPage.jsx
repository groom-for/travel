import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CheckoutLayout from "../../components/layout/CheckoutLayout";
import "../../styles/auth.css";

const LoginPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillDemo = () => {
    setForm({ email: "demo@example.com", password: "Passw0rd!" });
    setInfo("예시 계정이 입력되었습니다. 디자인 확인용 화면입니다.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("로그인 폼 목업입니다. 현재는 디자인 확인용 화면입니다.");
    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      const destination = redirect ? decodeURIComponent(redirect) : "/account";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.message ?? "로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <div className="checkout-outer auth-outer">
        <h1 className="page-title">로그인</h1>
        <p className="page-subtitle">계정 정보를 입력하고 여행을 계속 이어가세요.</p>
        <div className="card checkout-inner auth-inner-card">
          {info ? <p className="auth-info">{info}</p> : null}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              이메일
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              비밀번호
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
            <button
              type="button"
              className="btn btn-secondary auth-outline-button"
              onClick={handleFillDemo}
            >
              예시 계정 자동입력
            </button>
          </form>
          <div className="auth-links">
            <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
          </div>
          <p className="auth-switch">
            아직 계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
          </p>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default LoginPage;
