import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Package, Settings, Lock, Edit3, Eye, EyeOff, FolderPlus, X, Search, ArrowUp, ArrowDown, Save } from 'lucide-react';

// 🔒 사장님이 요청하신 관리자 새 비밀번호!
const ADMIN_PASSWORD = '0121';

// 상품 인터페이스 정의 (타입 안전성 확보)
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  detailImages?: string; // 👈 여기 추가
  category: string;
  options: string;
  isSoldOut: boolean;
  order?: number;
}

const AdminPage = () => {
  // 👈 파이어베이스 실시간 구글 서버 기능 연동
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    config, 
    updateConfig 
  } = useConfig();

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // ConfigContext(구글 서버)에서 보관하는 카테고리 데이터
  const categories: string[] = config.categories || ['농산물', '수산물'];
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 🔍 상품 실시간 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 상품 목록 필터링용 상태
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');

  // 상품 등록 팝업(모달) 제어 상태
  const [showAddModal, setShowAddModal] = useState(false);

  // 상품 등록 폼 상태
// 상품 등록 폼 상태 (수정 완료!)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    detailImages: '', // 👈 이거 하나만 추가!
    category: categories[0] || '농산물',
    options: '', 
    isSoldOut: false,
    order: 0
  });

  // 상품 수정 모달 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 💡 미니 저장 알림창(Toast) 제어 상태
  const [showToast, setShowToast] = useState(false);

  // 비밀번호 검사
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 틀렸습니다!');
      setPasswordInput('');
    }
  };

  // 1. 카테고리 추가 함수
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('이미 존재하는 카테고리입니다.');
      return;
    }
    const updatedCategories = [...categories, newCategoryName.trim()];
    await updateConfig({ categories: updatedCategories });
    setNewCategoryName('');
  };

  // 2. 카테고리 삭제 함수
  const handleDropCategory = async (catName: string) => {
    if (window.confirm(`'${catName}' 카테고리를 삭제하시겠습니까?`)) {
      const updatedCategories = categories.filter(c => c !== catName);
      await updateConfig({ categories: updatedCategories });
      
      // 현재 선택된 필터가 삭제된 카테고리라면 '전체'로 되돌리기
      if (selectedFilter === catName) {
        setSelectedFilter('전체');
      }
      if (newProduct.category === catName) {
        setNewProduct({ ...newProduct, category: updatedCategories[0] || '' });
      }
    }
  };

  // 🔄 3. 카테고리 순서 변경 함수
  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const updatedCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updatedCategories.length) return;

    const temp = updatedCategories[index];
    updatedCategories[index] = updatedCategories[targetIndex];
    updatedCategories[targetIndex] = temp;

    await updateConfig({ categories: updatedCategories });
  };

  // 4. 새 상품 등록 함수 (★ 입력한 그대로 완벽 보존)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    
    // 쉼표를 건드리지 않고, 사장님이 입력하신 텍스트 형태 그대로 저장합니다.
    const finalOptions = newProduct.options.trim() || '기본선택';
    
    // order 값을 포함하여 데이터 저장 (숫자형으로 변환)
    await addProduct({ 
      ...newProduct, 
      id, 
      options: finalOptions, 
      order: Number(newProduct.order) 
    });
    
    setNewProduct({ 
      name: '', 
      price: '', 
      description: '', 
      image: '', 
      detailImages: '', // detailImages도 초기화 추가
      category: categories[0] || '농산물', 
      options: '',
      isSoldOut: false,
      order: 0 // order 초기화 추가
    });
    setShowAddModal(false);
    alert('상품이 구글 데이터베이스에 안전하게 등록되었습니다!');
  };

  // 5. 상품 수정 저장 함수 (★ 입력한 그대로 완벽 보존)
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    // 수정할 때도 가격의 쉼표를 방해하지 않고 그대로 깔끔하게 저장합니다.
    const finalOptions = (editingProduct.options || '').trim() || '기본선택';
    
    // order 값을 포함하여 데이터 업데이트 (숫자형으로 변환)
    await updateProduct(editingProduct.id, { 
      ...editingProduct, 
      options: finalOptions, 
      order: Number(editingProduct.order) 
    });
    
    setShowEditModal(false);
    alert('상품 정보가 실시간으로 수정되었습니다!');
  };

  // 6. 품절 토글 함수
  const toggleSoldOut = async (product: Product) => {
    const updatedProduct = { ...product, isSoldOut: !product.isSoldOut };
    await updateProduct(product.id, updatedProduct);
  };

  // 7. 상품 삭제 함수
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteProduct(id);
      alert('상품이 삭제되었습니다.');
    }
  };

  const handleMainSave = () => {
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // 카테고리 변경 시 등록 폼의 기본 카테고리 동기화
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(newProduct.category)) {
      setNewProduct(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, newProduct.category]);

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = selectedFilter === '전체' || p.category === selectedFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isAuthorized) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-xl w-full text-center">
          <div className="w-16 h-16 bg-brand/10 text-brand-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-black mb-2">관리자 인증</h1>
          <p className="text-gray-400 text-sm mb-8">안전한 상점 관리를 위해 비밀번호를 입력해주세요.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand text-center text-lg tracking-widest" placeholder="••••" required />
            <button type="submit" className="w-full py-4 bg-ink text-white font-extrabold rounded-2xl hover:bg-brand hover:text-ink transition-all shadow-md">로그인</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative">
      
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-ink/90 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl animate-bounce text-sm font-bold border border-white/10 backdrop-blur-sm">
          <div className="w-2 h-2 bg-brand rounded-full"></div>
          성공적으로 저장되었습니다.
        </div>
      )}

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Settings className="text-brand-dark" />
          <h1 className="text-3xl font-black">오늘도가성비 관리자</h1>
        </div>
        <button onClick={() => setIsAuthorized(false)} className="text-xs font-bold text-gray-400 hover:text-red-500 border border-gray-200 px-4 py-2 rounded-xl bg-white transition-all">로그아웃</button>
      </div>

      {/* 등록된 상품 관리 한 축으로 넓게 재배치 */}
      <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Package size={24} className="text-gray-700" />
            <h2 className="text-2xl font-black text-ink">
              등록된 상품 관리 <span className="text-brand-dark text-lg ml-1">({filteredProducts.length})</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-2xl transition-all">
              <FolderPlus size={16} /> 카테고리 편집
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 text-sm font-extrabold text-black bg-brand hover:shadow-md px-5 py-3 rounded-2xl transition-all">
              <Plus size={18} /> 새 상품 등록
            </button>
          </div>
        </div>

        {/* 실시간 상품 검색창 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand text-sm font-medium" placeholder="수정할 상품의 이름을 입력해 보세요... (예: 장어)" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-ink"><X size={16} /></button>
          )}
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="flex gap-1.5 bg-gray-50 p-1.5 rounded-2xl mb-6 overflow-x-auto border border-gray-100">
          <button onClick={() => setSelectedFilter('전체')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${selectedFilter === '전체' ? 'bg-white shadow-sm text-ink font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}>전체</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedFilter(cat)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${selectedFilter === cat ? 'bg-white shadow-sm text-ink font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}>{cat}</button>
          ))}
        </div>

        {/* 상품 리스트 */}
        <div className="space-y-3 pr-1">
          {filteredProducts.map((product: Product) => (
            <div key={product.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/70 rounded-2xl transition-all border gap-4 ${product.isSoldOut ? 'border-dashed border-gray-300 opacity-60' : 'border-transparent shadow-sm'}`}>
              <div onClick={() => { setEditingProduct(product); setShowEditModal(true); }} className="flex items-center gap-4 cursor-pointer flex-1">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 border border-gray-100 flex-shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt="" />
                  {product.isSoldOut && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-xs text-white font-black tracking-wider">품절</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-base text-ink">{product.name}</p>
                    <span className="text-[11px] px-2 py-0.5 bg-white border border-gray-200 text-gray-500 font-bold rounded-lg shadow-sm">{product.category}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 mt-1">{product.price}</p>
                  {product.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xl">{product.description}</p>}
                  {product.options && product.options !== '기본선택' && (
                    <p className="text-[11px] text-brand-dark font-semibold mt-1">옵션: {product.options}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                <button onClick={(e) => { e.stopPropagation(); toggleSoldOut(product); }} className={`p-2.5 rounded-xl transition-all ${product.isSoldOut ? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-400 hover:text-ink shadow-sm'}`} title={product.isSoldOut ? "판매중으로 변경" : "품절처리"}>
                  {product.isSoldOut ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowEditModal(true); }} className="p-2.5 bg-white text-gray-400 hover:text-ink rounded-xl shadow-sm transition-all">
                  <Edit3 size={18} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Package size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">검색어와 일치하거나 등록된 상품이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측 하단 고정형 대형 저장하기 버튼 */}
      <button 
        onClick={handleMainSave}
        className="fixed bottom-8 right-8 z-[150] flex items-center gap-2 bg-ink text-white hover:bg-brand hover:text-black font-black px-7 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-white/10"
      >
        <Save size={20} className="group-hover:rotate-12 transition-transform" />
        저장하기
      </button>


      {/* 📬 팝업 1: 새 상품 등록 모달 */}
{showAddModal && (
  <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-border shadow-2xl my-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-xl flex items-center gap-2">
          <Plus size={22} className="text-brand-dark" /> 새 상품 등록
        </h3>
        <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
      </div>

      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">상품명</label>
          <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 꿀사과 5kg" />
        </div>
        
        {/* 👈 우선순위 입력창 추가 */}
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">우선순위 (숫자가 작을수록 먼저 노출)</label>
          <input type="number" value={newProduct.order || 0} onChange={e => setNewProduct({...newProduct, order: parseInt(e.target.value) || 0})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">가격 (쉼표 사용 가능)</label>
            <input required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 13,000원" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">카테고리 선택</label>
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">구매 옵션 (오직 슬래시 / 로만 구분)</label>
          <input value={newProduct.options} onChange={e => setNewProduct({...newProduct, options: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 2kg 10,000원 / 3kg 15,000원 / 5kg 23,500원" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL (Cloudinary)</label>
          <input required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="https://res.cloudinary.com/..." />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">상세 이미지 URL (쉼표로 구분)</label>
          <input value={newProduct.detailImages} onChange={e => setNewProduct({...newProduct, detailImages: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: url1, url2" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">상품 설명</label>
          <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand h-24" placeholder="상품 설명을 적어주세요."></textarea>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-extrabold rounded-2xl hover:bg-gray-200 transition-all">취소</button>
          <button type="submit" className="flex-1 py-4 bg-brand text-black font-extrabold rounded-2xl hover:shadow-lg transition-all">등록하기</button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* 📬 팝업 2: 카테고리 편집 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-border shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg">카테고리 편집</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand text-sm" placeholder="예: 축산물, 과일류" />
              <button type="submit" className="px-4 bg-brand text-black font-bold text-sm rounded-xl transition-all">추가</button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((cat, index) => (
                <div key={cat} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-sm font-bold">
                  <span className="truncate max-w-[140px]">{cat}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => handleMoveCategory(index, 'up')} disabled={index === 0} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-20 transition-all" title="위로"><ArrowUp size={15} /></button>
                    <button type="button" onClick={() => handleMoveCategory(index, 'down')} disabled={index === categories.length - 1} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-20 transition-all" title="아래로"><ArrowDown size={15} /></button>
                    <button type="button" onClick={() => handleDropCategory(cat)} className="text-red-400 hover:text-red-600 text-xs px-2 py-1 ml-1 transition-all">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 팝업 3: 상품 상세 수정 모달 */}
{showEditModal && editingProduct && (
  <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-border shadow-2xl my-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-xl">상품 정보 수정</h3>
        <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
      </div>
      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">상품명</label>
          <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
        </div>

        {/* 팝업 3: 상품 상세 수정 모달 */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-border shadow-2xl my-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl">상품 정보 수정</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">상품명</label>
                  <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">우선순위 (숫자가 작을수록 우선 노출)</label>
                  <input type="number" value={editingProduct.order || 0} onChange={e => setEditingProduct({...editingProduct, order: parseInt(e.target.value) || 0})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">가격 (쉼표 사용 가능)</label>
                    <input required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">카테고리</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand">
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">구매 옵션 (오직 슬래시 / 로만 구분)</label>
                  <input value={editingProduct.options || ''} onChange={e => setEditingProduct({...editingProduct, options: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 2kg 10,000원 / 3kg 15,000원 / 5kg 23,500원" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL (Cloudinary)</label>
                  <input required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">상세 이미지 URL (쉼표로 구분)</label>
                  <input value={editingProduct.detailImages || ''} onChange={e => setEditingProduct({...editingProduct, detailImages: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: url1, url2" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">상품 설명</label>
                  <textarea required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand h-24"></textarea>
                </div>
                <div className="flex items-center gap-2 p-1">
                  <input type="checkbox" id="editSoldOut" checked={editingProduct.isSoldOut || false} onChange={e => setEditingProduct({...editingProduct, isSoldOut: e.target.checked})} className="w-4 h-4 rounded text-brand focus:ring-brand border-gray-300" />
                  <label htmlFor="editSoldOut" className="text-sm font-bold text-ink select-none cursor-pointer">이 상품 품절 처리하기</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-extrabold rounded-2xl hover:bg-gray-200 transition-all">취소</button>
                  <button type="submit" className="flex-1 py-4 bg-brand text-black font-extrabold rounded-2xl hover:shadow-lg transition-all">수정 완료</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AdminPage;