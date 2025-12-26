/**
 * Cafe 1973 - Gift Cards Page
 * Purchase and check balance of gift cards
 * Mobile-first design with multi-language support (en, es, it, de, fr, sv)
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Gift, CreditCard, Heart, Send, Check } from 'lucide-react';

// Storage key for gift cards
const GIFT_CARDS_STORAGE_KEY = 'cafe1973_gift_cards';

// Gift card value options in Costa Rican Colones
const GIFT_CARD_VALUES = [
  { value: 5000, label: '₡5,000' },
  { value: 10000, label: '₡10,000' },
  { value: 25000, label: '₡25,000' },
  { value: 50000, label: '₡50,000' },
];

// Delivery methods
const DELIVERY_METHODS = {
  email: { en: 'Email', es: 'Correo Electronico', it: 'Email', de: 'E-Mail', fr: 'E-mail', sv: 'E-post' },
  print: { en: 'Print at Home', es: 'Imprimir en Casa', it: 'Stampa a Casa', de: 'Zu Hause Drucken', fr: 'Imprimer a la Maison', sv: 'Skriv Ut Hemma' },
};

// Gift card interface
interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  recipientName: string;
  senderName: string;
  message: string;
  deliveryMethod: 'email' | 'print';
  recipientEmail?: string;
  purchaseDate: string;
  isRedeemed: boolean;
}

// Content translations
const translations = {
  en: {
    hero: {
      title: 'Gift Cards',
      subtitle: 'Give the gift of delicious moments at Cafe 1973',
      tagline: 'Since 1973',
    },
    selectAmount: {
      title: 'Select Amount',
    },
    personalization: {
      title: 'Personalize Your Gift',
      to: 'To',
      toPlaceholder: "Recipient's name",
      from: 'From',
      fromPlaceholder: 'Your name',
      message: 'Message',
      messagePlaceholder: 'Add a personal message (optional)',
      email: 'Recipient Email',
      emailPlaceholder: 'email@example.com',
    },
    delivery: {
      title: 'Delivery Method',
    },
    preview: {
      title: 'Card Preview',
      giftCard: 'Gift Card',
      to: 'To',
      from: 'From',
    },
    purchase: {
      button: 'Purchase Gift Card',
      processing: 'Processing...',
    },
    success: {
      title: 'Purchase Successful!',
      message: 'Your gift card has been created and is ready to share.',
      code: 'Gift Card Code',
      another: 'Purchase Another',
    },
    checkBalance: {
      title: 'Check Balance',
      subtitle: 'Enter your gift card code to check the remaining balance',
      placeholder: 'Enter gift card code',
      button: 'Check Balance',
      result: 'Current Balance',
      notFound: 'Gift card not found. Please check the code and try again.',
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        {
          title: 'Purchase',
          description: 'Choose an amount and personalize your gift card',
        },
        {
          title: 'Send or Print',
          description: 'Email it directly or print it at home',
        },
        {
          title: 'Redeem',
          description: 'Recipient uses the code at checkout',
        },
      ],
    },
    footer: {
      noExpiration: 'Gift cards never expire.',
      rights: 'All rights reserved.',
    },
  },
  es: {
    hero: {
      title: 'Tarjetas de Regalo',
      subtitle: 'Regala momentos deliciosos en Cafe 1973',
      tagline: 'Desde 1973',
    },
    selectAmount: {
      title: 'Selecciona el Monto',
    },
    personalization: {
      title: 'Personaliza tu Regalo',
      to: 'Para',
      toPlaceholder: 'Nombre del destinatario',
      from: 'De',
      fromPlaceholder: 'Tu nombre',
      message: 'Mensaje',
      messagePlaceholder: 'Agrega un mensaje personal (opcional)',
      email: 'Correo del Destinatario',
      emailPlaceholder: 'correo@ejemplo.com',
    },
    delivery: {
      title: 'Metodo de Entrega',
    },
    preview: {
      title: 'Vista Previa',
      giftCard: 'Tarjeta de Regalo',
      to: 'Para',
      from: 'De',
    },
    purchase: {
      button: 'Comprar Tarjeta de Regalo',
      processing: 'Procesando...',
    },
    success: {
      title: 'Compra Exitosa!',
      message: 'Tu tarjeta de regalo ha sido creada y esta lista para compartir.',
      code: 'Codigo de Tarjeta',
      another: 'Comprar Otra',
    },
    checkBalance: {
      title: 'Consultar Saldo',
      subtitle: 'Ingresa el codigo de tu tarjeta para ver el saldo disponible',
      placeholder: 'Ingresa el codigo de tarjeta',
      button: 'Consultar Saldo',
      result: 'Saldo Actual',
      notFound: 'Tarjeta no encontrada. Por favor verifica el codigo e intenta de nuevo.',
    },
    howItWorks: {
      title: 'Como Funciona',
      steps: [
        {
          title: 'Compra',
          description: 'Elige un monto y personaliza tu tarjeta de regalo',
        },
        {
          title: 'Envia o Imprime',
          description: 'Enviala por correo o imprimela en casa',
        },
        {
          title: 'Canjea',
          description: 'El destinatario usa el codigo al pagar',
        },
      ],
    },
    footer: {
      noExpiration: 'Las tarjetas de regalo no tienen fecha de expiracion.',
      rights: 'Todos los derechos reservados.',
    },
  },
  it: {
    hero: {
      title: 'Carte Regalo',
      subtitle: 'Regala momenti deliziosi al Cafe 1973',
      tagline: 'Dal 1973',
    },
    selectAmount: {
      title: 'Seleziona Importo',
    },
    personalization: {
      title: 'Personalizza il Tuo Regalo',
      to: 'A',
      toPlaceholder: 'Nome del destinatario',
      from: 'Da',
      fromPlaceholder: 'Il tuo nome',
      message: 'Messaggio',
      messagePlaceholder: 'Aggiungi un messaggio personale (facoltativo)',
      email: 'Email del Destinatario',
      emailPlaceholder: 'email@esempio.com',
    },
    delivery: {
      title: 'Metodo di Consegna',
    },
    preview: {
      title: 'Anteprima Carta',
      giftCard: 'Carta Regalo',
      to: 'A',
      from: 'Da',
    },
    purchase: {
      button: 'Acquista Carta Regalo',
      processing: 'Elaborazione...',
    },
    success: {
      title: 'Acquisto Riuscito!',
      message: 'La tua carta regalo e stata creata ed e pronta per essere condivisa.',
      code: 'Codice Carta Regalo',
      another: 'Acquista Un\'altra',
    },
    checkBalance: {
      title: 'Verifica Saldo',
      subtitle: 'Inserisci il codice della tua carta regalo per verificare il saldo rimanente',
      placeholder: 'Inserisci il codice della carta regalo',
      button: 'Verifica Saldo',
      result: 'Saldo Attuale',
      notFound: 'Carta regalo non trovata. Verifica il codice e riprova.',
    },
    howItWorks: {
      title: 'Come Funziona',
      steps: [
        {
          title: 'Acquista',
          description: 'Scegli un importo e personalizza la tua carta regalo',
        },
        {
          title: 'Invia o Stampa',
          description: 'Inviala direttamente via email o stampala a casa',
        },
        {
          title: 'Riscatta',
          description: 'Il destinatario usa il codice al momento del pagamento',
        },
      ],
    },
    footer: {
      noExpiration: 'Le carte regalo non scadono mai.',
      rights: 'Tutti i diritti riservati.',
    },
  },
  de: {
    hero: {
      title: 'Geschenkkarten',
      subtitle: 'Schenken Sie kostliche Momente im Cafe 1973',
      tagline: 'Seit 1973',
    },
    selectAmount: {
      title: 'Betrag Wahlen',
    },
    personalization: {
      title: 'Personalisieren Sie Ihr Geschenk',
      to: 'An',
      toPlaceholder: 'Name des Empfangers',
      from: 'Von',
      fromPlaceholder: 'Ihr Name',
      message: 'Nachricht',
      messagePlaceholder: 'Personliche Nachricht hinzufugen (optional)',
      email: 'E-Mail des Empfangers',
      emailPlaceholder: 'email@beispiel.de',
    },
    delivery: {
      title: 'Liefermethode',
    },
    preview: {
      title: 'Kartenvorschau',
      giftCard: 'Geschenkkarte',
      to: 'An',
      from: 'Von',
    },
    purchase: {
      button: 'Geschenkkarte Kaufen',
      processing: 'Verarbeitung...',
    },
    success: {
      title: 'Kauf Erfolgreich!',
      message: 'Ihre Geschenkkarte wurde erstellt und ist bereit zum Teilen.',
      code: 'Geschenkkarten-Code',
      another: 'Weitere Kaufen',
    },
    checkBalance: {
      title: 'Guthaben Prufen',
      subtitle: 'Geben Sie Ihren Geschenkkarten-Code ein, um das verbleibende Guthaben zu prufen',
      placeholder: 'Geschenkkarten-Code eingeben',
      button: 'Guthaben Prufen',
      result: 'Aktuelles Guthaben',
      notFound: 'Geschenkkarte nicht gefunden. Bitte uberprufen Sie den Code und versuchen Sie es erneut.',
    },
    howItWorks: {
      title: 'So Funktioniert Es',
      steps: [
        {
          title: 'Kaufen',
          description: 'Wahlen Sie einen Betrag und personalisieren Sie Ihre Geschenkkarte',
        },
        {
          title: 'Senden oder Drucken',
          description: 'Per E-Mail versenden oder zu Hause ausdrucken',
        },
        {
          title: 'Einlosen',
          description: 'Empfanger verwendet den Code beim Bezahlen',
        },
      ],
    },
    footer: {
      noExpiration: 'Geschenkkarten laufen nie ab.',
      rights: 'Alle Rechte vorbehalten.',
    },
  },
  fr: {
    hero: {
      title: 'Cartes Cadeaux',
      subtitle: 'Offrez des moments delicieux au Cafe 1973',
      tagline: 'Depuis 1973',
    },
    selectAmount: {
      title: 'Selectionnez le Montant',
    },
    personalization: {
      title: 'Personnalisez Votre Cadeau',
      to: 'A',
      toPlaceholder: 'Nom du destinataire',
      from: 'De',
      fromPlaceholder: 'Votre nom',
      message: 'Message',
      messagePlaceholder: 'Ajouter un message personnel (optionnel)',
      email: 'E-mail du Destinataire',
      emailPlaceholder: 'email@exemple.com',
    },
    delivery: {
      title: 'Methode de Livraison',
    },
    preview: {
      title: 'Apercu de la Carte',
      giftCard: 'Carte Cadeau',
      to: 'A',
      from: 'De',
    },
    purchase: {
      button: 'Acheter une Carte Cadeau',
      processing: 'Traitement...',
    },
    success: {
      title: 'Achat Reussi!',
      message: 'Votre carte cadeau a ete creee et est prete a etre partagee.',
      code: 'Code de Carte Cadeau',
      another: 'Acheter une Autre',
    },
    checkBalance: {
      title: 'Verifier le Solde',
      subtitle: 'Entrez votre code de carte cadeau pour verifier le solde restant',
      placeholder: 'Entrez le code de carte cadeau',
      button: 'Verifier le Solde',
      result: 'Solde Actuel',
      notFound: 'Carte cadeau introuvable. Veuillez verifier le code et reessayer.',
    },
    howItWorks: {
      title: 'Comment Ca Marche',
      steps: [
        {
          title: 'Acheter',
          description: 'Choisissez un montant et personnalisez votre carte cadeau',
        },
        {
          title: 'Envoyer ou Imprimer',
          description: 'Envoyez-la directement par e-mail ou imprimez-la a la maison',
        },
        {
          title: 'Utiliser',
          description: 'Le destinataire utilise le code lors du paiement',
        },
      ],
    },
    footer: {
      noExpiration: 'Les cartes cadeaux n\'expirent jamais.',
      rights: 'Tous droits reserves.',
    },
  },
  sv: {
    hero: {
      title: 'Presentkort',
      subtitle: 'Ge bort lackra stunder pa Cafe 1973',
      tagline: 'Sedan 1973',
    },
    selectAmount: {
      title: 'Valj Belopp',
    },
    personalization: {
      title: 'Anpassa Din Present',
      to: 'Till',
      toPlaceholder: 'Mottagarens namn',
      from: 'Fran',
      fromPlaceholder: 'Ditt namn',
      message: 'Meddelande',
      messagePlaceholder: 'Lagg till ett personligt meddelande (valfritt)',
      email: 'Mottagarens E-post',
      emailPlaceholder: 'email@exempel.se',
    },
    delivery: {
      title: 'Leveransmetod',
    },
    preview: {
      title: 'Kortforhandsvisning',
      giftCard: 'Presentkort',
      to: 'Till',
      from: 'Fran',
    },
    purchase: {
      button: 'Kop Presentkort',
      processing: 'Bearbetar...',
    },
    success: {
      title: 'Kop Lyckat!',
      message: 'Ditt presentkort har skapats och ar redo att delas.',
      code: 'Presentkortskod',
      another: 'Kop Ett Till',
    },
    checkBalance: {
      title: 'Kontrollera Saldo',
      subtitle: 'Ange din presentkortskod for att kontrollera aterstaende saldo',
      placeholder: 'Ange presentkortskod',
      button: 'Kontrollera Saldo',
      result: 'Aktuellt Saldo',
      notFound: 'Presentkort hittades inte. Kontrollera koden och forsok igen.',
    },
    howItWorks: {
      title: 'Hur Det Fungerar',
      steps: [
        {
          title: 'Kop',
          description: 'Valj ett belopp och anpassa ditt presentkort',
        },
        {
          title: 'Skicka eller Skriv Ut',
          description: 'E-posta det direkt eller skriv ut det hemma',
        },
        {
          title: 'Losa In',
          description: 'Mottagaren anvander koden vid utcheckning',
        },
      ],
    },
    footer: {
      noExpiration: 'Presentkort gar aldrig ut.',
      rights: 'Alla rattigheter forbehallna.',
    },
  },
};

// Generate random gift card code
const generateGiftCardCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Get stored gift cards
const getStoredGiftCards = (): GiftCard[] => {
  try {
    const stored = localStorage.getItem(GIFT_CARDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save gift card to storage
const saveGiftCard = (card: GiftCard): void => {
  const cards = getStoredGiftCards();
  cards.push(card);
  localStorage.setItem(GIFT_CARDS_STORAGE_KEY, JSON.stringify(cards));
};

// Find gift card by code
const findGiftCardByCode = (code: string): GiftCard | undefined => {
  const cards = getStoredGiftCards();
  return cards.find((card) => card.code.toLowerCase() === code.toLowerCase().replace(/-/g, '').replace(/\s/g, ''));
};

export const GiftCards: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Form state
  const [selectedValue, setSelectedValue] = useState<number>(10000);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'print'>('email');

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState<GiftCard | null>(null);

  // Balance check state
  const [balanceCode, setBalanceCode] = useState('');
  const [balanceResult, setBalanceResult] = useState<number | null>(null);
  const [balanceNotFound, setBalanceNotFound] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle purchase
  const handlePurchase = async () => {
    if (!recipientName || !senderName) return;
    if (deliveryMethod === 'email' && !recipientEmail) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCard: GiftCard = {
      id: Date.now().toString(),
      code: generateGiftCardCode(),
      value: selectedValue,
      balance: selectedValue,
      recipientName,
      senderName,
      message,
      deliveryMethod,
      recipientEmail: deliveryMethod === 'email' ? recipientEmail : undefined,
      purchaseDate: new Date().toISOString(),
      isRedeemed: false,
    };

    saveGiftCard(newCard);
    setPurchasedCard(newCard);
    setPurchaseSuccess(true);
    setIsProcessing(false);
  };

  // Handle balance check
  const handleCheckBalance = () => {
    setBalanceResult(null);
    setBalanceNotFound(false);

    const card = findGiftCardByCode(balanceCode);
    if (card) {
      setBalanceResult(card.balance);
    } else {
      setBalanceNotFound(true);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedValue(10000);
    setRecipientName('');
    setSenderName('');
    setMessage('');
    setRecipientEmail('');
    setDeliveryMethod('email');
    setPurchaseSuccess(false);
    setPurchasedCard(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative bg-forest text-white px-6 py-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-sand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sand/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-sand/5 rounded-full" />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full mb-6">
            <Gift className="w-10 h-10 text-sand" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <p className="text-white/80 text-lg">
            {t.hero.subtitle}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-white/60">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm">{t.hero.tagline}</span>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
      </section>

      {/* Purchase Success State */}
      {purchaseSuccess && purchasedCard && (
        <section className="px-6 py-12">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest mb-3">
                {t.success.title}
              </h2>
              <p className="text-forest/70 mb-6">
                {t.success.message}
              </p>

              {/* Gift Card Code Display */}
              <div className="bg-[#faf8f3] rounded-xl p-4 mb-6">
                <p className="text-sm text-forest/60 mb-2">
                  {t.success.code}
                </p>
                <p className="text-2xl font-mono font-bold text-forest tracking-wider">
                  {purchasedCard.code}
                </p>
              </div>

              {/* Gift Card Preview */}
              <div className="bg-gradient-to-br from-forest to-forest/80 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-sand/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Gift className="w-8 h-8 text-sand" />
                    <span className="text-2xl font-bold">{formatCurrency(purchasedCard.value)}</span>
                  </div>
                  <p className="text-left text-sm text-white/70 mb-1">
                    {t.preview.to}: {purchasedCard.recipientName}
                  </p>
                  <p className="text-left text-sm text-white/70">
                    {t.preview.from}: {purchasedCard.senderName}
                  </p>
                  {purchasedCard.message && (
                    <p className="text-left text-sm text-white/90 mt-3 italic">"{purchasedCard.message}"</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs text-white/50">Cafe 1973 - {t.hero.tagline}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
              >
                {t.success.another}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Purchase Form */}
      {!purchaseSuccess && (
        <>
          {/* Select Amount Section */}
          <section className="px-6 py-12">
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-forest mb-6 text-center">
                {t.selectAmount.title}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {GIFT_CARD_VALUES.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedValue(option.value)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedValue === option.value
                        ? 'border-forest bg-forest text-white shadow-lg'
                        : 'border-sand/50 bg-white text-forest hover:border-forest/30'
                    }`}
                  >
                    <CreditCard
                      className={`w-8 h-8 mx-auto mb-3 ${
                        selectedValue === option.value ? 'text-sand' : 'text-forest/50'
                      }`}
                    />
                    <span className="text-xl font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Personalization Section */}
          <section className="px-6 py-12 bg-white">
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-forest mb-6 text-center">
                {t.personalization.title}
              </h2>

              <div className="space-y-5">
                {/* To Field */}
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-forest mb-2">
                    {t.personalization.to} *
                  </label>
                  <input
                    type="text"
                    id="recipientName"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={t.personalization.toPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  />
                </div>

                {/* From Field */}
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-forest mb-2">
                    {t.personalization.from} *
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={t.personalization.fromPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">
                    {t.personalization.message}
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.personalization.messagePlaceholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Method Section */}
          <section className="px-6 py-12">
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-forest mb-6 text-center">
                {t.delivery.title}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setDeliveryMethod('email')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    deliveryMethod === 'email'
                      ? 'border-forest bg-forest/5'
                      : 'border-sand/50 bg-white hover:border-forest/30'
                  }`}
                >
                  <Send
                    className={`w-6 h-6 ${
                      deliveryMethod === 'email' ? 'text-forest' : 'text-forest/50'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      deliveryMethod === 'email' ? 'text-forest' : 'text-forest/70'
                    }`}
                  >
                    {DELIVERY_METHODS.email[language as keyof typeof DELIVERY_METHODS.email] || DELIVERY_METHODS.email.en}
                  </span>
                  {deliveryMethod === 'email' && (
                    <Check className="w-5 h-5 text-forest" />
                  )}
                </button>

                <button
                  onClick={() => setDeliveryMethod('print')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    deliveryMethod === 'print'
                      ? 'border-forest bg-forest/5'
                      : 'border-sand/50 bg-white hover:border-forest/30'
                  }`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${
                      deliveryMethod === 'print' ? 'text-forest' : 'text-forest/50'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      deliveryMethod === 'print' ? 'text-forest' : 'text-forest/70'
                    }`}
                  >
                    {DELIVERY_METHODS.print[language as keyof typeof DELIVERY_METHODS.print] || DELIVERY_METHODS.print.en}
                  </span>
                  {deliveryMethod === 'print' && (
                    <Check className="w-5 h-5 text-forest" />
                  )}
                </button>
              </div>

              {/* Email Input (shown when email delivery selected) */}
              {deliveryMethod === 'email' && (
                <div className="bg-white rounded-2xl p-5">
                  <label htmlFor="recipientEmail" className="block text-sm font-medium text-forest mb-2">
                    {t.personalization.email} *
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder={t.personalization.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Card Preview Section */}
          <section className="px-6 py-12 bg-white">
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-forest mb-6 text-center">
                {t.preview.title}
              </h2>

              {/* Gift Card Design Preview */}
              <div className="bg-gradient-to-br from-forest to-forest/80 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sand/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/2 right-4 w-12 h-12 bg-sand/5 rounded-full" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Gift className="w-8 h-8 text-sand" />
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">Cafe 1973</p>
                        <p className="text-sm font-medium text-sand">
                          {t.preview.giftCard}
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">{formatCurrency(selectedValue)}</span>
                  </div>

                  {/* Personalization */}
                  <div className="space-y-2 mb-6">
                    <p className="text-sm">
                      <span className="text-white/60">{t.preview.to}:</span>{' '}
                      <span className="font-medium">{recipientName || '___________'}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-white/60">{t.preview.from}:</span>{' '}
                      <span className="font-medium">{senderName || '___________'}</span>
                    </p>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className="bg-white/10 rounded-xl p-4 mb-6">
                      <p className="text-sm italic">"{message}"</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-sand fill-current" />
                      <span className="text-xs text-white/60">
                        {t.hero.tagline}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 font-mono">XXXX-XXXX-XXXX-XXXX</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Purchase Button Section */}
          <section className="px-6 py-8">
            <div className="max-w-lg mx-auto">
              <button
                onClick={handlePurchase}
                disabled={isProcessing || !recipientName || !senderName || (deliveryMethod === 'email' && !recipientEmail)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.purchase.processing}
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    {t.purchase.button} - {formatCurrency(selectedValue)}
                  </>
                )}
              </button>
            </div>
          </section>
        </>
      )}

      {/* Check Balance Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-full mb-4">
              <CreditCard className="w-7 h-7 text-forest" />
            </div>
            <h2 className="text-2xl font-bold text-forest mb-2">
              {t.checkBalance.title}
            </h2>
            <p className="text-forest/60">
              {t.checkBalance.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={balanceCode}
              onChange={(e) => {
                setBalanceCode(e.target.value);
                setBalanceResult(null);
                setBalanceNotFound(false);
              }}
              placeholder={t.checkBalance.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all text-center font-mono uppercase tracking-wider"
            />

            <button
              onClick={handleCheckBalance}
              disabled={!balanceCode.trim()}
              className="w-full py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.checkBalance.button}
            </button>

            {/* Balance Result */}
            {balanceResult !== null && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-sm text-green-600 mb-1">
                  {t.checkBalance.result}
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(balanceResult)}
                </p>
              </div>
            )}

            {/* Not Found Message */}
            {balanceNotFound && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-sm text-red-600">
                  {t.checkBalance.notFound}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-forest text-center mb-8">
            {t.howItWorks.title}
          </h2>

          <div className="space-y-4">
            {t.howItWorks.steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-forest mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-forest/60">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-forest/60">
            {t.footer.noExpiration}
          </p>
          <p className="text-sm text-forest/40 mt-2">
            &copy; {new Date().getFullYear()} Cafe 1973. {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default GiftCards;
