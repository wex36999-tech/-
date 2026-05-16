import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Package, Settings, Lock } from 'lucide-react';

const ADMIN_PASSWORD = '동마123'; // 👈 새로운 관리자 비밀번호로 변경 완료!

const AdminPage = () => {
  const { products, updateProducts } = useConfig();
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '농산물'
  });

  // 비밀번호 검사 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 틀렸습니다!');
      setPasswordInput('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    const updatedProducts = [...products, { ...newProduct, id }];
    updateProducts(updatedProducts);
    setNewProduct({ name: '', price: '', description: '', image: '', category: '농산물' });
    alert('상품이 등록되었습니다!');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      updateProducts(updatedProducts);
    }
  };

  // 1. 비밀번호 입력 전 화면
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
            <input 
              type="password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand text-center text-lg tracking-widest" 
              placeholder="••••"
              required 
            />
            <button type="submit" className="w-full py-4 bg-ink text-white font-extrabold rounded-2xl hover:bg-brand hover:text-ink transition-all shadow-md">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. 비밀번호 인증 후 화면
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Settings className="text-brand-dark" />
          <h1 className="text-3xl font-black">오늘도가성비 관리자</h1>
        </div>
        <button onClick={() => setIsAuthorized(false)} className="text-xs font-bold text-gray-400 hover:text-red-500 border border-gray-200 px-4 py-2 rounded-xl bg-white transition-all">
          로그아웃
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 상품 등록 섹션 */}
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={20} /> 새 상품 등록
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">상품명</label>
              <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 꿀사과 5kg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">가격</label>
                <input required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="예: 25,000원" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">카테고리</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand">
                  <option value="농산물">농산물</option>
                  <option value="수산물">수산물</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL (Cloudinary)</label>
              <input required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" placeholder="https://res.cloudinary.com/..." />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">상품 설명</label>
              <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand h-24" placeholder="상품에 대한 짧은 설명을 적어주세요."></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-brand text-black font-extrabold rounded-2xl hover:shadow-lg transition-all">상품 등록하기</button>
          </form>
        </div>

        {/* 등록된 상품 목록 */}
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package size={20} /> 등록된 상품 관리 ({products.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.price}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;