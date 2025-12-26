/**
 * Café 1973 | Bakery - Kitchen Display System
 * Real-time order display for kitchen staff
 */
import React, { useState } from 'react';
import { useKitchenOrders } from '@/hooks/usePOS';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  UtensilsCrossed,
  Truck,
  Users,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

export default function KitchenDisplay() {
  const { orders, isLoading, error, loadKitchenOrders, markItemReady } = useKitchenOrders();
  const { language } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getOrderStyle = (elapsedMinutes: number) => {
    if (elapsedMinutes < 10) return {
      bg: 'bg-green-50',
      border: 'border-green-400',
      accent: 'text-green-600',
      badge: 'bg-green-500'
    };
    if (elapsedMinutes < 20) return {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      accent: 'text-amber-600',
      badge: 'bg-amber-500'
    };
    return {
      bg: 'bg-red-50',
      border: 'border-red-400',
      accent: 'text-red-600',
      badge: 'bg-red-500'
    };
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine_in': return <Users size={16} />;
      case 'takeout': return <Coffee size={16} />;
      case 'delivery': return <Truck size={16} />;
      default: return <UtensilsCrossed size={16} />;
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sand border-t-forest rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest/60">
            {language === 'es' ? 'Cargando pedidos...' : 'Loading orders...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="bg-forest text-white px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sand rounded-xl flex items-center justify-center">
              <ChefHat size={24} className="text-forest" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {language === 'es' ? 'Cocina' : 'Kitchen Display'}
              </h1>
              <p className="text-white/70 text-sm">
                Café 1973 | {orders.length} {language === 'es' ? 'pedidos activos' : 'active orders'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-xl transition-colors ${
                soundEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Refresh */}
            <button
              onClick={() => loadKitchenOrders()}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title={language === 'es' ? 'Actualizar' : 'Refresh'}
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title={language === 'es' ? 'Pantalla completa' : 'Fullscreen'}
            >
              <Maximize2 size={20} />
            </button>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl ml-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Grid */}
      <main className="p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-sand/30 rounded-full flex items-center justify-center mb-6">
              <Coffee size={40} className="text-forest/40" />
            </div>
            <h2 className="text-2xl font-bold text-forest mb-2">
              {language === 'es' ? 'Sin pedidos' : 'No Orders'}
            </h2>
            <p className="text-forest/60">
              {language === 'es'
                ? 'Los pedidos aparecerán aquí cuando se envíen desde POS'
                : 'Orders will appear here when sent from POS'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => {
              const style = getOrderStyle(order.elapsed_minutes);
              const readyItems = order.items.filter(i => i.is_ready).length;
              const totalItems = order.items.length;

              return (
                <div
                  key={order.id}
                  className={`${style.bg} ${style.border} border-2 rounded-2xl overflow-hidden shadow-soft`}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-black/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-forest">
                        #{order.order_number}
                      </span>
                      <span className={`${style.badge} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-forest/70">
                        {getOrderTypeIcon(order.order_type)}
                        <span>{getOrderTypeLabel(order.order_type)}</span>
                        {order.table_number && (
                          <span className="font-semibold">• Mesa {order.table_number}</span>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 font-bold ${style.accent}`}>
                        <Clock size={14} />
                        <span>{order.elapsed_minutes}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          item.is_ready
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-white border border-transparent'
                        }`}
                      >
                        <div className={`flex-1 ${item.is_ready ? 'line-through opacity-60' : ''}`}>
                          <div className="font-semibold text-forest">
                            <span className="text-lg mr-2">{item.quantity}x</span>
                            {item.menu_item_name}
                          </div>
                          {item.special_instructions && (
                            <div className="text-xs text-espresso mt-1 font-medium">
                              ⚠️ {item.special_instructions}
                            </div>
                          )}
                        </div>
                        {!item.is_ready ? (
                          <button
                            onClick={() => markItemReady(order.id, item.id)}
                            className="ml-3 px-4 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 active:scale-95 transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 size={16} />
                            <span className="hidden sm:inline">
                              {language === 'es' ? 'Listo' : 'Ready'}
                            </span>
                          </button>
                        ) : (
                          <CheckCircle2 size={24} className="text-green-500 ml-3" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mx-4 mb-4 p-3 bg-amber-100 rounded-xl text-sm text-amber-800">
                      <strong>{language === 'es' ? 'Notas:' : 'Notes:'}</strong> {order.notes}
                    </div>
                  )}

                  {/* Progress Footer */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-forest/60">
                        {readyItems} / {totalItems} {language === 'es' ? 'listos' : 'ready'}
                      </span>
                      <span className="text-sm font-medium text-forest">
                        {Math.round((readyItems / totalItems) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest rounded-full transition-all duration-500"
                        style={{ width: `${(readyItems / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-forest text-white px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full" />
            {language === 'es' ? '< 10min' : '< 10min'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full" />
            {language === 'es' ? '10-20min' : '10-20min'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-400 rounded-full" />
            {language === 'es' ? '> 20min' : '> 20min'}
          </span>
        </div>
        <div className="text-white/70">
          {language === 'es' ? 'Actualización automática cada 10s' : 'Auto-refresh every 10s'}
        </div>
      </div>
    </div>
  );
}
