import React from 'react';
import { MessageCircle, Landmark } from 'lucide-react';

export const FloatingMenu = ({ onOpenAccount }: { onOpenAccount: () => void }) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {/* 카카오톡 버튼 */}
      <a 
        href="https://pf.kakao.com/_xxxxxx" // 👈 사장님의 카카오톡 채널 링크로 수정하세요
        target="_blank" 
        rel="noreferrer"
        className="w-12 h-12 bg-[#FEE500] rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        title="카카오톡 문의"
      >
        <MessageCircle size={24} className="text-[#391B1B]" />
      </a>

      {/* 계좌 확인 버튼 */}
      <button 
        onClick={onOpenAccount}
        className="w-12 h-12 bg-ink text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        title="계좌번호 확인"
      >
        <Landmark size={20} />
      </button>
    </div>
  );
};