import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { CartProvider, useCart } from './context/CartContext';
import { CartProvider } from './context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Settings, ChevronRight, Mail, Phone, MapPin, Plus, Minus, Search, ShoppingBag, ChevronDown, ShoppingCart } from 'lucide-react';
import { OrderModal } from './components/OrderModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { CartModal } from './components/CartModal';
import { optimizeCloudinaryUrl } from './lib/imageUtils';
import { Terms } from './pages/Terms';
import { BannerModal } from './components/BannerModal';
import { FloatingMenu } from './components/FloatingMenu';

// --- 관리자 페이지 임포트 ---
import AdminPage from './pages/AdminPage';
import { Guide } from './pages/Guide';
import { Privacy } from './pages/Privacy';

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MetadataManager = () => {
  const { config } = useConfig();

  React.useEffect(() => {
   document.title = "TodayCost";
    const setMetaTag = (property: string, content: string, attr = 'property') => {
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', config.description, 'name');
    setMetaTag('og:title', 'TodayCost');
    setMetaTag('og:description', config.description);
    setMetaTag('og:image', config.heroImage);
    setMetaTag('og:type', 'website');
    setMetaTag('twitter:card', 'summary_large_image', 'name');
    setMetaTag('twitter:title', 'TodayCost', 'name');
    setMetaTag('twitter:description', config.description, 'name');
    setMetaTag('twitter:image', config.heroImage, 'name');
  }, [config]);

  return null;
};

const Navbar = ({ 
  activeCategory, 
  setActiveCategory,
  onOpenContact,
  onOpenOrderLookup,
  onOpenCart
}: { 
  activeCategory: string, 
  setActiveCategory: (c: string) => void,
  onOpenContact: () => void,
  onOpenOrderLookup: () => void,
  onOpenCart: () => void
}) => {
  const { config } = useConfig();
  const { totalCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // 🌟 메뉴 구성을 [메인, 상품목록, 고객문의] 3개로 심플하게 압축했습니다.
  const navLinks = [
    { name: '메인', path: '#', category: '전체' },
    { name: '상품목록', path: '#products', category: '전체' },
    { name: '고객문의', path: '#contact' },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (location.pathname !== '/') {
      return;
    }

    if (link.name === '메인') {
      e.preventDefault();
      setActiveCategory('전체');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.name === '상품목록') {
      e.preventDefault();
      setActiveCategory('전체');
      setTimeout(() => {
        const element = document.getElementById('products');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.name === '고객문의') {
      e.preventDefault();
      onOpenContact();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" onClick={() => setActiveCategory('전체')} className="text-[20px] font-extrabold tracking-[-0.5px] flex items-center gap-2">
          <div className="w-3 h-3 bg-brand rounded-full"></div>
          {config.name}
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name} 
              to={link.path.startsWith('#') ? `/${link.path}` : '/'}
              onClick={(e) => handleNavLinkClick(e, link)}
              className={`group relative py-2 text-[14px] font-bold transition-colors ${
                (link.name === '메인' && activeCategory === '전체') || (link.name === '상품목록' && activeCategory !== '전체') 
                  ? 'text-ink' 
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {link.name}
              {/* 🌟 평소엔 숨어있다 마우스 오버 시 스르륵 나타나는 밑줄 */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand rounded-full origin-left"
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "circOut" }}
              />
            </Link>
          ))}
          {/* 🛒 장바구니 버튼 */}
          <button
            onClick={onOpenCart}
            className="relative text-[13px] font-bold px-4 py-2 rounded-full border border-gray-200 text-ink-muted hover:border-ink hover:text-ink transition-all flex items-center gap-1.5"
          >
            <ShoppingCart size={15} />
            장바구니
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand text-ink text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>
          {/* 🔍 주문조회 버튼 */}
          <button
            onClick={onOpenOrderLookup}
            className="text-[13px] font-bold px-4 py-2 rounded-full border border-gray-200 text-ink-muted hover:border-ink hover:text-ink transition-all"
          >
            주문조회
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path.startsWith('#') ? `/${link.path}` : '/'}
                onClick={(e) => {
                  handleNavLinkClick(e, link);
                  setIsOpen(false);
                }}
                className={`text-lg font-black py-4 border-b border-gray-50 flex items-center justify-between group ${
                  (link.name === '메인' && activeCategory === '전체') || (link.name === '상품목록' && activeCategory !== '전체') 
                    ? 'text-brand' 
                    : 'text-ink'
                }`}
              >
                {link.name}
                <ChevronRight size={20} className={`${(link.name === '메인' && activeCategory === '전체') || (link.name === '상품목록' && activeCategory !== '전체')  ? 'text-brand' : 'text-gray-300'} group-hover:text-brand transition-colors`} />
              </Link>
            ))}
            {/* 🛒 모바일 메뉴에도 장바구니 추가 */}
            <button
              onClick={() => {
                onOpenCart();
                setIsOpen(false);
              }}
              className="text-lg font-black py-4 text-left text-ink flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              장바구니
              {totalCount > 0 && (
                <span className="bg-brand text-ink text-[11px] font-black px-2 py-0.5 rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
            {/* 🔍 모바일 메뉴에도 주문조회 추가 */}
            <button
              onClick={() => {
                onOpenOrderLookup();
                setIsOpen(false);
              }}
              className="text-lg font-black py-4 text-left text-ink"
            >
              주문조회
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  // useConfig는 유지하되, 하단 정보는 심사를 위해 텍스트로 직접 입력합니다.
  const { config } = useConfig();

  return (
    <footer id="contact" className="bg-[#fafafa] border-t border-border py-10 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 text-[11px] text-[#555]">
          {/* 1. 좌측: 사업자 정보 및 계좌 안내, 약관 링크 */}
          <div className="flex flex-col gap-1.5 leading-relaxed">
            <div>
              <span className="font-bold text-ink">상호명:</span> 동그란마켓 &nbsp;|&nbsp; 
              <span className="font-bold text-ink">대표:</span> 이성현 &nbsp;|&nbsp; 
              <span className="font-bold text-ink">사업자등록번호:</span> 236-11-02791
            </div>
            <div>
              {/* ⚠️ 중요: 아래 '오늘도가성비' 대신 실제 사업장 주소(도로명 주소)를 꼭 적어주세요! */}
              <span className="font-bold text-ink">주소:</span> 서울특별시 중랑구 중랑천로 200
            </div>
            {/* 🌟 네이버/카카오 심사 필수: 통신판매업 신고번호와 고객센터 정보 */}
            <div className="text-[#555] mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              <div><span className="font-bold text-ink">고객센터:</span> 010-8007-3039</div>
              <div><span className="font-bold text-ink">통신판매업신고번호:</span> 제 2024-서울노원-0354호</div>
            </div>
            <div className="font-bold text-brand-dark mt-1">
              입금계좌: 카카오뱅크 3333-37-4727798 이성현(동그란마켓)
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 font-bold text-ink underline underline-offset-4">
              <Link to="/guide" className="hover:text-brand">이용안내</Link> 
              <Link to="/terms" className="hover:text-brand">이용약관</Link> 
              <Link to="/privacy" className="hover:text-brand">개인정보처리방침</Link>
            </div>
            <div className="mt-4 text-[#999]">
              Copyright © {new Date().getFullYear()} 오늘도가성비 All rights reserved.
            </div>
          </div>

          {/* 2. 우측 하단: SNS 아이콘 버튼 */}
          <div className="flex items-end gap-3 shrink-0">
            <a 
              href="https://www.instagram.com/omarket___/" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[11px] font-bold text-ink-muted hover:border-ink hover:text-ink transition-all bg-white"
            >
              IG
            </a>
            <a 
              href="https://open.kakao.com/o/s8rZCYzi" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[11px] font-bold text-ink-muted hover:border-ink hover:text-ink transition-all bg-white"
            >
              KT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

{/* 🔍 2열 최적화가 적용된 상품 카드 컴포넌트 */}
const ProductCard = React.memo(({ product, onClick }: { product: any, onClick: (p: any) => void }) => (
  <div onClick={() => onClick(product)} className="product-card group bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden rounded-[16px]">
    <div className="w-full aspect-square bg-gray-50/50 rounded-t-[16px] overflow-hidden relative">
      
      {/* 🌟 왼쪽 위 고급스러운 다크 레드 특가할인 배지 */}
      {product.isSpecialOffer && (
        <div className="absolute top-2 left-2 z-20 bg-red-700 text-white text-[10px] md:text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md border border-white/20">
          특가할인
        </div>
      )}

      <img src={optimizeCloudinaryUrl(product.image, 500)} alt={product.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isSoldOut ? 'grayscale-[0.5] blur-[1px]' : ''}`} referrerPolicy="no-referrer" />
      
      {product.isSoldOut && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="bg-white/95 px-4 py-2 rounded-full border border-gray-200 shadow-2xl scale-100 md:scale-110">
            <span className="text-black font-black text-xs md:text-lg tracking-[0.2em]">품절</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-brand text-ink text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md border border-white shadow-sm opacity-90">무료배송</div>
    </div>
    
    <div className="p-3 md:p-4">
      <h3 className="text-[14px] md:text-[15px] font-bold mb-0.5 text-ink line-clamp-2 break-keep">{product.name}</h3>
      <div className="text-[12px] md:text-[14px] text-ink-muted mb-1.5 line-clamp-2 break-keep">{product.description}</div>
      <div className="text-[14px] md:text-[16px] text-brand-dark font-black">{product.price}</div>
    </div>
  </div>
));

const CategoryButton = React.memo(({ cat, isActive, onClick }: { cat: string, isActive: boolean, onClick: (c: string) => void }) => (
  <button onClick={() => onClick(cat)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-brand/20 ${isActive ? 'bg-brand text-black shadow-md shadow-brand/20' : 'bg-white/40 text-gray-400 hover:bg-white/60 hover:text-ink'}`}>
    {cat}
  </button>
));

const HomePage = ({ activeCategory, setActiveCategory, setShowCompleteModal }: { activeCategory: string, setActiveCategory: (c: string) => void, setShowCompleteModal: (v: boolean) => void }) => {
  const { config, products, addOrder } = useConfig();
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isOrderView, setIsOrderView] = React.useState(false);

  // 🌟 메인 배너 슬라이드용 이미지 목록과 현재 인덱스
  const bannerImages = [
    'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    'https://res.cloudinary.com/dzehtppiz/image/upload/v1784616337/%EC%A0%95%ED%92%88%EC%88%98%EB%B0%95%EC%8D%B8_cpsozh.jpg',
    'https://res.cloudinary.com/dzehtppiz/image/upload/v1784718437/1_4_q2d5eb.jpg',
    'https://res.cloudinary.com/dzehtppiz/image/upload/v1780477844/%EB%8F%8C%EB%AF%B8%EB%82%98%EB%A6%AC%EC%8D%B8_ikbx6m.jpg',
  ];
  const [currentBanner, setCurrentBanner] = React.useState(0);

  // 🌟 4초마다 자동으로 다음 배너로 전환
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 🌟 모든 배너 이미지를 미리 불러와서(preload), 어떤 순서로 넘어가도 부드럽게 전환되도록 함
  React.useEffect(() => {
    bannerImages.forEach((url) => {
      const img = new Image();
      img.src = optimizeCloudinaryUrl(url, 1920);
    });
  }, []);

  // 모달이 닫히거나 상품이 바뀔 때 초기화
  React.useEffect(() => {
    setQuantity(1);
    setSelectedOption('');
  }, [selectedProduct]);


  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- 🔍 검색 바 상태 추가 ---
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // --- 🔍 구매 수량 및 옵션 상태 ---
  const [quantity, setQuantity] = React.useState<number>(1);
  const [selectedOption, setSelectedOption] = React.useState<string>('');

  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 12;

  // 🌟 상품 데이터가 아직 로딩 중일 때는 스피너를 보여주고, 계속 기다립니다.
  // (더미 상품 대신, 실제 데이터가 올 때까지 로딩 화면만 표시)
  if (!products || products.length === 0) {
    return (
      <div className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">상품을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 카테고리가 변경되면 검색바 및 현재 페이지 초기화
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [activeCategory]);

  // 모달이 닫히거나 바뀔 때 수량 및 옵션 초기화
  React.useEffect(() => {
    setQuantity(1);
    setSelectedOption('');
  }, [selectedProduct]);

  // 🔍 [카테고리 + 실시간 검색 + 품절상품 숨기기] 결합된 필터링 로직
  const filteredProducts = React.useMemo(() => {
    // 1. 먼저 카테고리와 검색어, 그리고 품절 여부로 필터링합니다.
    const filtered = products.filter(p => {
      const matchesCategory = activeCategory === '전체' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isNotSoldOut = !p.isSoldOut; // 🌟 품절 상품은 여기서 제외합니다.
      return matchesCategory && matchesSearch && isNotSoldOut;
    });

    // 2. 관리자 페이지에서 설정한 "카테고리 순서"를 먼저 적용하고,
    //    같은 카테고리 안에서는 "특가할인" 상품을 앞에, 그다음 개별 order 값으로 정렬합니다.
    return filtered.sort((a: any, b: any) => {
      const categoryList = config.categories || [];
      const catIndexA = categoryList.findIndex((c: any) => (typeof c === 'string' ? c : c.name) === a.category);
      const catIndexB = categoryList.findIndex((c: any) => (typeof c === 'string' ? c : c.name) === b.category);
      const safeIndexA = catIndexA === -1 ? 999 : catIndexA;
      const safeIndexB = catIndexB === -1 ? 999 : catIndexB;
      if (safeIndexA !== safeIndexB) return safeIndexA - safeIndexB;

      const isAEvent = a.isSpecialOffer;
      const isBEvent = b.isSpecialOffer;
      if (isAEvent && !isBEvent) return -1;
      if (!isAEvent && isBEvent) return 1;

      const orderA = Number(a.order) || 0;
      const orderB = Number(b.order) || 0;
      return orderA - orderB;
    });
  }, [products, activeCategory, searchQuery]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = React.useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 💡 상품 옵션 쪼개기 헬퍼 함수
  const productOptions = React.useMemo(() => {
    if (!selectedProduct || !selectedProduct.options || selectedProduct.options === '기본선택') return [];
    if (Array.isArray(selectedProduct.options)) return selectedProduct.options;
    return selectedProduct.options.split('/').map((opt: string) => opt.trim()).filter(Boolean);
  }, [selectedProduct]);

  // 💰 [완전 수정!] 옵션에 명시된 금액 자체를 총 단가로 꽂아 넣는 절대 가격 산정 방식
// 💰 [최종 수정] 괄호 안의 금액을 우선 추출하는 정규식 로직
const unitPrice = React.useMemo(() => {
  if (!selectedProduct || !selectedProduct.price) return 0;
  
  let currentUnitPrice = 0;

  if (selectedOption) {
    const bracketMatch = selectedOption.match(/\(([^)]+)\)/);
    
    if (bracketMatch) {
      const rawPrice = bracketMatch[1].replace(/[^0-9]/g, '');
      currentUnitPrice = parseInt(rawPrice, 10) || 0;
    } else {
      const priceMatch = selectedOption.match(/([0-9,]+)\s*원/);
      if (priceMatch) {
        currentUnitPrice = parseInt(priceMatch[1].replace(/[^0-9]/g, ''), 10) || 0;
      } else {
        currentUnitPrice = parseInt(selectedProduct.price.toString().replace(/[^0-9]/g, ''), 10) || 0;
      }
    }
  } else {
    currentUnitPrice = parseInt(selectedProduct.price.toString().replace(/[^0-9]/g, ''), 10) || 0;
  }
  
  return currentUnitPrice;
}, [selectedProduct, selectedOption]);

const totalPriceString = React.useMemo(() => {
  const calculatedTotal = unitPrice * quantity;
  return `${calculatedTotal.toLocaleString()}원`;
}, [unitPrice, quantity]);

  const handleOrderSubmit = async (form: HTMLFormElement) => {
    setIsSubmitting(true);
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xaqaervl", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        // 🌟 Firestore에 주문 정보 저장 (Formspree 전송과 별개로 병행 저장)
        try {
          await addOrder({
            id: `ord_${new Date().getTime()}`,
            customerName: formData.get('성함')?.toString() || '',
            phone: formData.get('연락처')?.toString() || '',
            address: formData.get('주소')?.toString() || '',
            productName: selectedProduct?.name || '',
            option: selectedOption || '',
            quantity: quantity,
            totalPrice: totalPriceString,
            paymentId: `ord_${new Date().getTime()}`,
            createdAt: new Date().toISOString(),
          });
        } catch (orderError) {
          console.error('주문 저장 실패:', orderError);
          // 🌟 저장 실패해도 고객 경험(완료 화면)은 그대로 진행 (Formspree로는 이미 전달됐으므로)
        }

        setSelectedProduct(null);
        setIsOrderView(false);
        setShowCompleteModal(true);
      } else {
        alert("주문 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* 메인 배너 (슬라이드) */}
      <section className="relative h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.img
              key={currentBanner}
              src={optimizeCloudinaryUrl(bannerImages[currentBanner], 1920)}
              alt="Hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-[38px] sm:text-[56px] md:text-[80px] font-extrabold mb-5 md:mb-8 leading-[1.15] md:leading-[1.05] text-white break-keep tracking-tight">
              오늘도 가성비,<br className="block sm:hidden" /><span className="text-brand italic">감각적인</span> 일상
            </h1>
            <p className="text-[15px] md:text-[20px] text-white/90 mb-8 md:mb-10 max-w-md break-keep">{config.description}</p>
          </motion.div>
        </div>

        {/* 🌟 하단 슬라이드 인디케이터(점) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {bannerImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`배너 ${idx + 1}번으로 이동`}
            />
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16">
        <section id="products">
          
          {/* 🔍 일체형 카테고리 & 실시간 검색 바 영역 */}
          <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 mb-8 md:mb-12 space-y-4">
            <div className="flex flex-wrap gap-2">
              {['전체', ...(config.categories || [])].map(cat => (
                <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={setActiveCategory} />
              ))}
            </div>

            {/* 깔끔하게 정돈된 손님용 검색창 */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200/60 rounded-2xl outline-none focus:ring-2 focus:ring-brand text-xs font-medium transition-all shadow-sm placeholder-gray-400" 
                placeholder={`'${activeCategory}' 카테고리 안에서 찾기... (예: 사과)`} 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-ink">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-6 px-1">상품목록</h2>

          {/* 상품 리스트 */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
  {currentProducts.map((product) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      onClick={(p) => { 
        // 품절 시 상세창을 띄우지 않고 알림만 출력
        if (p.isSoldOut) {
          alert("죄송합니다. 현재 품절된 상품입니다.");
          return;
        }
        setSelectedProduct(p); 
        setIsOrderView(false); 
      }} 
    />
  ))}
</div>

          {/* 검색결과 및 상품 없을 때 예외처리 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-24 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-medium">찾으시는 조건의 가성비 상품이 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-ink hover:bg-gray-50'}`}
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === pageNum ? 'bg-brand text-black font-black shadow-sm' : 'bg-white text-gray-400 hover:text-ink'}`}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-ink hover:bg-gray-50'}`}
              >
                다음
              </button>
            </div>
          )}
        </section>
      </main>

      {/* 📬 옵션 선택 & 주문 모달 */}
      <OrderModal 
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        totalPriceString={totalPriceString}
        unitPrice={unitPrice}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        productOptions={productOptions}
        handleOrderSubmit={handleOrderSubmit}
        isSubmitting={isSubmitting}
        isOrderView={isOrderView}
        setIsOrderView={setIsOrderView}
      />
    </div>
  );
};

const AppContent = () => {
  const [activeCategory, setActiveCategory] = React.useState('전체');
  // 💳 계좌 안내 팝업 상태 추가
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  // ✉️ 고객문의 팝업 상태 추가
  const [showContactModal, setShowContactModal] = React.useState(false);
  // ✅ 결제완료 팝업 상태 추가
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  // 🔍 주문조회 팝업 상태 추가
  const [showOrderLookup, setShowOrderLookup] = React.useState(false);
  // ✉️ 모달창 안에서 문의 제출 처리하는 함수 (기존 Footer에 있던 로직)
  const [showCart, setShowCart] = React.useState(false);

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xaqaervl", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        alert("문의가 성공적으로 전달되었습니다.");
        form.reset();
        setShowContactModal(false); // 전송 완료 후 모달 닫기
      }
    } catch (error) {
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-pretendard text-ink">
      <BannerModal />
      <MetadataManager />
      <ScrollToTop />
      {/* 🌟 Navbar에 고객문의 모달을 여는 함수를 전달합니다 */}
      <Navbar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onOpenContact={() => setShowContactModal(true)} 
        onOpenOrderLookup={() => setShowOrderLookup(true)}
        onOpenCart={() => setShowCart(true)}
      />
      
      {/* 🚀 플로팅 메뉴 추가 */}
      <FloatingMenu onOpenAccount={() => setShowAccountModal(true)} />

      <Routes>
        <Route path="/" element={<HomePage activeCategory={activeCategory} setActiveCategory={setActiveCategory} setShowCompleteModal={setShowCompleteModal} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer />

      {/* 💳 계좌 안내 팝업 */}
      {showAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAccountModal(false)}>
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-lg mb-4 text-center">입금 계좌 안내</h3>
            <div className="p-4 bg-gray-50 rounded-2xl text-center">
              <p className="text-sm font-bold text-gray-600">카카오뱅크</p>
              <p className="text-xl font-black mt-1">3333-37-4727798</p>
              <p className="text-sm font-bold text-gray-600 mt-1">예금주: 이성현(동그란마켓)</p>
            </div>
            <button onClick={() => setShowAccountModal(false)} className="w-full mt-6 py-3 bg-ink text-white font-bold rounded-xl">확인</button>
          </div>
        </div>
      )}

      {/* ✉️ 우측 상단 버튼으로 호출되는 [고객문의 모달 팝업] */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)}>
          <div className="bg-white p-8 rounded-[24px] w-full max-w-md border border-border shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-ink"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black mb-6 tracking-tight text-center">Contact Us</h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand text-sm" placeholder="성함" />
              <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand text-sm" placeholder="이메일" />
              <textarea name="message" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand h-32 text-sm" placeholder="문의 내용"></textarea>
              <button type="submit" className="w-full py-4 bg-ink text-white font-bold rounded-xl hover:bg-brand hover:text-ink transition-all">문의 보내기</button>
            </form>
          </div>
        </div>
      )}
      {/* ✅ 결제 완료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCompleteModal(false)}>
          <div className="bg-white p-8 rounded-[24px] w-full max-w-xs shadow-2xl text-center max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand/20 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-black text-lg mb-2">주문완료</h3>
            <p className="text-xs text-ink-muted mb-5 leading-relaxed">
              오늘도 가성비를 이용해주셔서 감사합니다.
            </p>
            <p className="text-[11px] font-bold text-brand-dark bg-brand/10 p-3 rounded-xl border border-brand/20 mb-5 leading-relaxed break-keep">
              🚚 배송 안내: 결제 완료 후 배송 완료까지 영업일 기준 2~3일 소요됩니다. (주말/공휴일 제외)
            </p>

            {/* 🌟 CS(환불/교환) 안내 아코디언 */}
            <details className="text-left mb-5 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <summary className="cursor-pointer select-none px-4 py-3 text-[11px] font-bold text-ink-muted flex items-center justify-between">
                교환/환불(CS) 안내 보기
                <ChevronDown size={14} />
              </summary>
              <div className="px-4 pb-4 pt-1 text-[10.5px] text-ink-muted leading-relaxed space-y-3 break-keep">
                <div>
                  <p className="font-bold text-ink mb-1">[CS 접수방법]</p>
                  <p>사진증빙이 필요하여 고객수령자명과 함께 카톡접수로 부탁드립니다.</p>
                </div>
                <div>
                  <p className="font-bold text-ink mb-1">[CS 처리방안]</p>
                  <p>1. 부분환불&nbsp;&nbsp;2. 재발송&nbsp;&nbsp;3. 환불</p>
                </div>
                <div>
                  <p className="font-bold text-ink mb-1">[CS 불가한 경우]</p>
                  <p>1. 고객님의 주관적인 단순 변심<br/>(사진과 다르다, 맛이 없다, 크기가 작다, 모양이 일정하지 않다 등)</p>
                  <p className="mt-1">2. 고객님의 귀책 사유<br/>(수령주소·수령인 번호 오류로 오도착한 경우)</p>
                  <p className="mt-1">3. 기간이 경과한 경우<br/>(제품 수령 후 1~2일 경과 시 보관환경 확인 불가로 처리 어려움)</p>
                </div>
                <div>
                  <p className="font-bold text-ink mb-1">Q. 제품이 파손되어 왔어요.</p>
                  <p>간혹 배송 중 제품이 험하게 다뤄지는 경우가 있습니다. 상품 특성상 사진이 필요하여 1:1 문의를 통해 부분환불·환불·재발송 중 원하시는 방향으로 도와드립니다.</p>
                </div>
              </div>
            </details>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-ink text-white font-bold rounded-xl text-sm"
              >
                상품 더 보기
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="w-full py-3 bg-gray-100 text-ink-muted font-bold rounded-xl text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 주문조회 모달 */}
      {showOrderLookup && (
        <OrderLookupModal onClose={() => setShowOrderLookup(false)} />
      )}

      {/* 🛒 장바구니 모달 */}
      {showCart && (
        <CartModal 
          onClose={() => setShowCart(false)} 
          onOrderComplete={() => {
            setShowCart(false);
            setShowCompleteModal(true);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ConfigProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ConfigProvider>
  );
}