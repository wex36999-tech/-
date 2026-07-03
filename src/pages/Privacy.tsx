import React from 'react';

export const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 text-sm text-gray-700 leading-relaxed">
      <h1 className="text-2xl font-bold mb-8 text-ink">개인정보처리방침</h1>
      <pre className="whitespace-pre-wrap font-sans text-xs">
        {`[개인정보처리방침]

오늘도가성비(이하 '사이트')는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 권익을 보호하고 개인정보와 관련한 고충을 원활하게 처리하기 위하여 다음과 같은 개인정보 처리방침을 두고 있습니다.

1. 수집하는 개인정보 항목
- 수집 항목: 성함, 휴대폰번호, 이메일 주소 (문의 접수 및 안내 목적)
- 수집 방법: 고객센터 문의 양식을 통한 직접 입력

2. 개인정보의 보유 및 이용 기간
- 보유 기간: 문의 접수 후 상담 완료 시점까지 (단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관)

3. 이용자의 권리
- 이용자는 언제든지 등록된 자신의 개인정보에 대해 열람 및 수정, 삭제를 요청할 수 있습니다.`}
      </pre>
    </div>
  );
};