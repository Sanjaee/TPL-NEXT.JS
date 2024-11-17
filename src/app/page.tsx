'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [take, setTake] = useState(1); // Default value for take
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalStats, setTotalStats] = useState({
    total: 0,
    categoryTotal: 0,
    searchTotal: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Automotive',
    'Health',
    'Beauty',
    'Food & Beverage',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          searchTerm: debouncedSearchTerm,
          ...(category && { category }),
          take: take.toString(), // Add take to the API call
        });

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data);

        // Update stats
        setTotalStats({
          total: data.length, // Current visible products
          categoryTotal: category ? data.length : 0, // Products in current category
          searchTotal: debouncedSearchTerm ? data.length : 0, // Products matching search
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm, category, take]);

  const incrementTake = () => setTake((prev) => prev + 10); // Increase take by 10
  const decrementTake = () => setTake((prev) => Math.max(prev - 10, 10)); // Decrease take but not below 10

  const handleTakeChange = (e) => {
    const value = parseInt(e.target.value, 0);
    if (!isNaN(value) && value >= 1) setTake(value); // Ensure take is a valid number and >= 10
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Product Search
      </h1>

      <div className="grid gap-6 mb-6">
        {/* Search Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* Take Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={decrementTake}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                -10
              </button>
              <input
                type="number"
                value={take}
                onChange={handleTakeChange}
                className="w-16 text-center px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
              <button
                onClick={incrementTake}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalStats.total}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
            {category && (
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {totalStats.categoryTotal}
                </p>
                <p className="text-sm text-gray-600">In {category}</p>
              </div>
            )}
            {debouncedSearchTerm && (
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {totalStats.searchTotal}
                </p>
                <p className="text-sm text-gray-600">Search Results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Section */}
      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Products Section */}
   {/* Products Section */}
{loading ? (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
  </div>
) : products.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map((product, index) => (
      <div
        key={product.id}
        className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow relative"
      >
        {/* Nomor Urut */}
        <div className="absolute top-2 left-2 bg-green-200 text-gray-800 text-xs px-2 py-1 rounded-full">
          No: {index + 1}
        </div>

        <ProductCard product={product} />
      </div>
    ))}
  </div>
) : (
  <div className="text-gray-500 text-center mt-10">
    No products found. Try adjusting your search.
  </div>
)}

    </div>
  );
}
