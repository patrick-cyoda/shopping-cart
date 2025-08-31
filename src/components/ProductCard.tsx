import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { ProductSlimResponse } from '../types/api';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: ProductSlimResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.sku, 1);
  };

  return (
    <Link
      to={`/product/${product.sku}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <Package className="w-16 h-16 text-gray-400" />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-sm text-gray-600">
            {product.quantityAvailable} in stock
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.quantityAvailable === 0}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>{product.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </Link>
  );
}