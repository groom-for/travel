import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentPage from "../pages/PaymentPage";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../contexts/CartContext.jsx";

vi.mock("../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({ user: { name: "test" }, addOrderHistory: vi.fn() }),
}));

describe("Checkout flow", () => {
  it("shows validation errors when required fields missing", async () => {
    const orderInfo = {
      items: [
        { id: 1, name: "후쿠오카 3박 4일 힐링 패키지", selectedOptions: [] },
      ],
      totals: { productsTotal: 100000, optionsTotal: 0, seatExtraTotal: 0 },
      totalPrice: 100000,
    };
    render(
      <CartProvider>
        <MemoryRouter initialEntries={[{ pathname: "/payment", state: { orderInfo } }]}>
          <PaymentPage />
        </MemoryRouter>
      </CartProvider>
    );
    userEvent.click(screen.getByRole("button", { name: /결제하기/i }));
    expect(await screen.findByText(/카드 소유자 이름을 입력해주세요./i)).toBeInTheDocument();
  });
});
