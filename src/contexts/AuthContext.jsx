import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderStorageKey = "mockUserOrders";
  const contactStorageKey = "mockContactRequests";
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(orderStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("주문 내역 복원 실패", error);
      return [];
    }
  });
  const [contactRequests, setContactRequests] = useState(() => {
    try {
      const stored = localStorage.getItem(contactStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("문의 내역 복원 실패", error);
      return [];
    }
  });

  const handleAuthSuccess = useCallback((nextToken, member) => {
    setToken(nextToken);
    setUser(member);
    localStorage.setItem("authToken", nextToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  }, []);

  const createMockMember = useCallback(
    (email) => ({
      name: "목업 사용자",
      email,
    }),
    []
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error("이메일 또는 비밀번호를 확인해주세요.");
        }
        const data = await response.json();
        handleAuthSuccess(data.token, data.member);
        return data.member;
      } catch (error) {
        const mockMember = createMockMember(email);
        handleAuthSuccess("mock-token", mockMember);
        return mockMember;
      }
    },
    [handleAuthSuccess, createMockMember]
  );

  const signup = useCallback(async ({ name, email, password }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다. 입력값을 확인해주세요.");
      }
    } catch (error) {
      console.warn("회원가입 목업 처리", error);
    }
    return true;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setToken(stored);
    const fetchMe = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${stored}`,
          },
        });
        if (!response.ok) {
          throw new Error("인증 정보가 만료되었습니다.");
        }
        const member = await response.json();
        setUser(member);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, [logout]);

  useEffect(() => {
    try {
      localStorage.setItem(orderStorageKey, JSON.stringify(orderHistory));
    } catch (error) {
      console.warn("주문 내역 저장 실패", error);
    }
  }, [orderHistory, orderStorageKey]);
  useEffect(() => {
    try {
      localStorage.setItem(contactStorageKey, JSON.stringify(contactRequests));
    } catch (error) {
      console.warn("문의 내역 저장 실패", error);
    }
  }, [contactRequests, contactStorageKey]);

  const addOrderHistory = useCallback((entry) => {
    setOrderHistory((prev) => [entry, ...prev]);
  }, []);

  const removeOrderHistory = useCallback((orderId) => {
    setOrderHistory((prev) => prev.filter((order) => order.orderId !== orderId));
  }, []);
  const addContactRequest = useCallback((entry) => {
    setContactRequests((prev) => [entry, ...prev]);
  }, []);
  const removeContactRequest = useCallback((requestId) => {
    setContactRequests((prev) => prev.filter((item) => item.id !== requestId));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
      orderHistory,
      contactRequests,
      addOrderHistory,
      removeOrderHistory,
      addContactRequest,
      removeContactRequest,
    }),
    [
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
      orderHistory,
      contactRequests,
      addOrderHistory,
      removeOrderHistory,
      addContactRequest,
      removeContactRequest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
