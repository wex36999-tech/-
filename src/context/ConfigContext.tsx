import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  heroImage: string;
  contactEmail: string;
  phone: string;
  address: string;
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
}

const defaultConfig: SiteConfig = {
  name: '오늘도가성비',
  slogan: '프리미엄 가성비의 새로운 기준',
  description: '우리는 일상의 가치를 높이는 최고의 상품을 합리적인 가격에 유통합니다.',
  heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
  contactEmail: 'contact@gasungbi.com',
  phone: '02-1234-5678',
  address: '서울특별시 강남구 테헤란로 123, 가성비빌딩 5층',
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
    image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?q=80&w=1000&auto=format&fit=crop',
    category: '주방용품',
  },
  {
    id: '2',
    name: '유기농 햇사과 (5kg)',
    price: '24,900원',
    description: '산지 직송, 당도 높은 아삭한 사과.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1000&auto=format&fit=crop',
    category: '농산물',
  },
  {
    id: '3',
    name: '산지직송 완도 전복 (1kg)',
    price: '38,000원',
    description: '완도에서 잡아 올린 싱싱한 전복.',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1000&auto=format&fit=crop',
    category: '수산물',
  },
  {
    id: '4',
    name: '미니멀 데스크 램프',
    price: '29,900원',
    description: '눈이 편안한 LED 조명.',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000&auto=format&fit=crop',
    category: '생활가전',
  },
  {
    id: '5',
    name: '친환경 대나무 타월',
    price: '18,500원',
    description: '흡수력이 뛰어난 대나무 섬유.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
    category: '욕실용품',
  },
  {
    id: '6',
    name: '화이트 세라믹 머그',
    price: '12,000원',
    description: '심플한 디자인의 세라믹 머그컵.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed39?q=80&w=1000&auto=format&fit=crop',
    category: '주방용품',
  },
  {
    id: '7',
    name: '내추럴 우드 도마',
    price: '32,000원',
    description: '천연 원목으로 제작된 견고한 도마.',
    image: 'https://images.unsplash.com/photo-1594382342953-d64996b74442?q=80&w=1000&auto=format&fit=crop',
    category: '주방용품',
  },
  {
    id: '8',
    name: '에센셜 아로마 디퓨저',
    price: '27,500원',
    description: '공간의 분위기를 바꾸는 아로마 향기.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
    category: '생활가전',
  },
];

const defaultPosts: Post[] = [
  {
    id: '1',
    title: '2024년 봄 신상품 라인업 공개',
    excerpt: '이번 시즌 새롭게 선보이는 가성비 끝판왕 상품들을 만나보세요.',
    date: '2024.04.15',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '유통 구조의 혁신, 어떻게 가격을 낮췄나',
    excerpt: '오늘도가성비가 추구하는 유통 혁신과 소비자 가치에 대한 이야기.',
    date: '2024.04.10',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
  },
];

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('siteConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('posts');
    return saved ? JSON.parse(saved) : defaultPosts;
  });

  useEffect(() => {
    localStorage.setItem('siteConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
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

  return (
    <ConfigContext.Provider value={{
      config, products, posts,
      updateConfig, addProduct, updateProduct, deleteProduct,
      addPost, updatePost, deletePost
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
