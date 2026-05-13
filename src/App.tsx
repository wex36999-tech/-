// ... (상단 import 생략 - 사용자님 원본과 동일)

// --- HomePage 부분의 배경화면 주소만 수정되었습니다 ---
const HomePage = ({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) => {
  const { config, products } = useConfig();
  // ... (중간 로직 생략 - 사용자님 원본과 동일)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image 수정됨 */}
        <div className="absolute inset-0 z-0">
          <img 
            // 아래 주소가 사용자님의 새로운 Cloudinary 배경 이미지입니다.
            src="https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        </div>
        
        {/* ... (이하 나머지 코드 사용자님 원본과 100% 동일) */}
// ...