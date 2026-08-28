import React from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { X, Search, MessageCircle } from 'lucide-react';

interface OrderItem {
  productName: string;
  option: string;
  quantity: number;
  itemPrice: string;
}

interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  option: string;
  quantity: number;
  totalPrice: string;
  createdAt: string;
  items?: OrderItem[];
}

// 🌟 카카오 오픈채팅 링크 (Footer에서 쓰는 것과 동일)
const KAKAO_OPEN_CHAT_URL = 'https://open.kakao.com/o/s8rZCYzi';

export const OrderLookupModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [results, setResults] = React.useState<OrderRecord[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('성함과 연락처를 모두 입력해 주세요.');
      return;
    }

    setIsSearching(true);
    setSearched(false);

    try {
      const q = query(
        collection(db, 'orders'),
        where('customerName', '==', name.trim()),
        where('phone', '==', phone.trim())
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderRecord));
      // 최신 주문이 위로 오도록 정렬
      orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setResults(orders);
    } catch (error) {
      console.error('주문 조회 실패:', error);
      alert('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSearching(false);
      setSearched(true);
    }
  };

  // 🌟 문의하기: 주문 정보를 클립보드에 복사 + 카톡 오픈채팅 새 탭으로 열기
  const handleInquiry = async (order: OrderRecord) => {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('ko-KR');
    const productLines = order.items && order.items.length > 0
      ? order.items.map(i => `- ${i.productName}${i.option ? ` (${i.option})` : ''} x${i.quantity}`).join('\n')
      : `${order.productName}${order.option ? `\n옵션: ${order.option}` : ''}`;
    const inquiryText = `[주문문의]\n${order.items ? '주문상품:\n' + productLines : '상품명: ' + productLines}\n주문일: ${formattedDate}\n성함: ${order.customerName}\n\n문의내용: `;

    try {
      await navigator.clipboard.writeText(inquiryText);
      alert('문의 내용이 복사되었습니다. 카카오톡 채팅창에 붙여넣어 주세요!');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
    }

    window.open(KAKAO_OPEN_CHAT_URL, '_blank', 'noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-8 rounded-[24px] w-full max-w-md border border-border shadow-2xl relative max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-ink">
          <X size={20} />
        </button>
        <h3 className="text-2xl font-black mb-2 tracking-tight text-center">주문조회</h3>
        <p className="text-xs text-ink-muted text-center mb-6">주문 시 입력하신 성함과 연락처로 조회하실 수 있습니다.</p>

        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand text-sm"
            placeholder="성함"
          />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-border outline-none focus:border-brand text-sm"
            placeholder="연락처 (주문 시 입력한 형식 그대로)"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-4 bg-ink text-white font-bold rounded-xl hover:bg-brand hover:text-ink transition-all flex items-center justify-center gap-2"
          >
            <Search size={16} />
            {isSearching ? '조회 중...' : '주문 조회하기'}
          </button>
        </form>

        {/* 조회 결과 */}
        {searched && results && results.length === 0 && (
          <div className="text-center py-10 text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            일치하는 주문 내역이 없습니다.<br />입력하신 정보를 다시 확인해 주세요.
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3">
            {results.map(order => (
              <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-ink">{order.productName}</span>
                  <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>

                {order.items && order.items.length > 0 ? (
                  <div className="space-y-1.5 my-2 pl-1 border-l-2 border-gray-200">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pl-2 text-[11px] text-ink-muted">
                        <span className="font-bold text-ink">{item.productName}</span>
                        {item.option && <span> ({item.option})</span>}
                        <span> x{item.quantity} — {item.itemPrice}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {order.option && <p className="text-[11px] text-ink-muted mb-1">옵션: {order.option}</p>}
                    <p className="text-[11px] text-ink-muted mb-1">수량: {order.quantity}개</p>
                  </>
                )}

                <p className="text-sm font-black text-brand-dark mb-3 mt-1">{order.totalPrice}</p>

                {/* 🌟 상품문의 버튼 */}
                <button
                  onClick={() => handleInquiry(order)}
                  className="w-full py-2.5 bg-white border border-gray-200 text-ink-muted text-xs font-bold rounded-lg hover:border-ink hover:text-ink transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  이 주문 문의하기 (카카오톡)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};