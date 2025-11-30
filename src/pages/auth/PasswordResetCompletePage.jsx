import { Link, useLocation } from "react-router-dom";
import CheckoutLayout from "../../components/layout/CheckoutLayout";

// [목업] 비밀번호 재설정 안내 완료 페이지
const PasswordResetCompletePage = () => {
  const location = useLocation();
  const pendingEmail = location.state?.email ?? "입력하신 이메일";

  return (
    <CheckoutLayout>
      <div className="checkout-outer">
        <h1 className="checkout-title">비밀번호 재설정 안내</h1>
        <p className="checkout-desc">비밀번호 재설정 안내가 전송되었다고 가정하는 목업 화면입니다.</p>
        <div className="checkout-inner checkout-content-box">
          <p>{pendingEmail} 주소로 비밀번호 재설정 안내를 보냈습니다. (실제 메일 발송은 되지 않았습니다.)</p>
          <div className="checkout-footer">
            <Link className="order-primary" to="/login">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default PasswordResetCompletePage;
