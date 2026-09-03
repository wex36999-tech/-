import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, X } from 'lucide-react';

export const BannerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 하루 동안 안 보기 체크 (localStorage 사용)
    const hideUntil = localStorage.getItem('hideBannerUntil');
    if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
      setIsOpen(true);
    }
  }, []);

  const closeBanner = (days = 1) => {
    const nextShowTime = new Date().getTime() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem('hideBannerUntil', nextShowTime.toString());
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: 100 }}
          // PC에서는 더 크게(md:w-[360px]), 패딩도 더 여유롭게(md:p-6) 수정했습니다
          className="fixed bottom-6 right-6 z-[100] w-[280px] md:w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6"
        >
          <button 
            onClick={() => closeBanner(1)} 
            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1.5 hover:bg-gray-300 text-gray-600"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* 아이콘 크기도 조금 더 키웠습니다 */}
            <div className="w-12 h-12 md:w-14 md:h-14 bg-brand/10 rounded-full flex items-center justify-center text-brand-dark shrink-0">
              <Truck size={28} />
            </div>
            <div>
              {/* 글씨 크기를 시원하게 키웠습니다 */}
              <h3 className="text-sm md:text-base font-black text-ink mb-1">전 품목 무료배송</h3>
              <p className="text-[11px] md:text-[13px] text-gray-500 leading-relaxed">
                가격은 내리고, 배송비는 지웠습니다.<br/>
                부담은 낮추고 만족은 채우는 알뜰 장보기,<br/>
                지금 바로 시작하세요!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};