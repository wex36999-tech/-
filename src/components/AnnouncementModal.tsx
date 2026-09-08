import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { optimizeCloudinaryUrl } from '../lib/imageUtils';

export const AnnouncementModal = () => {
  const { config } = useConfig();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!config.announcementActive || !config.announcementImage) {
      setIsOpen(false);
      return;
    }
    // 하루 동안 안 보기 체크 (localStorage 사용)
    const hideUntil = localStorage.getItem('hideAnnouncementUntil');
    if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
      setIsOpen(true);
    }
  }, [config.announcementActive, config.announcementImage]);

  const closeModal = (hideForDay = false) => {
    if (hideForDay) {
      const nextShowTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('hideAnnouncementUntil', nextShowTime.toString());
    }
    setIsOpen(false);
  };

  if (!config.announcementActive || !config.announcementImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => closeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-[24px] overflow-hidden shadow-2xl max-w-sm w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => closeModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md"
            >
              <X size={18} />
            </button>
            <img
              src={optimizeCloudinaryUrl(config.announcementImage, 600)}
              alt="공지"
              className="w-full h-auto block"
            />
            <button
              onClick={() => closeModal(true)}
              className="w-full py-3 text-xs font-bold text-gray-400 border-t border-gray-100 hover:bg-gray-50 transition-all"
            >
              하루 동안 이 창을 열지 않습니다
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};