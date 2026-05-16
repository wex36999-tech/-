import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Package, Settings, Lock, Edit3, Eye, EyeOff, FolderPlus, X } from 'lucide-react';

const ADMIN_PASSWORD = '동마123';

const AdminPage = () => {
  // 👈 파이어베이스 실시간 구글 서버 기능들을 안전하게 연동해 줍니다!
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
  
  // 💡 [해결] 로컬 고정값이 아니라 ConfigContext(구글 서버)에서 보관하는 카테고리 데이터를 가져옵니다.
  const categories = config.categories || ['농산물', '수산물'];
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 상품 목록 필터링용 상태
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');

  // 상품 등록 폼 상태
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: categories[0] || '농산물',
    isSoldOut: false
  });

  // 상품 수정 모달 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  // 1. 카테고리 추가 함수 (구글 서버 실시간 저장 연동)
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

  // 2. 카테고리 삭제 함수 (구글 서버 실시간 저장 연동)
  const handleDropCategory = async (catName: string) => {
    if (window.confirm(`'${catName}' 카테고리를 삭제하시겠습니까?`)) {
      const updatedCategories = categories.filter(c => c !== catName);
      await updateConfig({ categories: updatedCategories });
      if (newProduct.category === catName) {
        setNewProduct({ ...newProduct, category: updatedCategories[0] || '' });
      }
    }
  };

  // 3. 새 상품 등록 함수 (구글 파이어베이스 DB로 직통 슛!)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    
    // ConfigContext에 설계된 구글 전송 양식에 맞춰 id를 포함하여 보냅니다.
    await addProduct({ ...newProduct, id, options: '기본선택' });
    
    setNewProduct({ 
      name: '', 
      price: '', 
      description: '', 
      image: '', 
      category: categories[0] || '농산물', 
      isSoldOut: false 
    });
    alert('상품이 구글 데이터베이스에 안전하게 등록되었습니다!');
  };

  // 4. 상품 수정 저장 함수 (구글 파이어베이스 DB 실시간 업데이트)
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProduct(editingProduct.id, { ...editingProduct, options: editingProduct.options || '기본선택' });
    setShowEditModal(false);
    alert('상품 정보가 실시간으로 수정되었습니다!');
  };

  // 5. 품절 토글 함수 (터미널 명령어 없이 1초 만에 즉시 실시간 반영!)
  const toggleSoldOut = async (product: any) => {
    const updatedProduct = { ...product, isSoldOut: !product.isSoldOut };
    await updateProduct(product.id, updatedProduct);
  };

  // 6. 상품 삭제 함수 (구글 파이어베이스 DB 영구 삭제)
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteProduct(id);
      alert('상품이 삭제되었습니다.');
    }
  };

  // 필터링된 상품 목록 계산
  const filteredProducts = selectedFilter === '전체' 
    ? products 
    : products.filter((p: any) => p.category === selectedFilter);

  // 🔒 로그인 전 화면
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
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Settings className="text-brand-dark" />
          <h1 className="text-3xl font-black">오늘도가성비 관리자</h1>
        </div>
        <button onClick={() => setIsAuthorized(false)} className="text-xs font-bold text-gray-400 hover:text-red-500 border border-gray-200 px-4 py-2 rounded-xl bg-white transition-all">로그아웃</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* [왼쪽 블록] 상품 등록 섹션 */}
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus size={20} /> 새 상품 등록
              </h2>
              <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-brand hover:text-ink px-3 py-2 rounded-xl transition-all">
                <FolderPlus size={14} /> 카테고리 편집
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">商品名</label>
                <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 꿀사과 5kg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">가격</label>
                  <input required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 25,000원" />
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
                <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL (Cloudinary)</label>
                <input required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="https://res.cloudinary.com/..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">상품 설명</label>
                <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand h-24" placeholder="상품 설명을 적어주세요."></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-brand text-black font-extrabold rounded-2xl hover:shadow-lg transition-all">상품 등록하기</button>
            </form>
          </div>
        </div>

        {/* [오른쪽 블록] 등록된 상품 관리 섹션 */}
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package size={20} /> 등록된 상품 관리 ({filteredProducts.length})
            </h2>
            
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl overflow-x-auto">
              <button onClick={() => setSelectedFilter('전체')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${selectedFilter === '전체' ? 'bg-white shadow-sm text-ink' : 'text-gray-400 hover:text-gray-600'}`}>전체</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedFilter(cat)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${selectedFilter === cat ? 'bg-white shadow-sm text-ink' : 'text-gray-400 hover:text-gray-600'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all border ${product.isSoldOut ? 'border-dashed border-gray-300 opacity-70' : 'border-transparent'}`}>
                <div onClick={() => { setEditingProduct(product); setShowEditModal(true); }} className="flex items-center gap-4 cursor-pointer flex-1">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                    {product.isSoldOut && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[10px] text-white font-black tracking-tighter">품절</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-ink">{product.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-500 font-bold rounded-md">{product.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{product.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 품절 토글 버튼 연동 */}
                  <button onClick={() => toggleSoldOut(product)} className={`p-2 rounded-xl transition-all ${product.isSoldOut ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-400 hover:text-ink shadow-sm'}`} title={product.isSoldOut ? "판매중으로 변경" : "품절처리"}>
                    {product.isSoldOut ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => { setEditingProduct(product); setShowEditModal(true); }} className="p-2 bg-white text-gray-400 hover:text-ink rounded-xl shadow-sm transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-center py-10 text-sm text-gray-400 font-medium">등록된 상품이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* 팝업 1: 카테고리 편집 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-border shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg">카테고리 편집</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand text-sm" placeholder="예: 축산물, 과일류" />
              <button type="submit" className="px-4 bg-brand text-black font-bold text-sm rounded-xl transition-all">추가</button>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-sm font-bold">
                  <span>{cat}</span>
                  <button onClick={() => handleDropCategory(cat)} className="text-red-400 hover:text-red-600 text-xs px-2 py-1">삭제</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 팝업 2: 상품 상세 수정 모달 */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-border shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl">상품 정보 수정</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-ink"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">상품명</label>
                <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">가격</label>
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
                <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL (Cloudinary)</label>
                <input required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" />
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