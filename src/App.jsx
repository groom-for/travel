import { useEffect, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { useAuth, AppProviders } from "./contexts";
import "./App.css";
import "./styles/common.css";
import "./styles/header.css";
import { BackToTop, ContactModal } from "./components/common";
import { Header, Footer } from "./components/layout";
import AppRoutes from "./routes/AppRoutes";

const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { user, logout, addContactRequest } = useAuth();
  const navigate = useNavigate();

  const handleCategorySelect = (value) => {
    setCategoryFilter(value);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const entry = {
      id: `REQ-${Date.now()}`,
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      createdAt: new Date().toISOString(),
    };
    addContactRequest(entry);
    alert("문의가 접수되었습니다. AI 도우미가 곧 답변드릴게요!");
    setIsContactOpen(false);
    setContactForm({ name: user?.name ?? "", email: user?.email ?? "", message: "" });
  };

  useEffect(() => {
    if (user) {
      setContactForm((prev) => {
        const next = {
          ...prev,
          name: user.name ?? prev.name ?? "",
          email: user.email ?? prev.email ?? "",
        };
        if (next.name === prev.name && next.email === prev.email) {
          return prev;
        }
        return next;
      });
    } else {
      setContactForm((prev) => {
        if (prev.name === "" && prev.email === "" && prev.message === "") {
          return prev;
        }
        return { name: "", email: "", message: "" };
      });
    }
  }, [user]);

  return (
    <div className="app-wrapper">
        <Header
          user={user}
          onLogout={handleLogout}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategorySelect}
        />

        <main className="app-main">
          <AppRoutes
            searchTerm={searchTerm}
            selectedCategory={categoryFilter}
            onCategoryChange={handleCategorySelect}
          />
        </main>
        <Footer onContactOpen={() => setIsContactOpen(true)} />
        <ContactModal
          isOpen={isContactOpen}
          contactForm={contactForm}
          onClose={() => setIsContactOpen(false)}
          onChange={handleContactChange}
          onSubmit={handleContactSubmit}
        />
    </div>
  );
};

// [TASK] 글로벌 헤더 검색/필터 및 라우트 구성을 개선했습니다.
function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppContent />
        <BackToTop />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
