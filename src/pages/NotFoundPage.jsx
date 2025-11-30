import { Link } from "react-router-dom";
import "../styles/notfound.css";

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
      <p className="page-subtitle">입력하신 주소가 올바른지 다시 한 번 확인해 주세요.</p>
      <div className="card notfound-card">
        <p className="notfound-message">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다. 메인 페이지에서 다시 이동해 주세요.
        </p>
        <Link to="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
