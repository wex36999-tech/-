import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageCircle, Settings, ChevronRight, Mail, Phone, MapPin, Plus, Minus } from 'lucide-react';

// --- 관리자 페이지 임포트 ---
import AdminPage from './pages/AdminPage';

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
    document.title = `${config.name} | ${config.slogan}`;
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
    setMetaTag('og:title', config.name);
    setMetaTag('og:description', config.description);
    setMetaTag('og:image', config.heroImage);
    setMetaTag('og:type', 'website');
    setMetaTag('twitter:card', 'summary_large_image', 'name');
    setMetaTag('twitter:title', config.name, 'name');
    setMetaTag('twitter:description', config.description, 'name');
    setMetaTag('twitter:image', config.heroImage, 'name');
  }, [config]);

  return null;
};

const Navbar = ({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) => {
  const { config } = useConfig();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '메인', path: '#', category: '전체' },
    { name: '농산물', path: '#products', category: '농산물' },
    { name: '수산물', path: '#products', category: '수산물' },
    { name: '전체상품', path: '#products', category: '전체' },
    { name: '고객센터', path: '#contact' },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (location.pathname !== '/') {
      return;
    }

    if (link.name === '메인') {
      e.preventDefault();
      setActiveCategory('전체');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.category) {
      e.preventDefault();
      setActiveCategory(link.category);
      setTimeout(() => {
        const element = document.getElementById('products');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.path.startsWith('#')) {
      e.preventDefault();
      const id = link.path.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
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
                (link.category && activeCategory === link.category) ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {link.name}
              <motion.div 
                className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-brand rounded-full origin-left ${
                  (link.category && activeCategory === link.category) ? 'scale-x-100 opacity-100' : ''
                }`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: link.category && activeCategory === link.category ? 1 : 0, 
                  opacity: link.category && activeCategory === link.category ? 1 : 0 
                }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "circOut" }}
              />
            </Link>
          ))}
          <Link to="/admin" className="bg-ink text-white px-5 py-2.5 rounded-full text-[12px] font-bold hover:bg-brand hover:text-ink transition-all shadow-lg shadow-black/5">
            관리자
          </Link>
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
                  (link.category && activeCategory === link.category) ? 'text-brand' : 'text-ink'
                }`}
              >
                {link.name}
                <ChevronRight size={20} className={`${(link.category && activeCategory === link.category) ? 'text-brand' : 'text-gray-300'} group-hover:text-brand transition-colors`} />
              </Link>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-500 py-2">
              <Settings size={20} /> 관리자 설정
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { config } = useConfig();
  
  const handleFooterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      }
    } catch (error) {
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <footer id="contact" className="bg-[#fafafa] border-t border-border py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-8 tracking-tight">Contact Us</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-brand-dark" />
                <span className="text-ink-muted">{config.contactEmail}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-brand-dark" />
                <span className="text-ink-muted">{config.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-brand-dark" />
                <span className="text-ink-muted">{config.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-5 flex justify-center text-[10px] font-bold text-brand-dark border border-brand-dark rounded px-0.5 leading-none py-1">사업</div>
                <span className="text-ink-muted leading-none">사업자등록번호: {config.businessNumber}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[24px] border border-border mt-10 md:mt-0">
            <form onSubmit={handleFooterSubmit} className="space-y-4">
              <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand" placeholder="성함" />
              <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand" placeholder="이메일" />
              <textarea name="message" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand h-32" placeholder="문의 내용"></textarea>
              <button type="submit" className="w-full py-4 bg-ink text-white font-bold rounded-xl hover:bg-brand hover:text-ink transition-all">문의 보내기</button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-border">
          <div className="text-[11px] text-[#888] leading-relaxed">
            상호명: {config.name} | 사업자등록번호: {config.businessNumber} | 대표: {config.representative}<br />
            주소: {config.address} | Copyright © {new Date().getFullYear()} ValueToday All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href={config.sns?.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[12px] text-ink-muted hover:border-ink hover:text-ink transition-all">IG</a>
            <a href={config.sns?.kakao} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[12px] text-ink-muted hover:border-ink hover:text-ink transition-all">KT</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

{/* 🔍 2열 최적화가 적용된 상품 카드 컴포넌트 */}
const ProductCard = React.memo(({ product, onClick }: { product: any, onClick: (p: any) => void }) => (
  <div onClick={() => onClick(product)} className="product-card group bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden rounded-[16px]">
    {/* 모바일 배송 라벨 최적화 및 간격 조정 */}
    <div className="w-full aspect-square bg-gray-50/50 rounded-t-[16px] overflow-hidden relative">
      <img src={product.image} alt={product.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isSoldOut ? 'grayscale-[0.5] blur-[1px]' : ''}`} referrerPolicy="no-referrer" />
      {product.isSoldOut && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="bg-white/95 px-4 py-2 rounded-full border border-gray-200 shadow-2xl scale-100 md:scale-110">
            <span className="text-black font-black text-xs md:text-lg tracking-[0.2em]">품절</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-brand text-ink text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md border border-white shadow-sm opacity-90">무료배송</div>
    </div>
    
    {/* 모바일 글자 크기와 카드 하단 여백 다듬기 */}
    <div className="p-3 md:p-4">
      <h3 className="text-[14px] md:text-[15px] font-bold mb-0.5 text-ink line-clamp-1 break-keep">{product.name}</h3>
      <div className="text-[12px] md:text-[14px] text-ink-muted mb-1.5 line-clamp-1 break-keep">{product.description}</div>
      <div className="text-[14px] md:text-[16px] text-brand-dark font-black">{product.price}</div>
    </div>
  </div>
));

const CategoryButton = React.memo(({ cat, isActive, onClick }: { cat: string, isActive: boolean, onClick: (c: string) => void }) => (
  <button onClick={() => onClick(cat)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-brand/20 ${isActive ? 'bg-brand text-black shadow-md shadow-brand/20' : 'bg-white/40 text-gray-400 hover:bg-white/60 hover:text-ink'}`}>
    {cat}
  </button>
));

const HomePage = ({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) => {
  const { config, products } = useConfig();
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isOrderView, setIsOrderView] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- 🔍 구매 수량 및 옵션 상태 추가 ---
  const [quantity, setQuantity] = React.useState<number>(1);
  const [selectedOption, setSelectedOption] = React.useState<string>('');

  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // 모달이 닫히거나 바뀔 때 수량 및 옵션 초기화
  React.useEffect(() => {
    setQuantity(1);
    setSelectedOption('');
  }, [selectedProduct, isOrderView]);

  const filteredProducts = React.useMemo(() => {
    return activeCategory === '전체' ? [...products] : products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = React.useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 상품에 등록된 옵션을 배열로 가공하는 헬퍼 함수
  const productOptions = React.useMemo(() => {
    if (!selectedProduct || !selectedProduct.options) return [];
    if (Array.isArray(selectedProduct.options)) return selectedProduct.options;
    return selectedProduct.options.split(',').map((opt: string) => opt.trim()).filter(Boolean);
  }, [selectedProduct]);

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 옵션이 존재하는데 소비자가 선택하지 않은 경우 체크
    if (productOptions.length > 0 && !selectedOption) {
      alert("상품 옵션을 선택해 주세요.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("https://formspree.io/f/xaqaervl", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert("감사합니다. 배송안내 문자를 확인해주세요 오늘도 가성비!");
        setSelectedProduct(null);
        setIsOrderView(false);
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
      {/* 🔍 메인 배너 모바일 텍스트 깨짐 수정 부분 */}
      <section className="relative h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg" alt="Hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            {/* break-keep, 자간 tracking-tight, 모바일 전용 줄바꿈 조절로 정렬 최적화 */}
            <h1 className="text-[38px] sm:text-[56px] md:text-[80px] font-extrabold mb-5 md:mb-8 leading-[1.15] md:leading-[1.05] text-white break-keep tracking-tight">
              오늘도 가성비,<br className="block sm:hidden" /><span className="text-brand italic">감각적인</span> 일상
            </h1>
            <p className="text-[15px] md:text-[20px] text-white/90 mb-8 md:mb-10 max-w-md break-keep">{config.description}</p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16">
        <section id="products">
          <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
            {['전체', ...(config.categories || [])].map(cat => (
              <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={setActiveCategory} />
            ))}
          </div>

          <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-6 px-1">상품목록</h2>

          {/* 🔍 모바일 2열 간격 좁혀서 트렌디하게 디자인 다듬기 (gap-3 적용) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={(p) => { setSelectedProduct(p); setIsOrderView(false); }} />
            ))}
          </div>

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

      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white max-w-3xl w-full max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[calc(90vh-16rem)] md:max-h-[90vh]">
                {!isOrderView ? (
                  <>
                    <div className="mb-2"><span className="text-[12px] font-bold text-brand-dark bg-brand/10 px-3 py-1 rounded-full">{selectedProduct.category}</span></div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-ink">{selectedProduct.name}</h2>
                    
                    <p className="text-ink-muted mb-8 text-[15px] leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-2xl font-black text-ink">{selectedProduct.price}</span>
                      <button onClick={() => setIsOrderView(true)} className="bg-brand text-black px-8 py-4 rounded-2xl font-bold">구매하기</button>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <button onClick={() => setIsOrderView(false)} className="text-gray-400 text-sm mb-4 hover:text-ink">← 뒤로가기</button>
                    <h2 className="text-2xl font-black mb-6">주문서 작성</h2>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      {/* 숨겨진 폼 데이터 전송용 태그들 */}
                      <input type="hidden" name="상품명" value={selectedProduct.name} />
                      <input type="hidden" name="구매수량" value={quantity} />
                      {productOptions.length > 0 && (
                        <input type="hidden" name="선택옵션" value={selectedOption} />
                      )}

                      {/* --- 🔍 옵션 선택 필드 추가 --- */}
                      {productOptions.length > 0 && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-ink-muted px-1">옵션 선택</label>
                          <select 
                            value={selectedOption} 
                            onChange={(e) => setSelectedOption(e.target.value)}
                            required
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-[14px] font-medium border border-transparent focus:border-brand appearance-none cursor-pointer"
                          >
                            <option value="" disabled>옵션을 선택해주세요</option>
                            {productOptions.map((opt: string, idx: number) => (
                              <option key={idx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* --- 🔍 수량 조절 필드 추가 --- */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-ink-muted px-1">수량 조절</label>
                        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-transparent">
                          <span className="text-sm font-bold text-ink pl-2">{quantity}개</span>
                          <div className="flex items-center gap-1">
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => prev + 1)}
                              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-ink-muted px-1">배송 정보</label>
                        <input name="성함" required placeholder="받으시는 분 성함" className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                      </div>
                      <input name="연락처" required placeholder="연락처" className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                      <textarea name="주소" required placeholder="배송지 주소" className="w-full p-4 bg-gray-50 rounded-xl outline-none h-24"></textarea>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-4 font-bold rounded-xl transition-all mt-4 ${isSubmitting ? 'bg-gray-300' : 'bg-ink text-white hover:bg-brand hover:text-ink'}`}
                      >
                        {isSubmitting ? "전송 중..." : "주문 완료"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><X size={20} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppContent = () => {
  const [activeCategory, setActiveCategory] = React.useState('전체');
  return (
    <div className="min-h-screen bg-white font-pretendard text-ink">
      <MetadataManager />
      <ScrollToTop />
      <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <Routes>
        <Route path="/" element={<HomePage activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
}