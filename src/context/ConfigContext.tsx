import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  collection, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collectionGroup,
  query,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  options: string;
  isSoldOut?: boolean;
isSpecialOffer?: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface OrderItem {
  productName: string;
  option: string;
  quantity: number;
  itemPrice: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  option: string;
  quantity: number;
  totalPrice: string;
  paymentId: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  heroImage: string;
  contactEmail: string;
  phone: string;
  address: string;
  businessNumber: string;
  representative: string;
  categories: string[];
  sns: {
    instagram: string;
    kakao: string;
  };
}

interface ConfigContextType {
  config: SiteConfig;
  products: Product[];
  posts: Post[];
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Post) => void;
  deletePost: (id: string) => void;
  addOrder: (order: Order) => Promise<void>;
}

const defaultConfig: SiteConfig = {
  name: '오늘도가성비',
  slogan: '프리미엄 가성비의 새로운 기준',
  description: '우리는 일상의 가치를 높이는 최고의 상품을 합리적인 가격에 제공합니다.',
  heroImage: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
  contactEmail: 'wex369@naver.com',
  phone: '02-1234-5678',
  address: '서울특별시 중랑구 중랑천로 200.',
  businessNumber: '123-45-67890',
  representative: '홍길동',
  categories: ['주방용품', '생활가전', '농산물', '수산물', '명절선물', '기타'],
  sns: {
    instagram: 'https://instagram.com',
    kakao: 'https://pf.kakao.com',
  },
};

const defaultProducts: Product[] = [
  {
    id: '1',
    name: '프리미엄 스테인리스 주방 세트',
    price: '45,000원',
    description: '내구성이 뛰어난 고품질 스테인리스 소재.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '주방용품',
    options: 'S, M, L / 실버, 블랙',
  },
  {
    id: '2',
    name: '유기농 햇사과 (5kg)',
    price: '24,900원',
    description: '산지 직송, 당도 높은 아삭한 사과.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '농산물',
    options: '일반팩, 선물용 세트',
  },
  {
    id: '3',
    name: '산지직송 완도 전복 (1kg)',
    price: '38,000원',
    description: '완도에서 잡아 올린 싱싱한 전복.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '수산물',
    options: '소(10~12미), 중(8~9미)',
  },
  {
    id: '4',
    name: '미니멀 데스크 램프',
    price: '29,900원',
    description: '눈이 편안한 LED 조명.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '생활가전',
    options: '화이트, 블랙, 실버',
  },
  {
    id: '5',
    name: '친환경 대나무 타월',
    price: '18,500원',
    description: '흡수력이 뛰어난 대나무 섬유.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '욕실용품',
    options: '그레이, 베이지, 블루',
  },
  {
    id: '6',
    name: '화이트 세라믹 머그',
    price: '12,000원',
    description: '심플한 디자인의 세라믹 머그컵.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '주방용품',
    options: '350ml, 500ml',
  },
  {
    id: '7',
    name: '내추럴 우드 도마',
    price: '32,000원',
    description: '천연 원목으로 제작된 견고한 도마.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '주방용품',
    options: '사각, 라운드',
  },
  {
    id: '8',
    name: '에센셜 아로마 디퓨저',
    price: '27,500원',
    description: '공간의 분위기를 바꾸는 아로마 향기.',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
    category: '생활가전',
    options: '라벤더, 유칼립투스, 로즈',
  },
];

const defaultPosts: Post[] = [
  {
    id: '1',
    title: '2024년 봄 신상품 라인업 공개',
    excerpt: '이번 시즌 새롭게 선보이는 가성비 끝판왕 상품들을 만나보세요.',
    date: '2024.04.15',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
  },
  {
    id: '2',
    title: '유통 구조의 혁신, 어떻게 가격을 낮췄나',
    excerpt: '오늘도가성비가 추구하는 유통 혁신과 소비자 가치에 대한 이야기.',
    date: '2024.04.10',
    image: 'https://res.cloudinary.com/dzehtppiz/image/upload/v1777891454/%EB%86%8D%EC%82%B0%EB%AC%BC%EC%82%AC%EC%A7%841_ki6ftr.jpg',
  },
];

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Test connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'config', 'site'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  // Sync Site Config
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'site'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // 데이터가 객체 배열 형태여도 항상 문자열 배열로 변환
        const formattedCategories = Array.isArray(data.categories) 
          ? data.categories.map((c: any) => (typeof c === 'string' ? c : c.name || ''))
          : defaultConfig.categories;

        setConfig(prev => ({ 
          ...prev, 
          ...data, 
          categories: formattedCategories 
        } as SiteConfig));
      } else {
        // Migration or Initialize
        const saved = localStorage.getItem('siteConfig');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setDoc(doc(db, 'config', 'site'), { ...defaultConfig, ...parsed });
          } catch(e) {
            setDoc(doc(db, 'config', 'site'), defaultConfig);
          }
        } else {
          setDoc(doc(db, 'config', 'site'), defaultConfig);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore Error (Config): ', error);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Sync Products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        // Try migration from localStorage ONLY if it's the very first time and we have nothing
        const saved = localStorage.getItem('products');
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as Product[];
            if (parsed.length > 0) {
              parsed.forEach(p => {
                const { id, ...data } = p;
                setDoc(doc(db, 'products', id), data);
              });
            }
          } catch(e) {
            // Seed defaults if everything else fails
          }
        }
      }
      
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => {
      console.error('Firestore Error (Products): ', error);
    });
    return unsub;
  }, []);

  // Safety timeout for loading (네트워크가 느린 접속자를 위해 여유 있게 설정)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      await setDoc(doc(db, 'config', 'site'), { ...config, ...newConfig }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, 'update', 'config/site');
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const { id, ...data } = product;
      await setDoc(doc(db, 'products', id), data);
    } catch (error) {
      handleFirestoreError(error, 'create', `products/${product.id}`);
    }
  };

  const updateProduct = async (id: string, updated: Product) => {
    try {
      const { id: _, ...data } = updated;
      await updateDoc(doc(db, 'products', id), data);
    } catch (error) {
      handleFirestoreError(error, 'update', `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, 'delete', `products/${id}`);
    }
  };

const addOrder = async (order: Order) => {
    try {
      const { id, ...data } = order;
      await setDoc(doc(db, 'orders', id), data);
    } catch (error) {
      handleFirestoreError(error, 'create', `orders/${order.id}`);
    }
  };
  
  const addPost = (post: Post) => {
    setPosts(prev => [...prev, post]);
  };

  const updatePost = (id: string, updated: Post) => {
    setPosts(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  function handleFirestoreError(error: any, operationType: string, path: string) {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // Check if it's a permission error and inform user they might need to login
    if (error.code === 'permission-denied') {
      alert('접근 권한이 없습니다. 관리자 로그인이 필요합니다.');
    }
    throw new Error(JSON.stringify(errInfo));
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{
      config, products, posts,
      updateConfig, addProduct, updateProduct, deleteProduct,
      addPost, updatePost, deletePost,
      addOrder
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};