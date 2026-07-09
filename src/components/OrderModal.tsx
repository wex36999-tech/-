import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Minus, Plus, ArrowLeft } from 'lucide-react';

export const OrderModal = ({ 
  selectedProduct, setSelectedProduct, totalPriceString, quantity, 
  setQuantity, selectedOption, setSelectedOption, productOptions, 
  handleOrderSubmit, isSubmitting, isOrderView, setIsOrderView
}: any) => {
  const [isDetailView, setIsDetailView] = React.useState(false);

  // 모달창이 열려있는 동안 뒷배경(body)의 스크롤을 완전히 강제 차단합니다
  React.useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'; 
      document.body.style.touchAction = 'none'; // 모바일 터치 스크롤 방지
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
      setIsDetailView(false); // 🌟 [핵심 보완] 상품이 바뀌거나 모달이 닫힐 때 상세 보기 모드를 무조건 해제합니다.
    };
  }, [selectedProduct]);

  const handlePortOnePay = async (e: React.FormEvent) => {
    e.preventDefault();

    const PortOne = (window as any).PortOne;

    if (!PortOne) {
      alert("결제 모듈이 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    const calculatedAmount = parseInt(totalPriceString?.replace(/[^0-9]/g, ''), 10) || 10000;

    const response = await PortOne.requestPayment({
      storeId: "store-bbb8e621-99c0-4a9f-b62c-8e7670dcb6a6",
      channelKey: "channel-key-96a2003d-b553-4afd-924c-f3d3cef99bf6",
      paymentId: `ord_${new Date().getTime()}`,
      orderName: selectedProduct?.name || "상품 결제",
      totalAmount: calculatedAmount,
      currency: "CURRENCY_KRW",
      payMethod: "EASY_PAY",
      easyPay: {
        easyPayProvider: "EASY_PAY_PROVIDER_KAKAOPAY", // 🌟 카카오페이 지정
      },
    });

    if (response.code !== undefined) {
      // 결제 실패 (또는 사용자 취소)
      console.error("포트원 결제 상세 에러:", response);
      alert(`결제 실패: ${response.message || "알 수 없는 오류가 발생했습니다."}`);
      return;
    }

    // 결제 성공 -> 기존 주문 전송 로직 실행
    handleOrderSubmit(e);
  };

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto" 
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white max-w-lg w-full h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative pointer-events-auto overscroll-contain" 
          onClick={e => e.stopPropagation()}
        >
          {!isDetailView && (
            <div className="w-full h-56 overflow-hidden relative flex-shrink-0">
              <img src={selectedProduct?.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md">
                <X size={20} />
              </button>
            </div>
          )}

          <div className="p-6 overflow-y-auto flex-1 relative overscroll-contain touch-pan-y">
            {isDetailView ? (
              <div className="w-full">
                <button type="button" onClick={() => setIsDetailView(false)} className="sticky top-0 z-20 flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full text-[12px] font-bold shadow-sm mb-4">
                  <ArrowLeft size={14} /> 돌아가기
                </button>
                {selectedProduct?.detailImages ? selectedProduct.detailImages.split(',').map((url: string, idx: number) => (
                  <img key={idx} src={url.trim()} alt="상세이미지" className="w-full mb-3 rounded-xl shadow-sm image-rendering-crisp-edges" referrerPolicy="no-referrer" />
                )) : <p className="text-center text-gray-400 py-10 text-xs">상세 이미지가 없습니다.</p>}
              </div>
            ) : !isOrderView ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-black text-ink mb-1">{selectedProduct.name}</h2>
                  <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line mb-5">{selectedProduct?.description}</p>
                  
                  {/* 🌟 카카오페이 심사 필수: 배송 기간 안내 텍스트 추가 */} 
                  <p className="text-[11px] font-bold text-brand-dark bg-brand/10 p-3 rounded-xl border border-brand/20 mb-5 leading-relaxed break-keep">
                    🚚 배송 안내: 결제 완료 후 배송 완료까지 영업일 기준 2~5일 소요됩니다. (주말/공휴일 제외)
                  </p> 
                  {/* 옵션 선택 */}
                  {productOptions.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-bold text-gray-400 ml-1">구매 옵션 선택</label>
                      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold text-ink">
                        <option value="" disabled>눌러서 상세 옵션을 선택해 주세요</option>
                        {productOptions.map((opt: string, idx: number) => (<option key={idx} value={opt}>{opt}</option>))}
                      </select>
                    </div>
                  )}

                  {/* 수량 선택 영역 */}
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

                  {/* 상세 보기 버튼 */}
                  {selectedProduct?.detailImages && (
                    <button type="button" onClick={() => setIsDetailView(true)} className="w-full py-3 mb-6 bg-brand/10 text-brand-dark text-xs font-bold rounded-xl hover:bg-brand/20 transition-all border border-brand/20 flex justify-center items-center gap-2">
                      상품 상세 이미지 더 보기 <ChevronDown size={14} />
                    </button>
                  )}
                </div>

                {/* 가격 및 구매/네이버페이 결제 버튼 영역 */}
                <div className="space-y-3 pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-ink">{totalPriceString}</span>
                    <button type="button" onClick={() => { if (productOptions.length > 0 && !selectedOption) { alert("옵션을 선택해 주세요."); return; } setIsOrderView(true); }} className="bg-ink text-white px-6 py-3.5 rounded-xl font-extrabold text-xs">구매하기</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button type="button" onClick={() => setIsOrderView(false)} className="text-gray-400 text-xs font-bold mb-4">← 돌아가기</button>
                {/* form 제출을 포트원 결제창 호출 함수로 연결 */}
                <form onSubmit={handlePortOnePay} className="space-y-3.5">
                  <input name="성함" required placeholder="성함" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                  <input name="연락처" required placeholder="연락처" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                  <textarea name="주소" required placeholder="배송지" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs h-20"></textarea>
                  
                  {/* 버튼 텍스트를 '결제하기'로 변경 및 모듈 로딩 상태 연동 */}
                  <button 
                    type="submit" 
                    className="w-full py-4 font-extrabold rounded-xl transition-all bg-ink text-white" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '결제 및 주문 전송 중...' : '결제하기'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ); 
};