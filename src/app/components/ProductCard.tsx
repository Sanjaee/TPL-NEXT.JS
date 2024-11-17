

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="h-full">
      <div className="pb-2 pt-5">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
      <div>
        <p className="mb-2 text-sm line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <span className="text-sm">Stock: {product.stock}</span>
        </div>
      </div>
    </div>
  );
}
