"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce"; // Pastikan path sesuai
import ProductCard from "../components/ProductCard"; // Pastikan path sesuai
import { Loader2 } from "lucide-react";

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [take, setTake] = useState(1); // Default mengambil 10 produk
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
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
    "Automotive",
    "Health",
    "Beauty",
    "Food & Beverage",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          searchTerm: debouncedSearchTerm,
          category,
          take: take.toString(),
        });

        const response = await fetch(
          `http://localhost:5113/api/Product/search?${params}`
        );
        if (!response.ok) throw new Error("Gagal mengambil produk");

        const data = await response.json();
        setProducts(data);

        setTotalStats({
          total: data.length,
          categoryTotal: category ? data.length : 0,
          searchTotal: debouncedSearchTerm ? data.length : 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm, category, take]);

  const incrementTake = () => setTake((prev) => prev + 10);
  const decrementTake = () => setTake((prev) => Math.max(prev - 10, 1));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Product Search
      </h1>

      <div className="grid gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementTake}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                -10
              </button>
              <input
                type="text"
                value={new Intl.NumberFormat("id-ID").format(take)} // Format ke 10.000
                onChange={(e) => {
                  const numericValue = parseInt(
                    e.target.value.replace(/\./g, ""),
                    10
                  ); // Hapus titik dan konversi ke angka
                  if (!isNaN(numericValue)) {
                    setTake(Math.max(numericValue, 1)); // Minimal 1
                  }
                }}
                className="w-full max-w-32 px-4 py-2 text-center border rounded-lg"
              />

              <button
                onClick={incrementTake}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                +10
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg p-4 relative"
            >
              <div className="absolute top-2 left-2 bg-green-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                No: {index + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Tidak ada produk ditemukan.</p>
      )}
    </div>
  );
}
