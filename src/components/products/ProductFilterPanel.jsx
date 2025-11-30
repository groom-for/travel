import React from "react";
import "../../styles/productFilterPanel.css";

export default function ProductFilterPanel({
  filterOpen,
  toggleFilter,
  internalSearch,
  setInternalSearch,
  internalCategory,
  setInternalCategory,
  onCategoryChange,
  priceRange,
  setPriceRange,
  sortOrder,
  setSortOrder,
  categoryOptions,
}) {
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm filter-toggle"
        onClick={toggleFilter}
        aria-expanded={filterOpen}
      >
        {filterOpen ? "상세검색 닫기" : "상세검색 열기"}
      </button>
      <div className="filter-panel" data-open={filterOpen ? "true" : "false"}>
        <div className="products-filter-controls">
          <input
            type="text"
            className="products-category-select"
            placeholder="검색어를 입력하세요"
            value={internalSearch}
            onChange={(event) => setInternalSearch(event.target.value)}
          />
          <select
            className="products-category-select"
            value={internalCategory}
            onChange={(event) => {
              const nextValue = event.target.value;
              setInternalCategory(nextValue);
              onCategoryChange(nextValue);
            }}
          >
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="products-category-select"
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
          >
            <option value="all">가격 범위</option>
            <option value="0-50">0-50만 원</option>
            <option value="50-100">50-100만 원</option>
            <option value="100-200">100-200만 원</option>
            <option value="200+">200만 원 이상</option>
          </select>
          <select
            className="products-category-select"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="none">정렬 없음</option>
            <option value="asc">가격 낮은순</option>
            <option value="desc">가격 높은순</option>
          </select>
        </div>
      </div>
    </>
  );
}
