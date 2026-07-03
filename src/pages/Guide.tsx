import React from 'react';

export const Guide = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 text-sm text-gray-700 leading-relaxed">
      <h1 className="text-2xl font-bold mb-8 text-ink">이용안내</h1>
      <pre className="whitespace-pre-wrap font-sans text-xs">
        {`[배송 및 교환/환불 안내]

1. 배송 안내
- 배송 방법: 택배
- 배송 지역: 전국 (도서산간 지역은 추가 비용이 발생할 수 있습니다.)
- 배송 기간: 결제,입금 확인일로부터 2~5일(영업일 기준) 소요됩니다.

2. 교환 및 환불 안내
- 상품에 하자가 있거나 오배송된 경우, 수령일로부터 7일 이내에 고객센터로 문의해 주시면 교환 및 환불이 가능합니다.
- 단순 변심에 의한 교환/환불은 왕복 택배비가 발생할 수 있습니다.
- 상품 사용 흔적, 라벨 제거, 훼손된 경우에는 교환/환불이 불가합니다.`}
      </pre>
    </div>
  );
};