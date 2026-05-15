import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { motion, AnimatePresence } from 'motion/react';
// 빌드 오류 방지를 위해 사용하지 않는 firebase 관련 import만 제거했습니다.
import { Menu, X, MessageCircle, Settings, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

// --- 관리자 페이지 임포트 (src/pages/AdminPage.tsx 파일이 반드시 있어야 합니다) ---
import AdminPage from './pages/AdminPage';

// --- Components ---

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

  const navLinks = [
    { name: '메인', path: '#', category: '전체' },
    { name: '농산물', path: '#products', category: '농산물' },
    { name: '수산물', path: '#products', category: '수산물' },
    { name: '전체상품', path: '#products', category: '전체' },
    { name: '고객센터', path: '#contact' },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.name === '메인') {
      e.preventDefault();
      setActiveCategory('전체');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.category) {
      e.preventDefault();
      setActiveCategory(link.category);
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.path.startsWith('#')) {
      e.preventDefault();
      const id = link.path.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
            <motion.a 
              key={link.name} 
              href={link.path} 
              onClick={(e) => handleNavLinkClick(e, link)}
              initial="initial"
              whileHover="hover"
              className={`group relative py-2 text-[14px] font-bold transition-colors ${
                (link.category && activeCategory === link.category) ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {link.name}
              <motion.div 
                className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-brand rounded-full origin-left ${
                  (link.category && activeCategory === link.category) ? 'scale-x-100 opacity-100' : ''
                }`}
                variants={{
                  initial: { scaleX: link.category && activeCategory === link.category ? 1 : 0, opacity: link.category && activeCategory === link.category ? 1 : 0 },
                  hover: { scaleX: 1, opacity: 1 }
                }}
                transition={{ duration: 0.3, ease: "circOut" }}
              />
            </motion.a>
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
              <a
                key={link.name}
                href={link.path}
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
              </a>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-gray-500 py-2"
            >
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
            <form action="https://formspree.io/f/xaqaervl" method="POST" className="space-y-4">
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

const ProductCard = React.memo(({ product, onClick }: { product: any, onClick: (p: any) => void }) => (
  <div onClick={() => onClick(product)} className="product-card group bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden">
    <div className="w-full aspect-square bg-gray-50/50 rounded-[12px] mb-4 overflow-hidden relative">
      <img src={product.image} alt={product.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isSoldOut ? 'grayscale-[0.5] blur-[1px]' : ''}`} referrerPolicy="no-referrer" />
      {product.isSoldOut && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="bg-white/95 px-6 py-2.5 rounded-full border border-gray-200 shadow-2xl scale-110">
            <span className="text-black font-black text-sm md:text-lg tracking-[0.2em]">품절</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-brand text-ink text-[10px] font-bold px-2 py-1 rounded-lg border border-white shadow-sm opacity-90">무료배송</div>
    </div>
    <h3 className="text-[15px] font-semibold mb-1 text-ink px-4">{product.name}</h3>
    <div className="text-[14px] text-ink-muted mb-2 line-clamp-1 px-4">{product.description}</div>
    <div className="text-[16px] text-brand-dark font-bold px-4 pb-4">{product.price}</div>
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
  const [isOrderView, setIsOrderView] = React.useState(false); // 주문 화면 전환 상태 추가

  const filteredProducts = React.useMemo(() => {
    return activeCategory === '전체' ? [...products] : products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="pt-20">
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-[56px] md:text-[80px] font-extrabold mb-8 leading-[1.05] text-white">오늘도 가성비,<br /><span className="text-brand italic">감각적인</span> 일상</h1>
            <p className="text-[18px] md:text-[20px] text-white/90 mb-10">{config.description}</p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-10 py-16">
        <section id="products">
          <div className="flex flex-wrap gap-2 mb-12">
            {['전체', ...(config.categories || [])].map(cat => (
              <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={setActiveCategory} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={(p) => { setSelectedProduct(p); setIsOrderView(false); }} />
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div