import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { useParams, useNavigate } from '@/lib/router';
import { useLanguage } from '../contexts/LanguageContext';
import { API_URL } from '../utils/constants';
import axios from 'axios';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
} from 'lucide-react';

interface OrderItem {
  id: string;
  menu_item_name: string;
  quantity: number;
  item_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: OrderItem[];
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  created_at: string;
  online_order?: {
    order_type: string;
    delivery_address?: any;
    estimated_delivery_time?: string;
    actual_delivery_time?: string;
    delivery_fee: number;
  };
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  message: string;
}

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = {
    en: {
      title: "Track Your Order",
      orderNumber: "Order Number",
      orderStatus: "Order Status",
      estimatedTime: "Estimated Time",
      contactUs: "Contact Us",
      orderDetails: "Order Details",
      deliveryAddress: "Delivery Address",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      tax: "Tax",
      deliveryFee: "Delivery Fee",
      discount: "Discount",
      total: "Total",
      backToMenu: "Back to Menu",
      loading: "Loading order details...",
      notFound: "Order not found",
      status: {
        pending: "Order Received",
        confirmed: "Order Confirmed",
        preparing: "Preparing Your Order",
        ready: "Order Ready",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Completed",
      },
    },
    es: {
      title: "Rastrear Tu Pedido",
      orderNumber: "Número de Pedido",
      orderStatus: "Estado del Pedido",
      estimatedTime: "Tiempo Estimado",
      contactUs: "Contáctanos",
      orderDetails: "Detalles del Pedido",
      deliveryAddress: "Dirección de Entrega",
      orderSummary: "Resumen del Pedido",
      subtotal: "Subtotal",
      tax: "Impuesto",
      deliveryFee: "Costo de Envío",
      discount: "Descuento",
      total: "Total",
      backToMenu: "Volver al Menú",
      loading: "Cargando detalles del pedido...",
      notFound: "Pedido no encontrado",
      status: {
        pending: "Pedido Recibido",
        confirmed: "Pedido Confirmado",
        preparing: "Preparando Tu Pedido",
        ready: "Pedido Listo",
        out_for_delivery: "En Camino",
        delivered: "Entregado",
        completed: "Completado",
      },
    },
    it: {
      title: "Traccia il Tuo Ordine",
      orderNumber: "Numero Ordine",
      orderStatus: "Stato dell'Ordine",
      estimatedTime: "Tempo Stimato",
      contactUs: "Contattaci",
      orderDetails: "Dettagli Ordine",
      deliveryAddress: "Indirizzo di Consegna",
      orderSummary: "Riepilogo Ordine",
      subtotal: "Subtotale",
      tax: "IVA",
      deliveryFee: "Costo di Consegna",
      discount: "Sconto",
      total: "Totale",
      backToMenu: "Torna al Menu",
      loading: "Caricamento dettagli ordine...",
      notFound: "Ordine non trovato",
      status: {
        pending: "Ordine Ricevuto",
        confirmed: "Ordine Confermato",
        preparing: "Preparazione in Corso",
        ready: "Ordine Pronto",
        out_for_delivery: "In Consegna",
        delivered: "Consegnato",
        completed: "Completato",
      },
    },
    de: {
      title: "Bestellung Verfolgen",
      orderNumber: "Bestellnummer",
      orderStatus: "Bestellstatus",
      estimatedTime: "Geschätzte Zeit",
      contactUs: "Kontakt",
      orderDetails: "Bestelldetails",
      deliveryAddress: "Lieferadresse",
      orderSummary: "Bestellübersicht",
      subtotal: "Zwischensumme",
      tax: "MwSt.",
      deliveryFee: "Liefergebühr",
      discount: "Rabatt",
      total: "Gesamt",
      backToMenu: "Zurück zum Menü",
      loading: "Bestelldetails werden geladen...",
      notFound: "Bestellung nicht gefunden",
      status: {
        pending: "Bestellung Eingegangen",
        confirmed: "Bestellung Bestätigt",
        preparing: "Zubereitung",
        ready: "Bestellung Fertig",
        out_for_delivery: "Unterwegs",
        delivered: "Geliefert",
        completed: "Abgeschlossen",
      },
    },
    fr: {
      title: "Suivre Votre Commande",
      orderNumber: "Numéro de Commande",
      orderStatus: "Statut de la Commande",
      estimatedTime: "Temps Estimé",
      contactUs: "Nous Contacter",
      orderDetails: "Détails de la Commande",
      deliveryAddress: "Adresse de Livraison",
      orderSummary: "Résumé de la Commande",
      subtotal: "Sous-total",
      tax: "TVA",
      deliveryFee: "Frais de Livraison",
      discount: "Réduction",
      total: "Total",
      backToMenu: "Retour au Menu",
      loading: "Chargement des détails...",
      notFound: "Commande non trouvée",
      status: {
        pending: "Commande Reçue",
        confirmed: "Commande Confirmée",
        preparing: "Préparation en Cours",
        ready: "Commande Prête",
        out_for_delivery: "En Livraison",
        delivered: "Livrée",
        completed: "Terminée",
      },
    },
    sv: {
      title: "Spåra Din Beställning",
      orderNumber: "Ordernummer",
      orderStatus: "Orderstatus",
      estimatedTime: "Beräknad Tid",
      contactUs: "Kontakta Oss",
      orderDetails: "Orderdetaljer",
      deliveryAddress: "Leveransadress",
      orderSummary: "Orderöversikt",
      subtotal: "Delsumma",
      tax: "Moms",
      deliveryFee: "Leveransavgift",
      discount: "Rabatt",
      total: "Totalt",
      backToMenu: "Tillbaka till Menyn",
      loading: "Laddar orderdetaljer...",
      notFound: "Ordern hittades inte",
      status: {
        pending: "Order Mottagen",
        confirmed: "Order Bekräftad",
        preparing: "Förbereder Din Order",
        ready: "Order Klar",
        out_for_delivery: "På Väg",
        delivered: "Levererad",
        completed: "Slutförd",
      },
    },
  };

  const translations = t[language as keyof typeof t];

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchTrackingInfo();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/online-orders/${orderId}`);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch order details');
      logger.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/online-orders/${orderId}/track`);
      setTrackingData(response.data);
    } catch (err: any) {
      logger.error('Error fetching tracking info:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6" />;
      case 'preparing':
        return <Package className="w-6 h-6" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6" />;
      case 'out_for_delivery':
        return <Truck className="w-6 h-6" />;
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FloatingLanguageSelector />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translations.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FloatingLanguageSelector />
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations.notFound}</h2>
          <button
            onClick={() => navigate('/order')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
          >
            {translations.backToMenu}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/order')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {translations.backToMenu}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{translations.title}</h1>
          <p className="text-gray-600 mt-2">
            {translations.orderNumber}: <span className="font-semibold">{order.order_number}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{translations.orderStatus}</h2>

              {/* Status Timeline */}
              <div className="space-y-6">
                {trackingData?.status_history?.map(
                  (item: StatusHistoryItem, index: number) => {
                    const isLast = index === trackingData.status_history.length - 1;
                    return (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full ${
                              isLast ? 'bg-amber-600 text-white' : 'bg-green-500 text-white'
                            }`}
                          >
                            {getStatusIcon(item.status)}
                          </div>
                          {!isLast && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3 className="font-semibold text-gray-900">{item.message}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Estimated Time */}
              {order.online_order?.estimated_delivery_time && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-amber-600 mr-2" />
                    <div>
                      <p className="font-semibold text-gray-900">{translations.estimatedTime}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.online_order.estimated_delivery_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            {order.online_order?.delivery_address && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {translations.deliveryAddress}
                </h2>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-900">
                      {order.online_order.delivery_address.street}
                    </p>
                    <p className="text-gray-900">
                      {order.online_order.delivery_address.city},{' '}
                      {order.online_order.delivery_address.state}{' '}
                      {order.online_order.delivery_address.zip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{translations.contactUs}</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{order.guest_phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{order.guest_email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {translations.orderSummary}
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 border-b pb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menu_item_name}
                    </span>
                    <span className="text-gray-900">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>{translations.subtotal}</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{translations.tax}</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.online_order && order.online_order.delivery_fee > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>{translations.deliveryFee}</span>
                    <span>${order.online_order.delivery_fee.toFixed(2)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{translations.discount}</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                  <span>{translations.total}</span>
                  <span className="text-amber-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
