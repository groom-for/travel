import { createContext, useCallback, useContext, useMemo, useState } from "react";

// [TASK] CartContext를 주문/금액 상태 관리 요구사항에 맞춰 확장했습니다.

const normalizeCounts = (counts = {}) => ({
  adult: Math.max(0, counts.adult ?? 0),
  child: Math.max(0, counts.child ?? 0),
  infant: Math.max(0, counts.infant ?? 0),
});

const getUnitPrice = (source, type) => {
  const prices = source?.pricesByType ?? {};
  if (type === "adult") {
    return prices.adult ?? source?.basePrice ?? 0;
  }
  return prices[type] ?? 0;
};

const createPricingSnapshot = (
  pricingSource,
  counts,
  selectedOptions = [],
  transportSelection
) => {
  const normalizedCounts = normalizeCounts(counts);
  const typeTotals = {
    adult: getUnitPrice(pricingSource, "adult") * normalizedCounts.adult,
    child: getUnitPrice(pricingSource, "child") * normalizedCounts.child,
    infant: getUnitPrice(pricingSource, "infant") * normalizedCounts.infant,
  };
  const travelerCount =
    normalizedCounts.adult + normalizedCounts.child + normalizedCounts.infant;
  const optionsTotal = selectedOptions.reduce(
    (sum, option) =>
      sum + (option.extraPrice ?? 0) * Math.max(travelerCount, 0),
    0
  );
  const seatExtraPerPerson =
    transportSelection?.selectedSeatClass?.extraPrice ?? 0;
  const seatChargeCount = normalizedCounts.adult + normalizedCounts.child;
  const seatExtraTotal = seatExtraPerPerson * seatChargeCount;
  const productsTotal =
    typeTotals.adult + typeTotals.child + typeTotals.infant;
  return {
    typeTotals,
    optionsTotal,
    seatExtraTotal,
    productsTotal,
    grandTotal: productsTotal + optionsTotal + seatExtraTotal,
  };
};

const summarizeCartTotals = (items) =>
  items.reduce(
    (acc, item) => {
      const totals = item.totals ?? {};
      acc.productsTotal += totals.productsTotal ?? 0;
      acc.optionsTotal += totals.optionsTotal ?? 0;
      acc.seatExtraTotal += totals.seatExtraTotal ?? 0;
      acc.grandTotal += totals.grandTotal ?? item.totalPrice ?? 0;
      return acc;
    },
    {
      productsTotal: 0,
      optionsTotal: 0,
      seatExtraTotal: 0,
      grandTotal: 0,
    }
  );

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback(
    (
      product,
      selectedOptions = [],
      counts,
      transportSelection = null,
      customSelections = {}
    ) => {
      const pricingSource = {
        basePrice: product.basePrice ?? product.price ?? 0,
        pricesByType: product.pricesByType ?? {},
        optionCatalog: product.options ?? [],
      };
      const normalizedCounts = normalizeCounts(counts);
      const preparedOptions = selectedOptions.map((option) => ({
        id: option.id,
        label: option.label,
        extraPrice: option.extraPrice,
      }));
      const totals = createPricingSnapshot(
        pricingSource,
        normalizedCounts,
        preparedOptions,
        transportSelection
      );
      const nextItem = {
        id: product.id,
        name: product.title,
        pricingSource,
        selectedOptions: preparedOptions,
        counts: normalizedCounts,
        transportSelection: transportSelection ?? null,
        customSelections,
        totals,
        totalPrice: totals.grandTotal,
      };

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = nextItem;
          return updated;
        }
        return [...prev, nextItem];
      });
    },
    []
  );

  const updateItemCount = useCallback((itemId, type, newCount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updatedCounts = {
          ...item.counts,
          [type]: Math.max(0, newCount ?? 0),
        };
        const totals = createPricingSnapshot(
          item.pricingSource,
          updatedCounts,
          item.selectedOptions,
          item.transportSelection
        );
        return {
          ...item,
          counts: updatedCounts,
          totals,
          totalPrice: totals.grandTotal,
        };
      })
    );
  }, []);

  const toggleItemOption = useCallback((itemId, optionId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.selectedOptions.find(
          (option) => option.id === optionId
        );
        let nextOptions = item.selectedOptions;
        if (exists) {
          nextOptions = item.selectedOptions.filter(
            (option) => option.id !== optionId
          );
        } else {
          const catalogOption = item.pricingSource.optionCatalog?.find(
            (option) => option.id === optionId
          );
          if (!catalogOption) {
            return item;
          }
          nextOptions = [
            ...item.selectedOptions,
            {
              id: catalogOption.id,
              label: catalogOption.label,
              extraPrice: catalogOption.extraPrice,
            },
          ];
        }
        const totals = createPricingSnapshot(
          item.pricingSource,
          item.counts,
          nextOptions,
          item.transportSelection
        );
        return {
          ...item,
          selectedOptions: nextOptions,
          totals,
          totalPrice: totals.grandTotal,
        };
      })
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totals = useMemo(() => summarizeCartTotals(cartItems), [cartItems]);
  const totalPrice = totals.grandTotal;

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateItemCount,
      toggleItemOption,
      removeFromCart,
      clearCart,
      totalPrice,
      totals,
    }),
    [
      cartItems,
      addToCart,
      updateItemCount,
      toggleItemOption,
      removeFromCart,
      clearCart,
      totalPrice,
      totals,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
