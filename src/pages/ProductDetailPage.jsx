import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findProductById, products } from "../data/products";
import { useCart } from "../contexts/CartContext";
import "../styles/productDetail.css";

// [TASK] 개별 여행 상품 상세 및 장바구니 모달을 처리하는 페이지
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = useMemo(() => findProductById(id), [id]);
  const [counts, setCounts] = useState({ adult: 1, child: 0, infant: 0 });
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const initialTimeOptionId =
    product?.transportInfo?.timeOptions?.[0]?.id ?? null;
  const initialSeatClassId =
    product?.transportInfo?.seatClassOptions?.[0]?.id ?? null;
  const [selectedTimeOptionId, setSelectedTimeOptionId] = useState(
    initialTimeOptionId
  );
  const [selectedSeatClassId, setSelectedSeatClassId] = useState(
    initialSeatClassId
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const rentalDefaults = {
    vehicleType: "경차",
    startDate: "",
    endDate: "",
    insurance: "basic",
    navigation: "basic",
    returnLocation: "same",
  };
  const [rentalSelections, setRentalSelections] = useState(rentalDefaults);

  useEffect(() => {
    setCounts({ adult: 1, child: 0, infant: 0 });
    setSelectedOptionIds([]);
    setSelectedTimeOptionId(product?.transportInfo?.timeOptions?.[0]?.id ?? null);
    setSelectedSeatClassId(
      product?.transportInfo?.seatClassOptions?.[0]?.id ?? null
    );
    setIsModalOpen(false);
    setRentalSelections(rentalDefaults);
  }, [product?.id]);

  const isRentalProduct = product?.title?.includes("제주 렌터카");

  const selectedOptions = useMemo(() => {
    if (!product) return [];
    return (product.options ?? []).filter((option) =>
      selectedOptionIds.includes(option.id)
    );
  }, [product, selectedOptionIds]);

  const typeTotals = useMemo(() => {
    if (!product) {
      return { adult: 0, child: 0, infant: 0 };
    }
    const prices = product.pricesByType ?? {};
    return {
      adult: (prices.adult ?? product.basePrice ?? product.price ?? 0) * counts.adult,
      child: (prices.child ?? 0) * counts.child,
      infant: (prices.infant ?? 0) * counts.infant,
    };
  }, [product, counts]);

  const optionsTotal = useMemo(
    () => selectedOptions.reduce((sum, option) => sum + option.extraPrice, 0),
    [selectedOptions]
  );

  const selectedTimeOption = useMemo(() => {
    if (!product?.transportInfo?.timeOptions) return null;
    return (
      product.transportInfo.timeOptions.find(
        (option) => option.id === selectedTimeOptionId
      ) ?? product.transportInfo.timeOptions[0] ?? null
    );
  }, [product, selectedTimeOptionId]);

  const selectedSeatClass = useMemo(() => {
    if (!product?.transportInfo?.seatClassOptions) return null;
    return (
      product.transportInfo.seatClassOptions.find(
        (seat) => seat.id === selectedSeatClassId
      ) ?? product.transportInfo.seatClassOptions[0] ?? null
    );
  }, [product, selectedSeatClassId]);

  const seatExtraPerPerson = selectedSeatClass?.extraPrice ?? 0;
  const seatChargeCount = counts.adult + counts.child;
  const seatExtraTotal = seatExtraPerPerson * seatChargeCount;

  const totalPrice =
    typeTotals.adult +
    typeTotals.child +
    typeTotals.infant +
    optionsTotal +
    seatExtraTotal;

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-empty">
          <h1>상품을 찾을 수 없습니다.</h1>
          <Link to="/" className="btn btn-secondary detail-back-link">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const adjustCount = (type, delta, minValue = 0) => {
    setCounts((prev) => {
      const min = type === "adult" ? 0 : minValue;
      const next = Math.max(min, (prev[type] ?? min) + delta);
      return { ...prev, [type]: next };
    });
  };

  const handleOptionToggle = (id) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((optionId) => optionId !== id) : [...prev, id]
    );
  };

  const handleTimeChange = (event) => {
    setSelectedTimeOptionId(event.target.value);
  };

  const handleSeatClassChange = (event) => {
    setSelectedSeatClassId(event.target.value);
  };

  const handleRentalChange = (event) => {
    const { name, value } = event.target;
    setRentalSelections((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    const transportSelection = product.transportInfo
      ? {
          transportType: product.transportInfo.transportType,
          departureStation: product.transportInfo.departureStation,
          arrivalStation: product.transportInfo.arrivalStation,
          departureAirport: product.transportInfo.departureAirport,
          arrivalAirport: product.transportInfo.arrivalAirport,
          flightNumber: product.transportInfo.flightNumber,
          isRoundTrip: product.transportInfo.isRoundTrip,
          selectedTime: selectedTimeOption
            ? {
                id: selectedTimeOption.id,
                label: selectedTimeOption.label,
                departureTime: selectedTimeOption.departureTime,
                returnTime: selectedTimeOption.returnTime,
              }
            : null,
          selectedSeatClass: selectedSeatClass
            ? {
                id: selectedSeatClass.id,
                label: selectedSeatClass.label,
                extraPrice: selectedSeatClass.extraPrice,
              }
            : null,
        }
      : null;
    const customSelections = isRentalProduct
      ? { rental: rentalSelections }
      : {};
    addToCart(product, selectedOptions, counts, transportSelection, customSelections);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleGoToCart = () => {
    setIsModalOpen(false);
    navigate("/cart");
  };

  const showcaseItems = useMemo(() => {
    const baseTitle = product?.title ?? "여행지";
    return [
      {
        id: "viewpoint",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        title: `${baseTitle} 뷰포인트`,
        description: [
          "아침 햇살이 비치는 전망대에서 도시와 바다를 동시에 감상할 수 있습니다.",
          "가이드가 추천하는 촬영 포인트에서 추억 사진을 남겨 보세요.",
          "인근 카페 거리는 현지 베이커리와 스페셜티 커피로도 유명합니다.",
        ],
      },
      {
        id: "food",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        title: `${baseTitle} 미식 투어`,
        description: [
          "현지 시장 투어 후 바로 눈앞에서 만든 제철 음식을 맛볼 수 있습니다.",
          "채식 · 글루텐 프리 등 다양한 식단 요청도 미리 전달해 드립니다.",
          "식사 사이에는 로컬 와이너리 또는 티 컬처 클래스가 포함됩니다.",
        ],
      },
      {
        id: "activity",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
        title: `${baseTitle} 액티비티`,
        description: [
          "트레킹, 요가, 요트, 온천 등 취향에 맞는 자유 활동을 선택할 수 있습니다.",
          "안전 교육과 전문 인솔자가 함께하여 초보자도 부담 없이 참여할 수 있습니다.",
          "이동 동선과 휴식 시간을 넉넉하게 잡아 여유로운 일정이 되도록 구성했습니다.",
        ],
      },
    ];
  }, [product?.id, product?.title]);
  const sampleSchedule = useMemo(() => {
    const baseTitle = product?.title ?? "여행";
    return [
      { day: "Day 1", time: "09:00", detail: `${baseTitle} 도착 · 체크인` },
      { day: "Day 1", time: "11:30", detail: `${baseTitle} 핵심 시티 투어 진행` },
      { day: "Day 1", time: "17:00", detail: "프리미엄 레스토랑에서 저녁 식사" },
      { day: "Day 2", time: "08:30", detail: "선택 액티비티 또는 자유 일정" },
      { day: "Day 2", time: "13:30", detail: "대표 명소 포토 스팟 & 카페 투어" },
      { day: "Day 2", time: "19:00", detail: "야경 감상, 스카이라운지 바 이용" },
      { day: "Day 3", time: "09:00", detail: "테마 체험 프로그램(현지 문화/요가 등)" },
      { day: "Day 3", time: "14:00", detail: "쇼핑 및 휴식 후 공항 이동" },
      { day: "Day 3", time: "18:00", detail: "귀국 편 탑승 · 일정 종료" },
    ];
  }, [product?.title]);

  const scheduleByDay = useMemo(() => {
    const grouped = new Map();
    sampleSchedule.forEach((entry) => {
      if (!grouped.has(entry.day)) grouped.set(entry.day, []);
      grouped.get(entry.day).push(entry);
    });
    return Array.from(grouped.entries());
  }, [sampleSchedule]);

  const nearbySpots = useMemo(() => {
    const baseTitle = product?.title ?? "여행지";
    return [
      {
        id: "spot-1",
        title: `${baseTitle} 전망 스카이라운지`,
        description: "도심과 해안선을 한눈에 볼 수 있는 루프탑 카페",
        address: "123 Skyline Rd, Local City",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "spot-2",
        title: "현지 전통 시장",
        description: "수제 공예품, 향신료, 디저트 등 로컬 분위기를 느끼기 좋은 거리",
        address: "45 Cultural St, Downtown",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "spot-3",
        title: "해안 산책로",
        description: "석양 포인트가 있는 해변 산책로, 자전거 대여 가능",
        address: "Beach Walk 77, Coastal Area",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
      },
    ];
  }, [product?.title]);
  const recommendedTrips = useMemo(() => {
    if (!product) return [];
    const otherProducts = products.filter(
      (item) => String(item.id) !== String(product.id)
    );
    return [...otherProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.thumbnail || "/images/default-travel.svg",
      }));
  }, [product]);

  return (
    <main className="product-detail-page">
      <div className="detail-layout">
        <article className="card product-detail-card detail-main">
          <img
            src={product.thumbnail || "/images/default-travel.svg"}
            alt={`${product.title} 이미지`}
            className="product-detail-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/images/default-travel.svg";
            }}
          />
          <div className="product-detail-body">
            <h1 className="page-title">{product.title}</h1>
            <p className="page-subtitle">{product.description}</p>
            {product.transportInfo ? (
              <section className="detail-section train-section">
                <h2>
                  교통 정보 (
                  {product.transportInfo.transportType === "flight"
                    ? "항공"
                    : product.transportInfo.transportType}
                  )
                </h2>
                <div className="train-info-row">
                  <p className="train-route">
                    {product.transportInfo.transportType === "flight"
                      ? `${product.transportInfo.departureAirport} → ${product.transportInfo.arrivalAirport}`
                      : `${product.transportInfo.departureStation} → ${product.transportInfo.arrivalStation}`}{" "}
                    ({product.transportInfo.transportType})
                  </p>
                  <p className="train-time">
                    기본 {product.transportInfo.defaultDepartureTime} 출발 ·{" "}
                    {product.transportInfo.defaultReturnTime} 복귀
                  </p>
                </div>
                {product.transportInfo.timeOptions?.length ? (
                  <div className="train-options">
                    <p className="train-options-title">출발 시간 선택</p>
                    <div className="radio-grid">
                      {product.transportInfo.timeOptions.map((option) => (
                        <label key={option.id} className="radio-card">
                          <input
                            type="radio"
                            name="train-time"
                            value={option.id}
                            checked={selectedTimeOptionId === option.id}
                            onChange={handleTimeChange}
                          />
                          <div>
                            <strong>{option.label}</strong>
                            <small>
                              복귀{" "}
                              {option.returnTime ??
                                product.transportInfo.defaultReturnTime}
                            </small>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                {product.transportInfo.seatClassOptions?.length ? (
                  <div className="train-options">
                    <p className="train-options-title">좌석 등급 선택</p>
                    <div className="radio-grid">
                      {product.transportInfo.seatClassOptions.map((seat) => (
                        <label key={seat.id} className="radio-card">
                          <input
                            type="radio"
                            name="seat-class"
                            value={seat.id}
                            checked={selectedSeatClassId === seat.id}
                            onChange={handleSeatClassChange}
                          />
                          <div>
                            <strong>{seat.label}</strong>
                            <small>
                              {seat.extraPrice > 0
                                ? `+${seat.extraPrice.toLocaleString("ko-KR")}원`
                                : "추가 요금 없음"}
                            </small>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}
            <section className="detail-section showcase-section">
              <h2>여행 미리보기</h2>
              <div className="showcase-grid">
                {showcaseItems.map((item) => (
                  <article key={item.id} className="showcase-card">
                    <img src={item.image} alt={`${item.title} 이미지`} />
                    <h3>{item.title}</h3>
                    <div className="showcase-text">
                      {item.description.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="detail-section schedule-section">
              <h2>임의 일정 예시</h2>
              <div className="schedule-table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>일차</th>
                      <th>시간</th>
                      <th colSpan={2}>일정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleByDay.map(([day, entries]) =>
                      entries.map((entry, index) => (
                        <tr key={`${day}-${entry.time}-${index}`}>
                          {index === 0 ? (
                            <td rowSpan={entries.length}>{day}</td>
                          ) : null}
                          <td>{entry.time}</td>
                          <td colSpan={2}>{entry.detail}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="detail-section nearby-section">
              <h2>주변 추천 여행지</h2>
              <div className="nearby-list">
                {nearbySpots.map((spot) => (
                  <article key={spot.id} className="nearby-item">
                    <img src={spot.image} alt={spot.title} />
                    <div>
                      <h3>{spot.title}</h3>
                      <p className="nearby-desc">{spot.description}</p>
                      <p className="nearby-address">{spot.address}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>
        <aside className="detail-sidebar">
          <div className="card product-detail-card detail-sidebar-card">
            <div className="product-detail-body">
              <section className="detail-section">
                <h2>인원 선택</h2>
                <div className="detail-counts">
                  {[
                    { type: "adult", label: "성인", description: "만 12세 이상", min: 0 },
                    { type: "child", label: "어린이", description: "만 2세~11세", min: 0 },
                    { type: "infant", label: "유아", description: "만 24개월 미만", min: 0 },
                  ].map((item) => (
                    <div key={item.type} className="count-control">
                      <span>
                        {item.label} <em>{item.description}</em>
                      </span>
                      <div className="count-stepper">
                        <button
                          type="button"
                          className="count-button"
                          onClick={() => adjustCount(item.type, -1, item.min)}
                        >
                          −
                        </button>
                        <span className="count-value">{counts[item.type]}</span>
                        <button
                          type="button"
                          className="count-button"
                          onClick={() => adjustCount(item.type, 1, item.min)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {product.options?.length ? (
                <section className="detail-section">
                  <h2>옵션 선택</h2>
                  <div className="detail-options">
                    {product.options.map((option) => (
                      <label key={option.id} className="option-control">
                        <input
                          type="checkbox"
                          checked={selectedOptionIds.includes(option.id)}
                          onChange={() => handleOptionToggle(option.id)}
                        />
                        <div>
                          <p>{option.label}</p>
                          <small>
                            +{option.extraPrice.toLocaleString("ko-KR")}원
                          </small>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              ) : null}
              {isRentalProduct ? (
                <section className="detail-section rental-section">
                  <h2>렌터카 옵션</h2>
                  <div className="rental-grid">
                    <label className="rental-field">
                      <span>차량 종류</span>
                      <select
                        name="vehicleType"
                        value={rentalSelections.vehicleType}
                        onChange={handleRentalChange}
                      >
                        {["경차", "소형", "중형", "SUV", "승합차"].map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="rental-field rental-dates">
                      <label>
                        <span>대여일</span>
                        <input
                          type="date"
                          name="startDate"
                          value={rentalSelections.startDate}
                          onChange={handleRentalChange}
                        />
                      </label>
                      <label>
                        <span>반납일</span>
                        <input
                          type="date"
                          name="endDate"
                          value={rentalSelections.endDate}
                          onChange={handleRentalChange}
                        />
                      </label>
                    </div>
                    <label className="rental-field">
                      <span>자동차 보험</span>
                      <select
                        name="insurance"
                        value={rentalSelections.insurance}
                        onChange={handleRentalChange}
                      >
                        <option value="basic">기본</option>
                        <option value="full">완전 자차</option>
                        <option value="premium">고급 보험</option>
                      </select>
                    </label>
                    <label className="rental-field">
                      <span>네비게이션</span>
                      <select
                        name="navigation"
                        value={rentalSelections.navigation}
                        onChange={handleRentalChange}
                      >
                        <option value="basic">기본 포함</option>
                        <option value="foreign">외국어 네비 지원</option>
                      </select>
                    </label>
                    <label className="rental-field">
                      <span>반납 장소</span>
                      <select
                        name="returnLocation"
                        value={rentalSelections.returnLocation}
                        onChange={handleRentalChange}
                      >
                        <option value="same">동일 지점 반납</option>
                        <option value="different">다른 지점 반납</option>
                      </select>
                    </label>
                  </div>
                  <p className="rental-note">
                    렌터카 옵션은 장바구니와 주문서에서 함께 확인할 수 있어요.
                  </p>
                </section>
              ) : null}
              <section className="detail-section summary">
                <h2>예상 결제 금액</h2>
                <div className="summary-table">
                  {[
                    {
                      label: `성인 (${counts.adult}명)`,
                      value: typeTotals.adult,
                    },
                    {
                      label: `어린이 (${counts.child}명)`,
                      value: typeTotals.child,
                    },
                    {
                      label: `유아 (${counts.infant}명)`,
                      value: typeTotals.infant,
                    },
                    {
                      label: "옵션 추가금",
                      value: optionsTotal,
                    },
                    ...(product.transportInfo?.seatClassOptions?.length
                      ? [
                          {
                            label: "좌석 등급 추가금",
                            value: seatExtraTotal,
                          },
                        ]
                      : []),
                  ].map((row) => (
                    <div className="price-row" key={row.label}>
                      <span className="price-label">{row.label}</span>
                      <span className="price-value">
                        {row.value.toLocaleString("ko-KR")}원
                      </span>
                    </div>
                  ))}
                  <div className="price-row price-row-total">
                    <span className="price-label">총 예상 결제 금액</span>
                    <span className="price-value">
                      {totalPrice.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                </div>
                <div className="summary-actions">
                  <button
                    type="button"
                    className="btn btn-primary product-detail-button"
                    onClick={handleAddToCart}
                  >
                    장바구니 담기
                  </button>
                </div>
              </section>
            </div>
          </div>
          {recommendedTrips.length ? (
            <div className="card product-detail-card recommendation-card">
              <div className="product-detail-body recommendation-body">
                <h2>추천 여행 상품</h2>
                <div className="recommendation-stack">
                  {recommendedTrips.map((trip) => (
                    <Link
                      to={`/product/${trip.id}`}
                      key={trip.id}
                      className="recommendation-item"
                    >
                      <img
                        src={trip.image || "/images/default-travel.svg"}
                        alt={trip.title}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/images/default-travel.svg";
                        }}
                      />
                      <div className="recommendation-overlay">
                        <p className="recommendation-item-title">{trip.title}</p>
                        <p className="recommendation-item-desc">{trip.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
      {isModalOpen && (
        <div className="cart-modal-overlay" role="dialog" aria-modal="true">
          <div className="cart-modal">
            <h3>장바구니에 상품이 담겼어요!</h3>
            <p>{product.title}</p>
            <div className="cart-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                계속 쇼핑하기
              </button>
              <button type="button" className="btn btn-primary go-cart" onClick={handleGoToCart}>
                장바구니 바로가기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetailPage;
