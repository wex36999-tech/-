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
          className="fixed bottom-6 right-6 z-[100] w-[280px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
        >
          <button 
            onClick={() => closeBanner(1)} 
            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 text-gray-600"
          >
            <X size={14} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand-dark shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-xs font-black text-ink mb-0.5">전 품목 무료배송</h3>
              <p className="text-[10px] text-gray-500 leading-tight">
                배송비 걱정 마세요.<br/>
                오늘도 가성비는 무료입니다!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};