import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, MessageCircle, Settings, LogIn, ChevronRight, Mail, Phone, MapPin, Plus, Trash2, Edit2, Save } from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const { config } = useConfig();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'ABOUT', path: '#' },
    { name: '농산물', path: '#products' },
    { name: '수산물', path: '#products' },
    { name: 'PRODUCTS', path: '#products' },
    { name: 'CONTACT', path: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        <Link to="/" className="text-[20px] font-extrabold tracking-[-0.5px] flex items-center gap-2">
          <div className="w-3 h-3 bg-brand rounded-full"></div>
          {config.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.path} className="text-[14px] font-medium text-ink-muted hover:text-ink transition-colors">
              {link.name}
            </a>
          ))}
          <Link to="/admin" className="bg-ink text-white px-[18px] py-2 rounded-[20px] text-[12px] font-semibold hover:opacity-90 transition-all">
            관리자 대시보드
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
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
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium py-2 border-b border-gray-50"
              >
                {link.name}
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
            </div>
          </div>
          <div className="bg-white p-8 rounded-[24px] border border-border">
            <form className="space-y-4">
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand" placeholder="성함" />
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand" placeholder="이메일" />
              <textarea className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand h-32" placeholder="문의 내용"></textarea>
              <button className="w-full py-4 bg-ink text-white font-bold rounded-xl hover:bg-brand hover:text-ink transition-all">
                문의 보내기
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-border">
          <div className="text-[11px] text-[#888] leading-relaxed">
            상호명: {config.name} | 사업자등록번호: 000-00-00000 | 대표: 홍길동<br />
            주소: {config.address} | Copyright © {new Date().getFullYear()} ValueToday All rights reserved.
          </div>
          
          <div className="flex gap-4">
            <a href={config.sns.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[12px] text-ink-muted hover:border-ink hover:text-ink transition-all">
              IG
            </a>
            <a href={config.sns.kakao} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[12px] text-ink-muted hover:border-ink hover:text-ink transition-all">
              KT
            </a>
            <div className="w-8 h-8 rounded-full border border-[#ddd] flex items-center justify-center text-[12px] text-ink-muted cursor-pointer hover:border-ink hover:text-ink transition-all">
              FB
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = () => {
  const { config, products, posts } = useConfig();
  const [activeCategory, setActiveCategory] = React.useState('전체');

  const filteredProducts = activeCategory === '전체' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[320px] px-10 flex items-center bg-white/30 backdrop-blur-[2px] overflow-hidden border-b border-white/20">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[500px] z-10"
          >
            <span className="text-[12px] font-bold text-brand-dark uppercase tracking-[1px] mb-3 block">
              PREMIUM QUALITY & VALUE
            </span>
            <h1 className="text-[48px] font-extrabold mb-5 leading-[1.1] tracking-[-1.5px]">
              오늘도 가성비,<br />일상의 가치를 더하다
            </h1>
            <p className="text-[16px] text-ink-muted mb-8 leading-[1.6]">
              {config.description}
            </p>
            <div className="flex gap-3">
              <button className="bg-brand px-7 py-3.5 rounded-[30px] font-bold cursor-pointer hover:opacity-90 transition-all">
                상품 문의하기
              </button>
            </div>
          </motion.div>
          
          <div className="hidden lg:flex w-[380px] h-[240px] bg-brand-soft/50 rounded-[24px] items-center justify-center relative overflow-hidden backdrop-blur-md border border-white/50">
            <img 
              src={config.heroImage} 
              alt="Hero" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] tracking-[2px] text-brand-dark opacity-50 font-semibold">IMAGE VISUAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-10 py-16">
        {/* Products Section */}
        <section id="products">
          <div className="section-title mb-12">
            추천 상품 <span onClick={() => setActiveCategory('전체')}>전체보기</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-12">
            {['전체', '농산물', '수산물', '주방용품', '생활가전', '욕실용품'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-brand/20 ${activeCategory === cat ? 'bg-brand text-black shadow-md shadow-brand/20' : 'bg-white/40 text-gray-400 hover:bg-white/60 hover:text-ink'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card group bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md">
                <div className="w-full aspect-square bg-gray-50/50 rounded-[12px] mb-4 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>
                <h3 className="text-[15px] font-semibold mb-1 text-ink">{product.name}</h3>
                <div className="text-[14px] text-ink-muted mb-2 line-clamp-1">{product.description}</div>
                <div className="text-[16px] text-brand-dark font-bold">{product.price}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-5 right-5 bg-brand-dark text-white px-3 py-1.5 rounded-[4px] text-[10px] font-bold tracking-[0.5px] shadow-lg z-[100]">
        CMS EDITABLE MODE
      </div>
    </div>
  );
};

const AdminPage = () => {
  const { config, updateConfig, products, addProduct, updateProduct, deleteProduct, posts, addPost, updatePost, deletePost } = useConfig();
  const [activeTab, setActiveTab] = React.useState<'site' | 'products' | 'posts'>('site');

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">관리자 대시보드</h1>
            <p className="text-gray-500 text-sm">웹사이트의 모든 콘텐츠를 실시간으로 관리하세요.</p>
          </div>
          <Link to="/" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
            사이트 보기
          </Link>
        </div>

        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit">
          <button 
            onClick={() => setActiveTab('site')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'site' ? 'bg-brand text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            기본 정보 설정
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-brand text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            상품 관리
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-brand text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            소식 관리
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-8 md:p-12 shadow-sm">
          {activeTab === 'site' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">사이트 이름</label>
                  <input 
                    type="text" 
                    value={config.name} 
                    onChange={(e) => updateConfig({ name: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">슬로건</label>
                  <input 
                    type="text" 
                    value={config.slogan} 
                    onChange={(e) => updateConfig({ slogan: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">사이트 설명</label>
                <textarea 
                  value={config.description} 
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none h-32 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">히어로 이미지 URL</label>
                <input 
                  type="text" 
                  value={config.heroImage} 
                  onChange={(e) => updateConfig({ heroImage: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">이메일</label>
                  <input 
                    type="text" 
                    value={config.contactEmail} 
                    onChange={(e) => updateConfig({ contactEmail: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">전화번호</label>
                  <input 
                    type="text" 
                    value={config.phone} 
                    onChange={(e) => updateConfig({ phone: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">인스타그램 링크</label>
                  <input 
                    type="text" 
                    value={config.sns.instagram} 
                    onChange={(e) => updateConfig({ sns: { ...config.sns, instagram: e.target.value } })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-brand hover:text-black transition-all flex items-center gap-2">
                  <Save size={18} /> 설정 저장하기
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">등록된 상품 ({products.length})</h3>
                <button 
                  onClick={() => addProduct({
                    id: Date.now().toString(),
                    name: '새로운 상품',
                    price: '0원',
                    description: '상품 설명을 입력하세요.',
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
                    category: '기타'
                  })}
                  className="px-4 py-2 bg-brand text-black font-bold rounded-xl flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> 상품 추가
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
                    <img src={product.image} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                      <input 
                        type="text" 
                        value={product.name} 
                        onChange={(e) => updateProduct(product.id, { ...product, name: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                        placeholder="상품명"
                      />
                      <input 
                        type="text" 
                        value={product.price} 
                        onChange={(e) => updateProduct(product.id, { ...product, price: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                        placeholder="가격"
                      />
                      <input 
                        type="text" 
                        value={product.category} 
                        onChange={(e) => updateProduct(product.id, { ...product, category: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                        placeholder="카테고리"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">등록된 소식 ({posts.length})</h3>
                <button 
                  onClick={() => addPost({
                    id: Date.now().toString(),
                    title: '새로운 소식',
                    excerpt: '소식 내용을 입력하세요.',
                    date: new Date().toLocaleDateString(),
                    image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1000&auto=format&fit=crop'
                  })}
                  className="px-4 py-2 bg-brand text-black font-bold rounded-xl flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> 소식 추가
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {posts.map(post => (
                  <div key={post.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
                    <img src={post.image} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <input 
                        type="text" 
                        value={post.title} 
                        onChange={(e) => updatePost(post.id, { ...post, title: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                        placeholder="제목"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => deletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
}
