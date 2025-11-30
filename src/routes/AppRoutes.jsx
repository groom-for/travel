import { Routes, Route } from "react-router-dom";
import {
  ProductsPage,
  ProductDetailPage,
  CartPage,
  OrderSummaryPage,
  PaymentPage,
  OrderCompletePage,
  LoginPage,
  SignupPage,
  SignupCompletePage,
  ForgotPasswordPage,
  PasswordResetCompletePage,
  AccountPage,
  NotFoundPage,
} from "../pages";
import { RequireAuth } from "./RequireAuth";

function AppRoutes({ searchTerm, selectedCategory, onCategoryChange }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProductsPage
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        }
      />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup-complete" element={<SignupCompletePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/password-reset-complete" element={<PasswordResetCompletePage />} />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        }
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-summary" element={<OrderSummaryPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order-complete" element={<OrderCompletePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
