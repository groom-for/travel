import { Link } from "react-router-dom";
import "../../styles/footer.css";

function Footer({ onContactOpen }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-title">DeepDive Travel</p>
          <p className="footer-copy">
            © {new Date().getFullYear()} DeepDive Travel. All rights reserved.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/account">내 정보</Link>
          <Link to="/cart">장바구니</Link>
          <button type="button" onClick={onContactOpen}>
            문의하기
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
