import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useConfig } from '../context/ConfigContext';
import { optimizeCloudinaryUrl } from '../lib/imageUtils';

export const CartModal = ({ onClose, onOrderComplete }: { onClose: () => void; onOrderComplete: () => void }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { addOrder } = useConfig();

  const [isCheckoutView, setIsCheckoutView] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 모달 열려있는 동안 배경 스크롤 차단
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const orderNameSummary = React.useMemo(() => {
    if (cartItems.length === 0) return '';
    if (cartItems.length === 1) return cartItems[0].name;
    return `${cartItems[0].name} 외 ${cartItems.length - 1}건`;
  }, [cartItems]);

  const handlePortOnePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const PortOne = (window as any).PortOne;
    if (!PortOne) {
      alert("결제 모듈이 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentId = `ord_${new Date().getTime()}`;

      const response = await PortOne.requestPayment({
        storeId: "store-bbb8e621-99c0-4a9f-b62c-8e7670dcb6a6",
        channelKey: "channel-key-786f2a24-0f8d-4f16-9ac4-58ba24b7a598",
        paymentId,
        orderName: orderNameSummary,
        totalAmount: totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
        easyPay: {
          easyPayProvider: "EASY_PAY_PROVIDER_KAKAOPAY",
        },
      });

      if (response.code !== undefined) {
        console.error("포트원 결제 상세 에러:", response);
        alert(`결제 실패: ${response.message || "알 수 없는 오류가 발생했습니다."}`);
        setIsSubmitting(false);
        return;
      }

      // 결제 성공 -> 주문 저장 + Formspree 전송
      const items = cartItems.map(item => ({
        productName: item.name,
        option: item.option,
        quantity: item.quantity,
        itemPrice: `${(item.unitPrice * item.quantity).toLocaleString()}원`,
      }));
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      try {
        await addOrder({
          id: paymentId,
          customerName: formData.get('성함')?.toString() || '',
          phone: formData.get('연락처')?.toString() || '',
          address: formData.get('주소')?.toString() || '',
          productName: orderNameSummary,
          option: '',
          quantity: totalQuantity,
          totalPrice: `${totalAmount.toLocaleString()}원`,
          paymentId,
          createdAt: new Date().toISOString(),
          items,
        });
      } catch (orderError) {
        console.error('주문 저장 실패:', orderError);
      }

      // Formspree로도 전송 (상품 목록을 텍스트로 정리해서 전달)
      try {
        const itemsText = items.map(i => `- ${i.productName} (${i.option || '기본'}) x${i.quantity} = ${i.itemPrice}`).join('\n');
        const fd = new FormData();
        fd.append('성함', formData.get('성함')?.toString() || '');
        fd.append('연락처', formData.get('연락처')?.toString() || '');
        fd.append('주소', formData.get('주소')?.toString() || '');
        fd.append('주문상품', itemsText);
        fd.append('총결제금액', `${totalAmount.toLocaleString()}원`);
        await fetch("https://formspree.io/f/xaqaervl", {
          method: "POST",
          body: fd,
          headers: { 'Accept': 'application/json' }
        });
      } catch (formError) {
        console.error('Formspree 전송 실패:', formError);
      }

      clearCart();
      onOrderComplete();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white max-w-lg w-full max-h-[90vh] rounded-[24px] shadow-2xl relative overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-black flex items-center gap-2">
              <ShoppingCart size={20} /> {isCheckoutView ? '주문/배송 정보' : '장바구니'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-ink"><X size={20} /></button>
          </div>

          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400">
                장바구니가 비어 있습니다.
              </div>
            ) : !isCheckoutView ? (
              <>
                <div className="space-y-3 mb-6">
                  {cartItems.map(item => (
                    <div key={item.cartItemId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <img src={optimizeCloudinaryUrl(item.image, 200)} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={item.name} referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                        {item.option && <p className="text-[11px] text-gray-400 mt-0.5">옵션: {item.option}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-500"><Minus size={12} /></button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-500"><Plus size={12} /></button>
                          </div>
                          <span className="text-sm font-black text-brand-dark">{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-300 hover:text-red-400 flex-shrink-0"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  <span className="text-sm font-bold text-gray-500">총 결제금액</span>
                  <span className="text-xl font-black text-ink">{totalAmount.toLocaleString()}원</span>
                </div>

                <button onClick={() => setIsCheckoutView(true)} className="w-full py-4 bg-ink text-white font-extrabold rounded-2xl">
                  전체 결제하기
                </button>
              </>
            ) : (
              <form onSubmit={handlePortOnePay} className="space-y-3.5">
                <button type="button" onClick={() => setIsCheckoutView(false)} className="text-gray-400 text-xs font-bold mb-2">← 돌아가기</button>
                
                <div className="p-4 bg-gray-50 rounded-xl mb-2">
                  <p className="text-xs font-bold text-gray-500 mb-1">{orderNameSummary}</p>
                  <p className="text-lg font-black text-ink">{totalAmount.toLocaleString()}원</p>
                </div>

                <input name="성함" required placeholder="성함" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                <input name="연락처" required placeholder="연락처" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs" />
                <textarea name="주소" required placeholder="배송지" className="w-full p-3.5 bg-gray-50 rounded-xl text-xs h-20"></textarea>

                <button type="submit" className="w-full py-4 font-extrabold rounded-xl transition-all bg-ink text-white" disabled={isSubmitting}>
                  {isSubmitting ? '결제 및 주문 전송 중...' : '결제하기'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};