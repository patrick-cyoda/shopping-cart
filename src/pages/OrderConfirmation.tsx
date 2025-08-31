import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, User, MapPin, Clock } from 'lucide-react';
import { OrderResponse } from '../types/api';
import { getOrder } from '../services/api';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const ORDER_STATUS_LABELS: Record<string, string> = {
  'WAITING_TO_FULFILL': 'Waiting to Fulfill',
  'PICKING': 'Picking',
  'WAITING_TO_SEND': 'Waiting to Send',
  'SENT': 'Sent',
  'DELIVERED': 'Delivered',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  'WAITING_TO_FULFILL': 'bg-yellow-100 text-yellow-800',
  'PICKING': 'bg-blue-100 text-blue-800',
  'WAITING_TO_SEND': 'bg-purple-100 text-purple-800',
  'SENT': 'bg-green-100 text-green-800',
  'DELIVERED': 'bg-green-100 text-green-800',
};

export function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrder(id);
        setOrder(data);
        // Clear cart after successful order
        clearCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, clearCart]);

  if (loading) {
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
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Order not found</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 underline mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order. We'll send you updates as it progresses.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderNumber}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Contact Information</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.guestContact.name}</p>
              <p>{order.guestContact.email}</p>
              <p>{order.guestContact.phone}</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Shipping Address</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.guestContact.address.line1}</p>
              <p>{order.guestContact.address.city}, {order.guestContact.address.postcode}</p>
              <p>{order.guestContact.address.country}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Order Timeline</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Ordered: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
        
        <div className="space-y-4">
          {order.lines.map((line) => (
            <div key={line.sku} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{line.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {line.sku}</p>
                  <p className="text-sm text-gray-600">Qty: {line.qty}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">${line.lineTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600">${line.unitPrice.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Items Total</span>
            <span className="font-medium">${order.totals.items.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span className="text-indigo-600">${order.totals.grand.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}