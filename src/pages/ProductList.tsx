import React, { useState, useEffect, useMemo } from 'react';
import { ProductSlimResponse, ProductFilters } from '../types/api';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductFiltersComponent } from '../components/ProductFilters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ProductList() {
  const [products, setProducts] = useState<ProductSlimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  const loadProducts = async (currentFilters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(currentFilters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => loadProducts(filters)} 
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Discover our collection of quality products</p>
      </div>

      <ProductFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
      />

      {loading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}