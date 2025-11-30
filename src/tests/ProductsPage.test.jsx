import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";

describe("ProductsPage", () => {
  it("renders title and product cards", async () => {
    render(
      <MemoryRouter>
        <ProductsPage
          searchTerm=""
          selectedCategory="all"
          onCategoryChange={() => {}}
          fetchDelay={0}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/여행 상품 리스트/i)).toBeInTheDocument();

    const articles = await screen.findAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);

    const buttons = screen.getAllByText("자세히 보기");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
