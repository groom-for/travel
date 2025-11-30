import { Link } from "react-router-dom";
import CheckoutLayout from "../../components/layout/CheckoutLayout";

// [목업] 회원가입 완료 안내 페이지
const SignupCompletePage = () => {
  return (
    <CheckoutLayout>
      <div className="checkout-outer">
        <h1 className="checkout-title">회원가입이 완료되었습니다</h1>
        <p className="checkout-desc">이제 여행 서비스를 이용하려면 로그인해 주세요. (목업 화면)</p>
        <div className="checkout-inner checkout-content-box">
          <p>
            가입 시 사용한 이메일로 안내 메일을 보내드렸습니다. 실제 메일 발송은 되지 않았지만, 디자인
            확인용 화면입니다.
          </p>
          <div className="checkout-footer">
            <Link className="order-primary" to="/login">
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default SignupCompletePage;
