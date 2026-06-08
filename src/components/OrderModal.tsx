import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Minus, Plus, ShoppingBag } from 'lucide-react';

export const OrderModal = ({ 
  selectedProduct, setSelectedProduct, totalPriceString, quantity, 
  setQuantity, selectedOption, setSelectedOption, productOptions, 
  handleOrderSubmit, isSubmitting, isOrderView, setIsOrderView,
  isDetailView, setIsDetailView 
}: any) => {
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
          <div className="w-full h-56 overflow-hidden relative flex-shrink-0">
            <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {isDetailView ? (
              <div className="w-full">
                <button type="button" onClick={() => setIsDetailView(false)} className="mb-4 text-xs font-bold text-gray-400 hover:text-ink flex items-center gap-1">← 돌아가기</button>
                {selectedProduct.detailImages ? selectedProduct.detailImages.split(',').map((url: string, idx: number) => (
                  <img key={idx} src={url.trim()} alt="상세이미지" className="w-full mb-3 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                )) : <p className="text-center text-gray-400 py-10 text-xs">상세 이미지가 없습니다.</p>}
              </div>
            ) : !isOrderView ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-black text-ink mb-1">{selectedProduct.name}</h2>
                  {selectedProduct.detailImages && (
                    <button type="button" onClick={() => setIsDetailView(true)} className="w-full py-2.5 mb-4 bg-brand/10 text-brand-dark text-xs font-bold rounded-xl hover:bg-brand/20 transition-all border border-brand/20">상세 상품 이미지 더 보기</button>
                  )}
                  <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line mb-5">{selectedProduct.description}</p>
                  {productOptions.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-bold text-gray-400 ml-1">구매 옵션 선택</label>
                      <div className="relative">
                        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200/70 rounded-xl outline-none focus:ring-2 focus:ring-brand text-xs font-bold appearance-none cursor-pointer pr-10 text-ink">
                          <option value="" disabled>눌러서 상세 옵션을 선택해 주세요</option>
                          {productOptions.map((opt: string, idx: number) => (<option key={idx} value={opt}>{opt}</option>))}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={14} />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5 mb-6">
                    <label className="text-[11px] font-bold text-gray-400 ml-1">주문 수량</label>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xs font-bold text-ink pl-2">{quantity}개</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setQuantity((prev: number) => Math.max(1, prev - 1))} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 hover:bg-gray-100"><Minus size={14} /></button>
                        <button type="button" onClick={() => setQuantity((prev: number) => prev + 1)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 hover:bg-gray-100"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400">총 상품 금액</span><span className="text-lg font-black text-ink">{totalPriceString}</span></div>
                  <button type="button" onClick={() => { if (productOptions.length > 0 && !selectedOption) { alert("옵션을 선택해 주세요."); return; } setIsOrderView(true); }} className="bg-ink text-white text-xs font-extrabold px-6 py-3.5 rounded-xl hover:bg-brand hover:text-black shadow-md flex items-center gap-1.5 transition-all"><ShoppingBag size={14} />구매하기</button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button type="button" onClick={() => setIsOrderView(false)} className="text-gray-400 text-xs font-bold mb-4 hover:text-ink flex items-center gap-1">← 돌아가기</button>
                <h2 className="text-lg font-black mb-4">배송지 주문서 작성</h2>
                <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                  <input type="hidden" name="상품명" value={selectedProduct.name} />
                  <input type="hidden" name="구매수량" value={`${quantity}개`} />
                  <input type="hidden" name="선택옵션" value={selectedOption || "옵션 없음"} />
                  <input type="hidden" name="결제금액" value={totalPriceString} />
                  <div className="space-y-1"><label className="text-[11px] font-bold text-gray-400 ml-1">주문자 성함</label><input name="성함" required placeholder="받으시는 분 성함" className="w-full p-3.5 bg-gray-50 border border-transparent focus:border-brand rounded-xl outline-none text-xs font-medium" /></div>
                  <div className="space-y-1"><label className="text-[11px] font-bold text-gray-400 ml-1">연락처</label><input name="연락처" required placeholder="예: 010-1234-5678" className="w-full p-3.5 bg-gray-50 border border-transparent focus:border-brand rounded-xl outline-none text-xs font-medium" /></div>
                  <div className="space-y-1"><label className="text-[11px] font-bold text-gray-400 ml-1">배송 주소지</label><textarea name="주소" required placeholder="상세 주소까지 정확하게 입력해 주세요." className="w-full p-3.5 bg-gray-50 border border-transparent focus:border-brand rounded-xl outline-none text-xs font-medium h-20 resize-none"></textarea></div>
                  <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-xs font-extrabold rounded-xl transition-all mt-2 shadow-sm ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-ink text-white hover:bg-brand hover:text-ink'}`}>{isSubmitting ? "주문 데이터 전송 중..." : "주문하기"}</button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};