import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { useNavigate } from '@/lib/router';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { API_URL } from '../utils/constants';
import axios from 'axios';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Check, MapPin, User, CreditCard, Package, Truck } from 'lucide-react';

interface CheckoutStep {
  id: number;
  name: string;
  icon: any;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cart, validateCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    en: {
      title: "Checkout",
      orderType: "Order Type",
      delivery: "Delivery",
      pickup: "Pickup",
      customerInfo: "Customer Information",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      deliveryAddress: "Delivery Address",
      street: "Street Address",
      city: "City",
      state: "State",
      zipCode: "ZIP Code",
      deliveryInstructions: "Delivery Instructions (Optional)",
      payment: "Payment",
      cardPayment: "Credit/Debit Card",
      placeOrder: "Place Order",
      next: "Next",
      back: "Back",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      tax: "Tax",
      deliveryFee: "Delivery Fee",
      total: "Total",
      processing: "Processing...",
    },
    es: {
      title: "Pagar",
      orderType: "Tipo de Pedido",
      delivery: "Entrega a Domicilio",
      pickup: "Recoger en Tienda",
      customerInfo: "Información del Cliente",
      name: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono",
      deliveryAddress: "Dirección de Entrega",
      street: "Dirección",
      city: "Ciudad",
      state: "Estado",
      zipCode: "Código Postal",
      deliveryInstructions: "Instrucciones de Entrega (Opcional)",
      payment: "Pago",
      cardPayment: "Tarjeta de Crédito/Débito",
      placeOrder: "Realizar Pedido",
      next: "Siguiente",
      back: "Atrás",
      orderSummary: "Resumen del Pedido",
      subtotal: "Subtotal",
      tax: "Impuesto",
      deliveryFee: "Costo de Envío",
      total: "Total",
      processing: "Procesando...",
    },
    it: {
      title: "Checkout",
      orderType: "Tipo di Ordine",
      delivery: "Consegna",
      pickup: "Ritiro",
      customerInfo: "Informazioni Cliente",
      name: "Nome Completo",
      email: "Email",
      phone: "Telefono",
      deliveryAddress: "Indirizzo di Consegna",
      street: "Indirizzo",
      city: "Città",
      state: "Provincia",
      zipCode: "CAP",
      deliveryInstructions: "Istruzioni per la Consegna (Opzionale)",
      payment: "Pagamento",
      cardPayment: "Carta di Credito/Debito",
      placeOrder: "Effettua Ordine",
      next: "Avanti",
      back: "Indietro",
      orderSummary: "Riepilogo Ordine",
      subtotal: "Subtotale",
      tax: "IVA",
      deliveryFee: "Costo di Consegna",
      total: "Totale",
      processing: "Elaborazione...",
    },
    de: {
      title: "Kasse",
      orderType: "Bestellart",
      delivery: "Lieferung",
      pickup: "Abholung",
      customerInfo: "Kundeninformationen",
      name: "Vollständiger Name",
      email: "E-Mail",
      phone: "Telefon",
      deliveryAddress: "Lieferadresse",
      street: "Straße",
      city: "Stadt",
      state: "Bundesland",
      zipCode: "PLZ",
      deliveryInstructions: "Lieferhinweise (Optional)",
      payment: "Zahlung",
      cardPayment: "Kredit-/Debitkarte",
      placeOrder: "Bestellung Aufgeben",
      next: "Weiter",
      back: "Zurück",
      orderSummary: "Bestellübersicht",
      subtotal: "Zwischensumme",
      tax: "MwSt.",
      deliveryFee: "Liefergebühr",
      total: "Gesamt",
      processing: "Verarbeitung...",
    },
    fr: {
      title: "Paiement",
      orderType: "Type de Commande",
      delivery: "Livraison",
      pickup: "Retrait",
      customerInfo: "Informations Client",
      name: "Nom Complet",
      email: "Email",
      phone: "Téléphone",
      deliveryAddress: "Adresse de Livraison",
      street: "Adresse",
      city: "Ville",
      state: "Région",
      zipCode: "Code Postal",
      deliveryInstructions: "Instructions de Livraison (Optionnel)",
      payment: "Paiement",
      cardPayment: "Carte de Crédit/Débit",
      placeOrder: "Passer la Commande",
      next: "Suivant",
      back: "Retour",
      orderSummary: "Résumé de la Commande",
      subtotal: "Sous-total",
      tax: "TVA",
      deliveryFee: "Frais de Livraison",
      total: "Total",
      processing: "Traitement...",
    },
    sv: {
      title: "Kassa",
      orderType: "Beställningstyp",
      delivery: "Leverans",
      pickup: "Upphämtning",
      customerInfo: "Kundinformation",
      name: "Fullständigt Namn",
      email: "E-post",
      phone: "Telefon",
      deliveryAddress: "Leveransadress",
      street: "Gatuadress",
      city: "Stad",
      state: "Län",
      zipCode: "Postnummer",
      deliveryInstructions: "Leveransinstruktioner (Valfritt)",
      payment: "Betalning",
      cardPayment: "Kredit-/Betalkort",
      placeOrder: "Lägg Beställning",
      next: "Nästa",
      back: "Tillbaka",
      orderSummary: "Orderöversikt",
      subtotal: "Delsumma",
      tax: "Moms",
      deliveryFee: "Leveransavgift",
      total: "Totalt",
      processing: "Bearbetar...",
    },
  };

  const translations = t[language as keyof typeof t];

  const steps: CheckoutStep[] = [
    { id: 1, name: translations.orderType, icon: Package },
    { id: 2, name: translations.customerInfo, icon: User },
    { id: 3, name: orderType === 'delivery' ? translations.deliveryAddress : translations.payment, icon: orderType === 'delivery' ? MapPin : CreditCard },
    { id: 4, name: translations.payment, icon: CreditCard },
  ];

  const handleNext = () => {
    if (currentStep < (orderType === 'delivery' ? 4 : 3)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate cart first
      const validation = await validateCart();
      if (!validation.is_valid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Prepare checkout data
      const checkoutData = {
        order_type: orderType,
        guest_name: customerInfo.name,
        guest_email: customerInfo.email,
        guest_phone: customerInfo.phone,
        delivery_address: orderType === 'delivery' ? deliveryAddress : null,
        delivery_instructions: orderType === 'delivery' ? deliveryInstructions : null,
        payment_method: paymentMethod,
      };

      // Get session ID
      const sessionId = localStorage.getItem('cart_session_id');

      // Place order
      const response = await axios.post(
        `${API_URL}/cart/checkout`,
        checkoutData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId,
          },
        }
      );

      // Redirect to order confirmation
      navigate(`/order-tracking/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to place order');
      logger.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{translations.title}</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.slice(0, orderType === 'delivery' ? 4 : 3).map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className="text-sm mt-2 text-gray-700">{step.name}</span>
                  </div>
                  {index < (orderType === 'delivery' ? 3 : 2) && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Step 1: Order Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {translations.orderType}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={`p-6 border-2 rounded-lg flex flex-col items-center ${
                        orderType === 'delivery'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Truck className="w-12 h-12 mb-2" />
                      <span className="font-semibold">{translations.delivery}</span>
                    </button>
                    <button
                      onClick={() => setOrderType('pickup')}
                      className={`p-6 border-2 rounded-lg flex flex-col items-center ${
                        orderType === 'pickup'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Package className="w-12 h-12 mb-2" />
                      <span className="font-semibold">{translations.pickup}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Info */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {translations.customerInfo}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.name} *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.email} *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.phone} *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery Address (if delivery) */}
              {currentStep === 3 && orderType === 'delivery' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {translations.deliveryAddress}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.street} *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {translations.city} *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.city}
                          onChange={(e) =>
                            setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {translations.state} *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.state}
                          onChange={(e) =>
                            setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.zipCode} *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.zip}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.deliveryInstructions}
                      </label>
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment (or Step 3 for pickup) */}
              {((currentStep === 4 && orderType === 'delivery') ||
                (currentStep === 3 && orderType === 'pickup')) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {translations.payment}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Payment will be processed upon delivery/pickup.
                  </p>
                  <div className="border-2 border-amber-600 bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-amber-600 mr-3" />
                      <span className="font-semibold">{translations.cardPayment}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {translations.back}
                </button>

                {(currentStep === 4 && orderType === 'delivery') ||
                (currentStep === 3 && orderType === 'pickup') ? (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? translations.processing : translations.placeOrder}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {translations.next}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {translations.orderSummary}
              </h2>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menu_item_name}
                    </span>
                    <span className="text-gray-900">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>{translations.subtotal}</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{translations.tax}</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-700">
                    <span>{translations.deliveryFee}</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                  <span>{translations.total}</span>
                  <span className="text-amber-600">
                    ${(cart.total + (orderType === 'delivery' ? 5 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
