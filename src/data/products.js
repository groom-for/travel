// 여행 상품에 사용되는 공통 더미 데이터
export const products = [
  {
    id: 1,
    title: "후쿠오카 3박 4일 힐링 패키지",
    description: "온천과 미식 투어, 시내 자유시간으로 구성된 가벼운 일정",
    price: 699000,
    basePrice: 699000,
    category: "overseas",
    country: "japan",
    pricesByType: {
      adult: 699000,
      child: 499000,
      infant: 199000,
    },
    options: [
      { id: "breakfast", label: "조식 포함", extraPrice: 20000 },
      { id: "onsen", label: "프리미엄 온천 이용권", extraPrice: 35000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "다낭 올인클루시브 리조트",
    description: "전 일정 리조트에서 즐기는 식사, 스파, 수영 특화 상품",
    price: 899000,
    basePrice: 899000,
    category: "overseas",
    pricesByType: {
      adult: 899000,
      child: 629000,
      infant: 199000,
    },
    options: [
      { id: "pickup", label: "공항 픽업 서비스", extraPrice: 30000 },
      { id: "spa", label: "스파 패키지 업그레이드", extraPrice: 60000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "제주 렌터카 & 맛집 투어",
    description: "자유일정 + 현지 맛집 코스 포함, 렌터카와 숙박 패키지",
    price: 499000,
    basePrice: 499000,
    category: "domestic",
    pricesByType: {
      adult: 499000,
      child: 349000,
      infant: 99000,
    },
    options: [
      { id: "guide", label: "현지 가이드 동행", extraPrice: 40000 },
      { id: "restaurant", label: "프리미엄 맛집 코스", extraPrice: 55000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "스위스 알프스 기차 여행",
    description: "융프라우요흐와 체르마트를 한 번에 즐기는 파노라마 코스",
    price: 2299000,
    basePrice: 2299000,
    category: "overseas",
    pricesByType: {
      adult: 2299000,
      child: 1699000,
      infant: 499000,
    },
    options: [
      { id: "glacier", label: "빙하 특급 업그레이드", extraPrice: 120000 },
      { id: "meal", label: "알프스 전통식 포함", extraPrice: 60000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "괌 가족 자유여행",
    description: "가족형 리조트 + 워터파크 & 스노클링 체험권 포함",
    price: 1099000,
    basePrice: 1099000,
    category: "overseas",
    pricesByType: {
      adult: 1099000,
      child: 799000,
      infant: 299000,
    },
    options: [
      { id: "waterpark", label: "워터파크 2일권", extraPrice: 45000 },
      { id: "snorkeling", label: "스노클링 장비 대여", extraPrice: 25000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "파리 미식 & 예술 탐방",
    description: "루브르, 오르세 투어와 미쉐린 레스토랑 예약 지원",
    price: 2599000,
    basePrice: 2599000,
    category: "overseas",
    pricesByType: {
      adult: 2599000,
      child: 1899000,
      infant: 599000,
    },
    options: [
      { id: "museum", label: "야간 박물관 투어", extraPrice: 75000 },
      { id: "michelin", label: "미쉐린 레스토랑 코스", extraPrice: 150000 },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ski-winter",
    title: "강원도 겨울 스키/스노보드 여행",
    description: "초급부터 상급까지 코스 완비! 장비 렌탈 포함.",
    price: 160000,
    basePrice: 160000,
    category: "domestic",
    pricesByType: {
      adult: 160000,
      child: 130000,
      infant: 50000,
    },
    options: [
      { id: "rental", label: "스키/보드 장비 렌탈", extraPrice: 20000 },
      { id: "lesson", label: "스키 강습 1시간", extraPrice: 40000 },
    ],
    transportInfo: {
      transportType: "flight",
      isRoundTrip: true,
      departureAirport: "김포공항",
      arrivalAirport: "양양공항",
      flightNumber: "KE981",
      defaultDepartureTime: "07:30",
      defaultReturnTime: "19:00",
      timeOptions: [
        {
          id: "morning",
          label: "오전 출발 (07:30)",
          departureTime: "07:30",
          returnTime: "19:00",
        },
        {
          id: "afternoon",
          label: "오후 출발 (12:00)",
          departureTime: "12:00",
          returnTime: "21:00",
        },
      ],
      seatClassOptions: [
        { id: "standard", label: "이코노미석", extraPrice: 0 },
        { id: "first", label: "비즈니스석", extraPrice: 20000 },
      ],
    },
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "gyeongju-silla",
    title: "경주 신라 문화유산 여행",
    description: "대릉원·첨성대·불국사 등 핵심 코스 집중 탐방",
    price: 180000,
    basePrice: 180000,
    category: "domestic",
    pricesByType: {
      adult: 180000,
      child: 140000,
      infant: 50000,
    },
    options: [
      { id: "guide", label: "문화해설사 가이드 포함", extraPrice: 30000 },
      { id: "lunch", label: "지역 한식 점심 포함", extraPrice: 15000 },
    ],
    transportInfo: {
      transportType: "KTX",
      isRoundTrip: true,
      departureStation: "서울역",
      arrivalStation: "신경주역",
      defaultDepartureTime: "08:00",
      defaultReturnTime: "18:00",
      timeOptions: [
        {
          id: "morning",
          label: "오전 출발 (08:00)",
          departureTime: "08:00",
          returnTime: "18:00",
        },
        {
          id: "afternoon",
          label: "오후 출발 (12:00)",
          departureTime: "12:00",
          returnTime: "21:00",
        },
      ],
      seatClassOptions: [
        { id: "standard", label: "일반석", extraPrice: 0 },
        { id: "first", label: "우등석/특실", extraPrice: 20000 },
      ],
    },
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "jeonju-hanok",
    title: "전주 한옥 마을 감성 여행",
    description: "한옥마을 산책 + 전주비빔밥 체험 포함",
    price: 150000,
    basePrice: 150000,
    category: "domestic",
    pricesByType: {
      adult: 150000,
      child: 120000,
      infant: 40000,
    },
    options: [
      { id: "hanbok", label: "한복 체험", extraPrice: 18000 },
      { id: "coffee", label: "전주 카페 쿠폰", extraPrice: 8000 },
    ],
    transportInfo: {
      transportType: "KTX",
      isRoundTrip: true,
      departureStation: "용산역",
      arrivalStation: "전주역",
      defaultDepartureTime: "09:00",
      defaultReturnTime: "20:00",
      timeOptions: [
        {
          id: "morning",
          label: "오전 출발 (09:00)",
          departureTime: "09:00",
          returnTime: "20:00",
        },
        {
          id: "afternoon",
          label: "오후 출발 (13:00)",
          departureTime: "13:00",
          returnTime: "22:00",
        },
      ],
      seatClassOptions: [
        { id: "standard", label: "일반석", extraPrice: 0 },
        { id: "first", label: "우등석/특실", extraPrice: 15000 },
      ],
    },
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "imsil-cheese",
    title: "임실 치즈 체험 여행",
    description: "치즈 만들기 체험 + 목장 산책",
    price: 120000,
    basePrice: 120000,
    category: "domestic",
    pricesByType: {
      adult: 120000,
      child: 100000,
      infant: 30000,
    },
    options: [
      { id: "cheese-class", label: "치즈 만들기 클래스", extraPrice: 20000 },
      { id: "farm-tour", label: "목장 투어", extraPrice: 10000 },
    ],
    transportInfo: {
      transportType: "flight",
      isRoundTrip: true,
      departureAirport: "김포공항",
      arrivalAirport: "무안공항",
      defaultDepartureTime: "08:30",
      defaultReturnTime: "19:30",
      timeOptions: [
        {
          id: "morning",
          label: "오전 출발 (08:30)",
          departureTime: "08:30",
          returnTime: "19:30",
        },
        {
          id: "evening",
          label: "오후 출발 (15:00)",
          departureTime: "15:00",
          returnTime: "22:00",
        },
      ],
      seatClassOptions: [
        { id: "standard", label: "이코노미석", extraPrice: 0 },
        { id: "first", label: "비즈니스석", extraPrice: 25000 },
      ],
    },
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
];

export const findProductById = (id) =>
  products.find((product) => String(product.id) === String(id));
