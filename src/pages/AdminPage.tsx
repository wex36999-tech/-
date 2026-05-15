import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Package } from 'lucide-react';

const AdminPage = () => {
  const { config, products, updateConfig, updateProducts } = useConfig();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '농산물'
  });

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

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Settings className="text-brand-dark" />
        <h1 className="text-3xl font-black">관리자 모드</h1>
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