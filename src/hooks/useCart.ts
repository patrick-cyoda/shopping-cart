import { useState, useEffect, useCallback } from 'react';
import { CartResponse } from '../types/api';
import { createOrGetCart, getCart, addLineToCart, updateLineInCart } from '../services/api';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'cartTechnicalId';

export function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartId, setCartId] = useState<string | null>(
    localStorage.getItem(CART_STORAGE_KEY)
  );
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const cartData = await getCart(id);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
      // Clear invalid cart ID
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureCart = useCallback(async () => {
    if (cartId) {
      await loadCart(cartId);
      return cartId;
    }

    try {
      setLoading(true);
      const newCartId = await createOrGetCart();
      setCartId(newCartId);
      localStorage.setItem(CART_STORAGE_KEY, newCartId);
      await loadCart(newCartId);
      return newCartId;
    } catch (error) {
      console.error('Failed to create cart:', error);
      toast.error('Failed to create cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cartId, loadCart]);

  const addToCart = useCallback(async (sku: string, qty: number = 1) => {
    try {
      const currentCartId = cartId || await ensureCart();
      await addLineToCart(currentCartId, sku, qty);
      await loadCart(currentCartId);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  }, [cartId, ensureCart, loadCart]);

  const updateCartLine = useCallback(async (sku: string, qty: number) => {
    if (!cartId) return;

    try {
      await updateLineInCart(cartId, sku, qty);
      await loadCart(cartId);
      
      if (qty === 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated');
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart');
    }
  }, [cartId, loadCart]);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCartId(null);
    setCart(null);
  }, []);

  useEffect(() => {
    if (cartId) {
      loadCart(cartId);
    }
  }, [cartId, loadCart]);

  return {
    cart,
    cartId,
    loading,
    addToCart,
    updateCartLine,
    clearCart,
    ensureCart,
    totalItems: cart?.totalItems || 0,
    grandTotal: cart?.grandTotal || 0,
  };
}