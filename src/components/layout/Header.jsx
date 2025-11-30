import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const categoryOptions = [
  { id: "all", label: "전체" },
  { id: "domestic", label: "국내여행" },
  { id: "overseas", label: "해외여행" },
  { id: "rental-tour", label: "렌터카&투어" },
  { id: "package", label: "패키지" },
];

const Header = ({
  searchTerm,
  onSearchTermChange,
  categoryFilter,
  onCategoryChange,
  user,
  onLogout,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
    setIsCategoryOpen(false);
  };

  const handleCategoryToggle = () => {
    setIsCategoryOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (value) => {
    onCategoryChange(value);
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleHamburgerClick = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsCategoryOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    closeMobileMenu();
  };

  return (
    <>
      <header className="app-header">
        <nav className="navbar">
          <button
            type="button"
            className={`nav-hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={handleHamburgerClick}
            aria-label="모바일 메뉴 열기"
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="nav-logo">
            DeepDive Travel
          </Link>
          <div className="nav-desktop">
            <div className="nav-search-desktop">
              <input
                type="search"
                placeholder="여행지, 테마 검색"
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
              />
            </div>
            <div className="nav-icon-group">
              <Link
                to="/"
                className={`nav-icon ${isCategoryOpen ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleCategoryToggle();
                }}
              >
                <span className="icon-circle">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 16l10-6 10 6" />
                    <path d="M2 8l10-6 10 6" />
                    <path d="M2 8v8l10 6 10-6V8" />
                  </svg>
                </span>
                <span className="nav-icon-label">리스트</span>
              </Link>
              <Link to="/cart" className="nav-icon nav-icon-cart">
                <span className="icon-circle">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                    <path d="M6 6L5 2H2" />
                  </svg>
                </span>
                <span className="nav-icon-label">장바구니</span>
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                className="nav-icon nav-icon-account"
                onClick={() => user && setIsMobileMenuOpen(false)}
              >
                <span className="icon-circle">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="nav-icon-label">{user ? "내 정보" : "로그인"}</span>
              </Link>
            </div>
          </div>
          <div className="nav-mobile-actions">
            <button
              type="button"
              className="nav-search-trigger"
              onClick={handleSearchToggle}
              aria-label="검색 열기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link to="/cart" className="nav-mobile-cart" aria-label="장바구니 페이지 이동">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M6 6L5 2H2" />
              </svg>
            </Link>
          </div>
        </nav>
        <div className={`nav-search-panel ${isSearchOpen ? "open" : ""}`}>
          <div className="nav-search-panel-inner">
            <input
              type="search"
              placeholder="여행지, 테마 검색"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
            <button
              type="button"
              className="nav-search-close"
              onClick={() => setIsSearchOpen(false)}
              aria-label="검색 닫기"
            >
              닫기
            </button>
          </div>
        </div>
        {isCategoryOpen && (
          <div className="category-dropdown">
            {categoryOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={
                  option.id === categoryFilter ? "category-option active" : "category-option"
                }
                onClick={() => handleCategorySelect(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`} onClick={closeMobileMenu}>
          <div className="mobile-menu-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-auth-row">
              {user ? (
                <>
                  <Link className="mobile-auth-link" to="/account" onClick={closeMobileMenu}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {user.name ?? user.email ?? "회원"}님
                  </Link>
                  <button type="button" className="mobile-auth-link" onClick={handleLogoutClick}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 16l4-4-4-4" />
                      <path d="M3 12h18" />
                      <path d="M7 12v8" />
                    </svg>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link className="mobile-auth-link" to="/login" onClick={closeMobileMenu}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    로그인
                  </Link>
                  <span className="mobile-auth-divider" />
                  <Link className="mobile-auth-link" to="/signup" onClick={closeMobileMenu}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                    회원가입
                  </Link>
                </>
              )}
            </div>
            <div className="mobile-menu-links">
              <Link to="/cart" className="mobile-nav-item" onClick={closeMobileMenu}>
                <span className="mobile-nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                장바구니
              </Link>
              <div className="mobile-menu-divider" />
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleCategorySelect("all")}
              >
                <span className="mobile-nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </span>
                전체 여행상품
              </button>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleCategorySelect("domestic")}
              >
                <span className="mobile-nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 11l9-9 9 9" />
                    <path d="M4 10v10a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1V10" />
                  </svg>
                </span>
                국내 여행
              </button>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleCategorySelect("overseas")}
              >
                <span className="mobile-nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                  </svg>
                </span>
                해외 여행
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

