import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider, useCart } from "../contexts/CartContext.jsx";
import { products } from "../data/products";

describe("CartContext", () => {
  it("calculates totals when items and options change", () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(products[0], [], { adult: 1, child: 0, infant: 0 });
    });
    expect(result.current.totalPrice).toBeGreaterThan(0);
    act(() => {
      result.current.addToCart(products[0], [{ id: "js", label: "옵션", extraPrice: 10000 }], { adult: 2 });
    });
    expect(result.current.totalPrice).toBeGreaterThan(result.current.totals.productsTotal);
  });
});
