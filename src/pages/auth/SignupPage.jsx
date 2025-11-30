import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CheckoutLayout from "../../components/layout/CheckoutLayout";
import "../../styles/auth.css";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    "회원가입 폼입니다. 현재는 백엔드 연동 전이라 실제 가입은 되지 않습니다."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillDemo = () => {
    setForm({
      name: "홍길동",
      email: "newuser@example.com",
      password: "NewUser123!",
      confirmPassword: "NewUser123!",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/signup-complete", { replace: true });
    } catch (err) {
      setError(err?.message ?? "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <div className="checkout-outer auth-outer">
        <h1 className="page-title">회원가입</h1>
        <p className="page-subtitle">간단한 정보로 계정을 만들어 보세요.</p>
        <div className="card checkout-inner auth-inner-card">
          {info ? <p className="auth-info">{info}</p> : null}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              이름 또는 닉네임
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
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
            <label>
              비밀번호 확인
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
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
              {isSubmitting ? "가입 중..." : "회원가입"}
            </button>
            <button
              type="button"
              className="btn btn-secondary auth-outline-button"
              onClick={handleFillDemo}
            >
              예시 정보 자동입력
            </button>
          </form>
          <p className="auth-switch">
            이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
          </p>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default SignupPage;
