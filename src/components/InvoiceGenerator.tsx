import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Plus, Trash2, FileText, Download } from 'lucide-react';

interface InvoiceItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

export const InvoiceGenerator = () => {
  const [serial, setSerial] = useState(`${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ id: 1, name: '', qty: 1, price: 0 }]);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), name: '', qty: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(prev => (prev.length > 1 ? prev.filter(i => i.id !== id) : prev));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string) => {
    setItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        if (field === 'name') return { ...i, name: value };
        const num = Number(value.replace(/[^0-9]/g, '')) || 0;
        return { ...i, [field]: num };
      })
    );
  };

  const totalQty = items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  const totalSupply = items.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);

  const [year, month, day] = date.split('-');

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
    pdf.save(`거래명세표_${serial}.pdf`);
  };

  // 🌟 세로쓰기 CSS(writing-mode) 대신 글자를 한 줄씩 쌓아서, PDF 캡처 시에도 안 깨지게 처리
  const VerticalLabel = ({ text }: { text: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 'bold', lineHeight: 1.6, padding: '6px 0' }}>
      {text.split('').map((ch, i) => <span key={i}>{ch}</span>)}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={24} className="text-gray-700" />
          <h2 className="text-2xl font-black text-ink">거래명세표 발급</h2>
        </div>
        <button onClick={handleDownloadPdf} className="flex items-center gap-1.5 bg-ink text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-brand hover:text-ink transition-all">
          <Download size={16} /> PDF 저장
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">일련번호</label>
          <input value={serial} onChange={e => setSerial(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">거래일자</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">고객 상호명 (개인이면 비워두기)</label>
          <input value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">고객 성함</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 ml-1">고객 주소</label>
          <input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold text-gray-400 ml-1">품목 (여러 개 추가 가능)</label>
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <input value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="품목명" className="flex-1 p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
            <input value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', e.target.value)} placeholder="수량" className="w-20 p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
            <input value={item.price ? item.price.toLocaleString() : ''} onChange={e => updateItem(item.id, 'price', e.target.value)} placeholder="단가" className="w-28 p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand" />
            <button onClick={() => removeItem(item.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-brand/10 hover:bg-brand/20 px-4 py-2.5 rounded-xl transition-all">
          <Plus size={14} /> 품목 추가
        </button>
      </div>

      {/* 🖨️ 실제로 PDF로 캡처되는 문서 영역 */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div ref={invoiceRef} style={{ fontFamily: "'Malgun Gothic', sans-serif", color: '#000', fontSize: '9.5pt', width: 820 }}>
          <div style={{ width: 820, border: '2.5px solid #0000ff', padding: 10, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 5 }}>
              <tbody>
                <tr>
                  <td style={{ width: '25%', border: 'none' }}></td>
                  <td style={{ width: '50%', border: 'none' }}>
                    <div style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#0000ff', letterSpacing: 8 }}>거래명세표</div>
                    <div style={{ fontSize: 9, textAlign: 'center' }}>(공급받는자 보관용)</div>
                  </td>
                  <td style={{ width: '25%', border: 'none', textAlign: 'right', verticalAlign: 'bottom', fontSize: 9, paddingBottom: 5 }}>
                    일련번호: {serial}
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0000ff', marginBottom: 5, tableLayout: 'fixed' }}>
              <tbody>
                <tr>
                  <td rowSpan={4} style={{ border: '1px solid #0000ff', background: '#f0f4ff', color: '#000', textAlign: 'center', width: 26, padding: 0 }}><VerticalLabel text="공급자" /></td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>등록번호</th>
                  <td colSpan={3} style={{ border: '1px solid #0000ff', fontWeight: 'bold', textAlign: 'center', padding: 4 }}>236-11-02791</td>
                  <td rowSpan={4} style={{ border: '1px solid #0000ff', background: '#f0f4ff', color: '#000', textAlign: 'center', width: 26, padding: 0 }}><VerticalLabel text="공급받는자" /></td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>등록번호</th>
                  <td colSpan={3} style={{ border: '1px solid #0000ff', padding: 4 }}></td>
                </tr>
                <tr>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>상호(법인명)</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>오늘도가성비</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>성명</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>이성현 (인)</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>상호(법인명)</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'left', paddingLeft: 8 }}>{customerCompany}</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>성명</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>{customerName ? `${customerName} (인)` : ''}</td>
                </tr>
                <tr>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>사업장 주소</th>
                  <td colSpan={3} style={{ border: '1px solid #0000ff', textAlign: 'left', paddingLeft: 8 }}>서울특별시 중랑구 중랑천로 200</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>사업장 주소</th>
                  <td colSpan={3} style={{ border: '1px solid #0000ff', textAlign: 'left', paddingLeft: 8 }}>{customerAddress}</td>
                </tr>
                <tr>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>업태</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>도소매</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>종목</th>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>전자상거래업</td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>업태</th>
                  <td style={{ border: '1px solid #0000ff', padding: 4 }}></td>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4 }}>종목</th>
                  <td style={{ border: '1px solid #0000ff', padding: 4 }}></td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0000ff', marginBottom: 5 }}>
              <tbody>
                <tr>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '50%' }}>일 자</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '50%' }}>합 계 금 액</th>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #0000ff', fontSize: 11, fontWeight: 'bold', padding: 6, textAlign: 'center' }}>{year}년 {month}월 {day}일</td>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'right', fontSize: 13, fontWeight: 'bold', color: '#d32f2f', padding: 6, paddingRight: 8 }}>
                    ₩ {totalSupply.toLocaleString()} 원
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0000ff', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '5%' }}>월</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '5%' }}>일</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '38%' }}>품 목</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '7%' }}>수량</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '13%' }}>단가</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '13%' }}>공급가액</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '5%' }}>세액</th>
                  <th style={{ border: '1px solid #0000ff', background: '#f0f4ff', fontWeight: 'normal', fontSize: 8.5, padding: 4, width: '14%' }}>합계</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>{month}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>{day}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'left', paddingLeft: 8 }}>{item.name}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>{item.qty || 0}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'right', paddingRight: 8 }}>{item.price.toLocaleString()}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'right', paddingRight: 8 }}>{(item.qty * item.price).toLocaleString()}</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>0</td>
                    <td style={{ border: '1px solid #0000ff', textAlign: 'right', paddingRight: 8 }}>{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f9fbff', fontWeight: 'bold' }}>
                  <td colSpan={3} style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>합 계</td>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>{totalQty}</td>
                  <td colSpan={2} style={{ border: '1px solid #0000ff', textAlign: 'right', paddingRight: 8 }}>{totalSupply.toLocaleString()}</td>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'center', padding: 4 }}>0</td>
                  <td style={{ border: '1px solid #0000ff', textAlign: 'right', paddingRight: 8 }}>{totalSupply.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};