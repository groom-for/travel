import { AuthProvider } from "./AuthContext.jsx";
import { CartProvider } from "./CartContext.jsx";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

export default AppProviders;
