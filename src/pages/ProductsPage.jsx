import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductFilterPanel from "../components/products/ProductFilterPanel";
import "../styles/products.css";

// [TASK] 상품 리스트 UI 및 검색/필터/로딩 상태를 개선했습니다.
const fallbackImage = "/images/default-travel.svg";

const categoryLabels = {
  all: "전체",
  domestic: "국내여행",
  overseas: "해외여행",
  "rental-tour": "렌터카 & 투어",
  package: "패키지",
};

const categoryKeywordMapping = [
  { keywords: ["국내", "국내여행"], category: "domestic" },
  { keywords: ["해외", "해외여행"], category: "overseas" },
];

const countryKeywordMapping = [
  { keywords: ["일본", "일본여행"], country: "japan" },
];

const ProductsPage = ({
  searchTerm = "",
  selectedCategory = "all",
  onCategoryChange = () => {},
  fetchDelay = 600,
}) => {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [internalSearch, setInternalSearch] = useState(searchTerm);
  const [internalCategory, setInternalCategory] = useState(selectedCategory);
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let canceled = false;
    setStatus("loading");
    setError("");
    const timerId = setTimeout(() => {
      if (canceled) return;
      try {
        setItems(products);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setError("상품을 불러오지 못했습니다.");
      }
    }, fetchDelay);
    return () => {
      canceled = true;
      clearTimeout(timerId);
    };
  }, [retryKey, fetchDelay]);

  useEffect(() => {
    setInternalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setInternalCategory(selectedCategory);
  }, [selectedCategory]);

  const normalizedSearch = internalSearch.trim().toLowerCase();

  const autoCategoryFromSearch = (() => {
    if (!normalizedSearch) return null;
    const match = categoryKeywordMapping.find((entry) =>
      entry.keywords.some((keyword) => normalizedSearch.includes(keyword))
    );
    return match?.category ?? null;
  })();

  const autoCountryFromSearch = (() => {
    if (!normalizedSearch) return null;
    const match = countryKeywordMapping.find((entry) =>
      entry.keywords.some((keyword) => normalizedSearch.includes(keyword))
    );
    return match?.country ?? null;
  })();

  const filteredProducts = useMemo(() => {
    const lowerSearch = normalizedSearch;
    return items.filter((product) => {
      const baseText = `${product.title} ${product.description}`.toLowerCase();
      const matchSearch =
        !lowerSearch ||
        product.title.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch);

      const matchCategory =
        internalCategory === "all" ||
        product.category === internalCategory ||
        (internalCategory === "rental-tour" &&
          /렌터카|투어/.test(baseText));

      const matchPriceRange = (() => {
        const targetPrice = product.price ?? product.basePrice ?? 0;
        if (priceRange === "all") return true;
        if (priceRange === "0-50") return targetPrice <= 500000;
        if (priceRange === "50-100") return targetPrice > 500000 && targetPrice <= 1000000;
        if (priceRange === "100-200") return targetPrice > 1000000 && targetPrice <= 2000000;
        if (priceRange === "200+") return targetPrice > 2000000;
        return true;
      })();

      const matchAutoCategory =
        !autoCategoryFromSearch || product.category === autoCategoryFromSearch;

      const matchAutoCountry =
        !autoCountryFromSearch || product.country === autoCountryFromSearch;

      return (
        matchCategory &&
        matchSearch &&
        matchPriceRange &&
        matchAutoCategory &&
        matchAutoCountry
      );
    });
  }, [
    items,
    internalCategory,
    normalizedSearch,
    priceRange,
    autoCategoryFromSearch,
    autoCountryFromSearch,
  ]);

  const sortedProducts = useMemo(() => {
    if (sortOrder === "none") return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const aPrice = a.price ?? a.basePrice ?? 0;
      const bPrice = b.price ?? b.basePrice ?? 0;
      if (sortOrder === "asc") {
        return aPrice - bPrice;
      }
      return bPrice - aPrice;
    });
  }, [filteredProducts, sortOrder]);

  const priceLabel = (product) =>
    (product.pricesByType?.adult ?? product.basePrice ?? product.price).toLocaleString(
      "ko-KR"
    );

  const renderContent = () => {
    if (status === "loading") {
      return <p className="products-state">불러오는 중...</p>;
    }
    if (status === "error") {
      return (
        <div className="products-state">
          <p>{error || "상품을 불러오지 못했습니다."}</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setRetryKey((prev) => prev + 1)}
          >
            새로고침
          </button>
        </div>
      );
    }
    if (!sortedProducts.length) {
      return (
        <p className="products-state">
          조건에 맞는 상품이 없습니다. 다른 검색어나 필터를 선택해 주세요.
        </p>
      );
    }
    return (
      <section className="products-grid">
        {sortedProducts.map((product) => (
          <article key={product.id} className="card product-card">
            <img
              className="product-image"
              src={product.thumbnail || fallbackImage}
              alt={`${product.title} 썸네일`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
            <div className="product-body">
              <p className="product-chip">
                {product.category === "domestic" ? "국내여행" : "해외여행"}
              </p>
              <h2 className="product-title">{product.title}</h2>
              <p className="product-description">{product.description}</p>
            </div>
            <div className="product-footer">
              <p className="product-price">{priceLabel(product)}원~</p>
              <Link
                to={`/product/${product.id}`}
                className="btn btn-secondary btn-sm product-button"
              >
                자세히 보기
              </Link>
            </div>
          </article>
        ))}
      </section>
    );
  };

  return (
    <div className="products-page">
      <h1 className="page-title">여행 상품 리스트</h1>
      <div className="products-active-filter">
        <p>
          <strong>
            {categoryLabels[internalCategory] ?? "전체"} (총{" "}
            {status === "success" ? sortedProducts.length : 0}건)
          </strong>
        </p>
        <ProductFilterPanel
          filterOpen={filterOpen}
          toggleFilter={() => setFilterOpen((prev) => !prev)}
          internalSearch={internalSearch}
          setInternalSearch={setInternalSearch}
          internalCategory={internalCategory}
          setInternalCategory={setInternalCategory}
          onCategoryChange={onCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categoryOptions={Object.entries(categoryLabels)}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductsPage;
