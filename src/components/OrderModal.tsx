import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export const OrderModal = ({ 
  selectedProduct, setSelectedProduct, totalPriceString, quantity, 
  setQuantity, selectedOption, setSelectedOption, productOptions, 
  handleOrderSubmit, isSubmitting, isOrderView, setIsOrderView
}: any) => {
  // 🌟 외부 연결 없이 여기서만 상태 관리 (에러 원천 차단)
  const [isDetailView, setIsDetailView] = React.useState(false);

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white max-w-lg w-full h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative" 
          onClick={e => e.stopPropagation()}
        >
          {/* 상세 뷰가 아닐 때만 상단 이미지 표시 */}
          {!isDetailView && (
            <div className="w-full h-56 overflow-hidden relative flex-shrink-0">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md">
                <X size={20} />
              </button>
            </div>
          )}

          <div className="p-6 overflow-y-auto flex-1 relative">
            {isDetailView ? (
              <div className="w-full">
                <button 
                  type="button" 
                  onClick={() => setIsDetailView(false)} 
                  className="sticky top-0 z-20 flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full text-[12px] font-bold shadow-sm mb-4"
                >
                  <ArrowLeft size={14} /> 돌아가기
                </button>
                {selectedProduct.detailImages ? selectedProduct.detailImages.split(',').map((url: string, idx: number) => (
                  <img key={idx} src={url.trim()} alt="상세이미지" className="w-full mb-3 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                )) : <p className="text-center text-gray-400 py-10 text-xs">상세 이미지가 없습니다.</p>}
              </div>
            ) : !isOrderView ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-black text-ink mb-1">{selectedProduct.name}</h2>
                  <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line mb-5">{selectedProduct.description}</p>
                  
                  {productOptions.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-bold text-gray-400 ml-1">구매 옵션 선택</label>
                      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold text-ink">
                        <option value="" disabled>눌러서 상세 옵션을 선택해 주세요</option>
                        {productOptions.map((opt: string, idx: number) => (<option key={idx} value={opt}>{opt}</option>))}
                      </select>
                    </div>
                  )}

                  {/* 🌟 이제 여기서 setIsDetailView를 직접 호출하므로 에러가 날 수 없습니다 */}
                  {selectedProduct.detailImages && (
                    <button type="button" onClick={() => setIsDetailView(true)} className="w-full py-3 mb-6 bg-brand/10 text-brand-dark text-xs font-bold rounded-xl hover:bg-brand/20 transition-all border border-brand/20 flex justify-center items-center gap-2">
                      상품 상세 이미지 더 보기 <ChevronDown size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-lg font-black text-ink">{totalPriceString}</span>
                  <button type="button" onClick={() => { if (productOptions.length > 0 && !selectedOption) { alert("옵션을 선택해 주세요."); return; } setIsOrderView(true); }} className="bg-ink text-white px-6 py-3.5 rounded-xl font-extrabold text-xs">구매하기</button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button type="button" onClick={() => setIsOrderView(false)} className="text-gray-400 text-xs font-bold mb-4">← 돌아가기</button>
                <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                  <input name="성함" required placeholder="성함" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                  <input name="연락처" required placeholder="연락처" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                  <textarea name="주소" required placeholder="배송지" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs h-20"></textarea>
                  <button type="submit" className="w-full py-4 bg-ink text-white font-extrabold rounded-xl">{isSubmitting ? "전송 중..." : "주문하기"}</button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};