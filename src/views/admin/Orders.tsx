/**
 * Café 1973 | Bakery - Orders Management
 * Admin page for managing all orders
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePOS } from '@/hooks/usePOS';
import { format } from 'date-fns';
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coffee,
  Users,
  Truck,
  Eye,
  ChefHat,
  DollarSign,
  Calendar,
  ArrowRight,
  MoreVertical,
  Printer,
  X
} from 'lucide-react';

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
type OrderType = 'all' | 'dine_in' | 'takeout' | 'delivery';

interface OrderFilters {
  status: OrderStatus;
  type: OrderType;
  search: string;
  date: string;
}

export const Orders: React.FC = () => {
  const { language } = useLanguage();
  const { activeOrders, loadActiveOrders, isLoading } = usePOS();
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    type: 'all',
    search: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadActiveOrders();
    const interval = setInterval(loadActiveOrders, 30000);
    return () => clearInterval(interval);
  }, [loadActiveOrders]);

  const formatPrice = (price: number) => `₡${price.toLocaleString('es-CR')}`;

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: <Clock size={14} />
      },
      confirmed: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: <CheckCircle2 size={14} />
      },
      preparing: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: <ChefHat size={14} />
      },
      ready: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle2 size={14} />
      },
      completed: {
        bg: 'bg-forest/10',
        text: 'text-forest',
        icon: <CheckCircle2 size={14} />
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle size={14} />
      },
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine_in': return <Users size={16} />;
      case 'takeout': return <Coffee size={16} />;
      case 'delivery': return <Truck size={16} />;
      default: return <ClipboardList size={16} />;
    }
  };

  const getOrderTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      dine_in: { es: 'Mesa', en: 'Dine In' },
      takeout: { es: 'Para Llevar', en: 'Takeout' },
      delivery: { es: 'Delivery', en: 'Delivery' },
    };
    return labels[type]?.[language] || labels[type]?.['en'] || type;
  };

  const filteredOrders = activeOrders.filter(order => {
    if (filters.status !== 'all' && order.status.toLowerCase() !== filters.status) return false;
    if (filters.type !== 'all' && order.order_type !== filters.type) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesNumber = order.order_number?.toLowerCase().includes(searchLower);
      const matchesCustomer = order.customer_name?.toLowerCase().includes(searchLower);
      if (!matchesNumber && !matchesCustomer) return false;
    }
    return true;
  });

  const statusTabs: { value: OrderStatus; label: Record<string, string> }[] = [
    { value: 'all', label: { es: 'Todos', en: 'All' } },
    { value: 'pending', label: { es: 'Pendientes', en: 'Pending' } },
    { value: 'preparing', label: { es: 'Preparando', en: 'Preparing' } },
    { value: 'ready', label: { es: 'Listos', en: 'Ready' } },
    { value: 'completed', label: { es: 'Completados', en: 'Completed' } },
  ];

  // Stats
  const stats = {
    total: activeOrders.length,
    pending: activeOrders.filter(o => o.status === 'pending').length,
    preparing: activeOrders.filter(o => o.status === 'preparing').length,
    ready: activeOrders.filter(o => o.status === 'ready').length,
    revenue: activeOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {language === 'es' ? 'Pedidos' : 'Orders'}
          </h1>
          <p className="text-forest/60">
            {language === 'es' ? 'Gestión de pedidos del día' : "Today's order management"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/kitchen"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sand/30 text-forest rounded-xl hover:bg-sand/50 transition-colors"
          >
            <ChefHat size={18} />
            <span>{language === 'es' ? 'Cocina' : 'Kitchen'}</span>
          </Link>
          <button
            onClick={() => loadActiveOrders()}
            className="p-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
            title={language === 'es' ? 'Actualizar' : 'Refresh'}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center">
              <ClipboardList size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{stats.total}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Total' : 'Total'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{stats.pending}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Pendientes' : 'Pending'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{stats.preparing}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Preparando' : 'Preparing'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-espresso rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{formatPrice(stats.revenue)}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Ingresos' : 'Revenue'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="text"
              placeholder={language === 'es' ? 'Buscar por # o cliente...' : 'Search by # or customer...'}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f3] rounded-xl text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="pl-10 pr-4 py-2.5 bg-[#faf8f3] rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as OrderType })}
            className="px-4 py-2.5 bg-[#faf8f3] rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          >
            <option value="all">{language === 'es' ? 'Todos los tipos' : 'All types'}</option>
            <option value="dine_in">{language === 'es' ? 'Mesa' : 'Dine In'}</option>
            <option value="takeout">{language === 'es' ? 'Para llevar' : 'Takeout'}</option>
            <option value="delivery">{language === 'es' ? 'Delivery' : 'Delivery'}</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilters({ ...filters, status: tab.value })}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filters.status === tab.value
                  ? 'bg-forest text-white'
                  : 'bg-[#faf8f3] text-forest/70 hover:bg-sand/30'
              }`}
            >
              {tab.label[language] || tab.label['en']}
              {tab.value !== 'all' && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-md text-xs">
                  {activeOrders.filter(o =>
                    tab.value === 'all' ? true : o.status.toLowerCase() === tab.value
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {isLoading && filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-sand border-t-forest rounded-full animate-spin mx-auto mb-4" />
            <p className="text-forest/60">
              {language === 'es' ? 'Cargando pedidos...' : 'Loading orders...'}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Coffee size={48} className="text-sand mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-forest mb-2">
              {language === 'es' ? 'No hay pedidos' : 'No orders found'}
            </h3>
            <p className="text-forest/60">
              {language === 'es'
                ? 'Los pedidos aparecerán aquí cuando se realicen'
                : 'Orders will appear here when placed'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sand/20">
            {filteredOrders.map((order) => {
              const statusStyle = getStatusStyle(order.status);

              return (
                <div
                  key={order.id}
                  className="p-4 hover:bg-[#faf8f3] transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Order Number */}
                      <div className="w-14 h-14 bg-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          #{order.order_number?.slice(-2) || '00'}
                        </span>
                      </div>

                      {/* Order Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-forest">
                            {order.order_number || `#${order.id.slice(-6)}`}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-forest/60">
                          <span className="flex items-center gap-1">
                            {getOrderTypeIcon(order.order_type)}
                            {getOrderTypeLabel(order.order_type)}
                          </span>
                          {order.table_number && (
                            <span>Mesa {order.table_number}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {order.created_at ? format(new Date(order.created_at), 'HH:mm') : '--:--'}
                          </span>
                        </div>
                        {order.customer_name && (
                          <p className="text-sm text-forest/70 mt-1">
                            {order.customer_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-espresso">
                        {formatPrice(order.total || 0)}
                      </p>
                      <p className="text-xs text-forest/50">
                        {order.items?.length || 0} {language === 'es' ? 'items' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-sand/30 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Items */}
                        <div>
                          <h4 className="text-sm font-semibold text-forest mb-2">
                            {language === 'es' ? 'Productos' : 'Items'}
                          </h4>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-forest">
                                  {item.quantity}x {item.menu_item_name}
                                </span>
                                <span className="text-forest/60">
                                  {formatPrice(item.subtotal || (item.menu_item_price ?? item.unit_price) * item.quantity)}
                                </span>
                              </div>
                            )) || (
                              <p className="text-sm text-forest/50">
                                {language === 'es' ? 'Sin items' : 'No items'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h4 className="text-sm font-semibold text-forest mb-2">
                            {language === 'es' ? 'Resumen' : 'Summary'}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-forest/60">Subtotal</span>
                              <span className="text-forest">{formatPrice(order.subtotal || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-forest/60">{language === 'es' ? 'Impuesto' : 'Tax'}</span>
                              <span className="text-forest">{formatPrice(order.tax || 0)}</span>
                            </div>
                            {(order.discount_amount ?? 0) > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>{language === 'es' ? 'Descuento' : 'Discount'}</span>
                                <span>-{formatPrice(order.discount_amount ?? 0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold pt-2 border-t border-sand/30">
                              <span className="text-forest">Total</span>
                              <span className="text-espresso">{formatPrice(order.total || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 px-4 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors flex items-center justify-center gap-2">
                          <Eye size={16} />
                          {language === 'es' ? 'Ver detalle' : 'View details'}
                        </button>
                        <button className="px-4 py-2 bg-sand/30 text-forest rounded-xl hover:bg-sand/50 transition-colors">
                          <Printer size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Update Indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-full shadow-lg text-sm">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span>
          {language === 'es' ? 'Actualización en vivo' : 'Live updates'}
        </span>
      </div>
    </div>
  );
};

export default Orders;
