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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95 }} animate={{ scale: 1 }}
          className="bg-white w-full max-w-[320px] rounded-[24px] p-6 shadow-2xl relative"
        >
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-ink"><X size={18} /></button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-4 text-brand-dark">
              <Truck size={24} />
            </div>
            <h3 className="text-lg font-black text-ink mb-2">배송비 걱정은 끝!</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-6">
              오늘도 가성비는 전 품목 무료배송입니다.<br/>
              고객님의 일상에 가성비를 더하세요.<br/>
              더 이상 배송비 추가 없이 가볍게 시작하세요!
            </p>
            <button 
              onClick={() => closeBanner(1)}
              className="w-full py-3 bg-ink text-white text-[12px] font-bold rounded-xl hover:bg-brand hover:text-ink transition-all"
            >
              오늘 하루 보지 않기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};