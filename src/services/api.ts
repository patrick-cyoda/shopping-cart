import {
  ProductSlimResponse,
  ProductFullResponse,
  ProductFilters,
  TechnicalIdResponse,
  CartResponse,
  AddLineRequest,
  CheckoutRequest,
  StartPaymentRequest,
  Payment,
  CreateOrderRequest,
  OrderResponse,
} from '../types/api';

const API_BASE = import.meta.env.VITE_APP_API_BASE || 'http://localhost:8080';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Product API
export async function getProducts(filters: ProductFilters = {}): Promise<ProductSlimResponse[]> {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.pageSize !== undefined) params.append('pageSize', filters.pageSize.toString());

  const queryString = params.toString();
  const endpoint = `/ui/products${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ProductSlimResponse[]>(endpoint);
}

export async function getProductBySku(sku: string): Promise<ProductFullResponse> {
  return apiRequest<ProductFullResponse>(`/ui/products/${encodeURIComponent(sku)}`);
}

// Cart API
export async function createOrGetCart(): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>('/ui/cart', {
    method: 'POST',
    body: JSON.stringify({ action: 'createOrReturn' }),
  });
  return response.technicalId;
}

export async function getCart(technicalId: string): Promise<CartResponse> {
  return apiRequest<CartResponse>(`/ui/cart/${technicalId}`);
}

export async function addLineToCart(cartId: string, sku: string, qty: number): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>(`/ui/cart/${cartId}/lines`, {
    method: 'POST',
    body: JSON.stringify({ sku, qty } as AddLineRequest),
  });
  return response.technicalId;
}

export async function updateLineInCart(cartId: string, sku: string, qty: number): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>(`/ui/cart/${cartId}/lines`, {
    method: 'PATCH',
    body: JSON.stringify({ sku, qty } as AddLineRequest),
  });
  return response.technicalId;
}

export async function openCheckout(cartId: string): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>(`/ui/cart/${cartId}/open-checkout`, {
    method: 'POST',
  });
  return response.technicalId;
}

// Checkout API
export async function checkout(cartId: string, guestContact: CheckoutRequest['guestContact']): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>(`/ui/checkout/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({ guestContact } as CheckoutRequest),
  });
  return response.technicalId;
}

// Payment API
export async function startPayment(cartId: string, amount?: number): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>('/ui/payment/start', {
    method: 'POST',
    body: JSON.stringify({ 
      cartId, 
      amount,
      provider: 'DUMMY',
      status: 'INITIATED'
    } as StartPaymentRequest),
  });
  return response.technicalId;
}

export async function getPayment(technicalId: string): Promise<Payment> {
  return apiRequest<Payment>(`/ui/payment/${technicalId}`);
}

// Order API
export async function createOrder(paymentId: string, cartId: string): Promise<string> {
  const response = await apiRequest<TechnicalIdResponse>('/ui/order/create', {
    method: 'POST',
    body: JSON.stringify({ paymentId, cartId } as CreateOrderRequest),
  });
  return response.technicalId;
}

export async function getOrder(technicalId: string): Promise<OrderResponse> {
  return apiRequest<OrderResponse>(`/ui/order/${technicalId}`);
}