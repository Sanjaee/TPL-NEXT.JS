interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    user: {
      id: number;
      name: string;
    };
  }
  
  interface SearchParams {
    searchTerm: string;
    category?: string;
  }
  