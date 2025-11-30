import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/account.css";

// [목업] 로그인 완료/내 정보 페이지
const AccountPage = () => {
  const {
    user,
    logout,
    orderHistory,
    removeOrderHistory,
    contactRequests,
    removeContactRequest,
  } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name ?? user?.email ?? "회원";
  const [activeTab, setActiveTab] = useState("orders");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRemoveOrder = (orderId) => {
    if (window.confirm("이 결제 내역을 삭제하시겠습니까?")) {
      removeOrderHistory(orderId);
    }
  };
  const handleRemoveContact = (requestId) => {
    if (window.confirm("이 문의 내역을 삭제하시겠습니까?")) {
      removeContactRequest(requestId);
    }
  };

  const formatCurrency = (value = 0) => `${Number(value).toLocaleString("ko-KR")}원`;
  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <main className="checkout-layout">
      <div className="checkout-outer">
        <h1 className="page-title">내 정보</h1>
        <p className="page-subtitle">
          로그인 완료 상태를 가정한 목업 UI입니다. 여행 내역 및 개인 정보를 확인하는 화면을
          디자인할 수 있습니다.
        </p>
        <div className="account-sections">
          <section className="card checkout-inner checkout-content-box account-info">
            <p>
              {displayName} 님, 환영합니다! (목업) <br />
              곧 여행 일정, 예약 내역 등을 이곳에서 확인할 수 있게 될 예정입니다.
            </p>
            <div className="checkout-footer">
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                로그아웃
              </button>
              <Link className="btn btn-primary" to="/">
                메인으로 돌아가기
              </Link>
            </div>
          </section>
          <section className="card checkout-inner checkout-content-box account-records">
            <div className="account-tabs">
              <button
                type="button"
                className={activeTab === "orders" ? "account-tab active" : "account-tab"}
                onClick={() => setActiveTab("orders")}
              >
                결제 내역
              </button>
              <button
                type="button"
                className={activeTab === "contacts" ? "account-tab active" : "account-tab"}
                onClick={() => setActiveTab("contacts")}
              >
                문의 내역
              </button>
            </div>
            {activeTab === "orders" ? (
              orderHistory?.length ? (
                <ul className="account-orders-list">
                  {orderHistory.map((order) => (
                    <li key={order.orderId} className="account-order-item">
                      <div className="account-order-top">
                      <div className="account-order-header">
                        <span className="account-order-id">{order.orderId}</span>
                        <span className="account-order-divider" aria-hidden="true">
                          |
                        </span>
                        <div className="account-order-date-wrap">
                          <span className="account-order-date">
                            {formatDateTime(order.orderDate)}
                          </span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm account-order-remove"
                            onClick={() => handleRemoveOrder(order.orderId)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      </div>
                      <div className="account-order-field account-order-products-row">
                        <span>상품명</span>
                        <ul className="account-order-products">
                          {(order.items?.length ? order.items : [{ id: "legacy", name: order.productTitle }]).map(
                            (item) => (
                              <li key={`${order.orderId}-${item.id}`} className="account-order-product-item">
                                {item.name}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <p className="account-order-field account-order-options">
                        <span>옵  션</span>
                        <strong>{order.optionsSummary}</strong>
                      </p>
                      <p className="account-order-field">
                        <span>결제액</span>
                        <strong>{formatCurrency(order.totalAmount)}</strong>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="account-orders-empty">아직 결제 내역이 없습니다.</p>
              )
            ) : contactRequests?.length ? (
              <ul className="account-contact-list">
                {contactRequests.map((item) => (
                  <li key={item.id} className="account-contact-item">
                    <div className="account-contact-header">
                      <div className="account-contact-info">
                        <span className="account-contact-name">{item.name}</span>
                        <span className="account-order-divider" aria-hidden="true">
                          |
                        </span>
                        <span className="account-contact-email">{item.email}</span>
                      </div>
                      <div className="account-contact-meta">
                        <span className="account-contact-date">{formatDateTime(item.createdAt)}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm account-order-remove"
                          onClick={() => handleRemoveContact(item.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className="account-contact-message">{item.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="account-orders-empty">아직 문의 내역이 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
