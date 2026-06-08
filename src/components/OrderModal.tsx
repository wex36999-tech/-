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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
        <motion.div 
          initial={{ scale: 0.95, y: 50 }} 
          animate={{ scale: 1, y: 0 }} 
          exit={{ scale: 0.95, y: 50 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          // 여기서 max-w-md -> max-w-lg, max-h-[85vh] -> max-h-[95vh]로 키웠습니다!
          className="bg-white max-w-lg w-full rounded-t-[32px] sm:rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative max-h-[95vh]" 
          onClick={e => e.stopPropagation()}
        >
          {/* 이미지 영역도 약간 더 시원하게 */}
          <div className="w-full h-56 sm:h-64 overflow-hidden relative flex-shrink-0">
            <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/40 text-white hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"><X size={18} /></button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {/* 기존 로직 유지 (이 부분은 가져오신 코드 그대로 쓰시면 됩니다) */}
            {/* 상세 설명, 옵션 선택 등 사장님이 주신 3단 분기 로직을 여기에 넣으세요 */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};