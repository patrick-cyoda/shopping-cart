// Generated types from OpenAPI specification

export interface ProductSlimResponse {
  sku: string;
  name: string;
  price: number;
  category: string;
  quantityAvailable: number;
}

export interface ProductFullResponse {
  name: string;
  sku: string;
  price: number;
  quantityAvailable: number;
  category: string;
  description: string;
  warehouseId: string;
  media: string[];
  bundles: Record<string, any>[];
  variants: Record<string, any>[];
  events: any[];
  attributes: Record<string, any>;
  compliance: Record<string, any>;
  inventory: Record<string, any>;
  options: Record<string, any>;
  relationships: Record<string, any>;
  localizations: Record<string, Localization>;
}

export interface Localization {
  name: string;
  description: string;
}

export interface TechnicalIdResponse {
  technicalId: string;
}

export interface CartResponse {
  cartId: string;
  status: string;
  lines: LineResponse[];
  totalItems: number;
  grandTotal: number;
  guestContact?: GuestContactResponse;
  createdAt: string;
  updatedAt: string;
}

export interface LineResponse {
  name: string;
  price: number;
  qty: number;
  sku: string;
}

export interface AddLineRequest {
  sku: string;
  qty: number;
}

export interface GuestContactRequest {
  name: string;
  email: string;
  phone: string;
  address: AddressRequest;
}

export interface AddressRequest {
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface GuestContactResponse {
  name: string;
  email: string;
  phone: string;
  address: AddressResponse;
}

export interface AddressResponse {
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CheckoutRequest {
  guestContact: GuestContactRequest;
}

export interface StartPaymentRequest {
  cartId: string;
  amount?: number;
  provider?: string;
  status?: string;
}

export interface Payment {
  paymentId: string;
  cartId: string;
  amount: number;
  provider: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  paymentId: string;
  cartId: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  guestContact: GuestContact;
  lines: Line[];
  totals: Totals;
}

export interface GuestContact {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Line {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Totals {
  items: number;
  grand: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}