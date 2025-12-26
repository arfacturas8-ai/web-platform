/**
 * Cafe 1973 | Bakery - Admin Gift Card Management
 * Full CRUD management for gift cards with stats, search/filter, and transaction history
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Gift,
  CreditCard,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  DollarSign,
  X,
  RefreshCw,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Storage key for admin gift cards
const STORAGE_KEY = 'cafe1973_admin_gift_cards';

// Types
type GiftCardStatus = 'active' | 'partially_used' | 'redeemed' | 'expired';

interface GiftCardTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'purchase' | 'redemption' | 'refund';
  orderId?: string;
  notes?: string;
}

interface AdminGiftCard {
  id: string;
  code: string;
  originalValue: number;
  currentBalance: number;
  status: GiftCardStatus;
  purchasedDate: string;
  expiryDate: string;
  purchaserName?: string;
  purchaserEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  notes?: string;
  transactions: GiftCardTransaction[];
  createdAt: string;
  updatedAt: string;
}

interface GiftCardStats {
  totalIssued: number;
  totalValueOutstanding: number;
  redeemedThisMonth: number;
  revenueThisMonth: number;
}

// Content translations
const content = {
  title: { en: 'Gift Card Management', es: 'Gestion de Tarjetas de Regalo' },
  subtitle: { en: 'Manage all gift cards, balances, and transactions', es: 'Gestiona todas las tarjetas de regalo, saldos y transacciones' },
  createButton: { en: 'Create Gift Card', es: 'Crear Tarjeta' },
  stats: {
    totalIssued: { en: 'Total Gift Cards Issued', es: 'Tarjetas Emitidas' },
    totalOutstanding: { en: 'Total Value Outstanding', es: 'Valor Pendiente' },
    redeemedMonth: { en: 'Cards Redeemed This Month', es: 'Canjeadas Este Mes' },
    revenueMonth: { en: 'Revenue This Month', es: 'Ingresos Este Mes' },
  },
  search: {
    placeholder: { en: 'Search by code...', es: 'Buscar por codigo...' },
  },
  filter: {
    all: { en: 'All', es: 'Todas' },
    active: { en: 'Active', es: 'Activas' },
    partiallyUsed: { en: 'Partially Used', es: 'Parcialmente Usadas' },
    redeemed: { en: 'Redeemed', es: 'Canjeadas' },
    expired: { en: 'Expired', es: 'Expiradas' },
  },
  table: {
    code: { en: 'Code', es: 'Codigo' },
    originalValue: { en: 'Original Value', es: 'Valor Original' },
    currentBalance: { en: 'Current Balance', es: 'Saldo Actual' },
    status: { en: 'Status', es: 'Estado' },
    purchasedDate: { en: 'Purchased Date', es: 'Fecha de Compra' },
    expiryDate: { en: 'Expiry Date', es: 'Fecha de Expiracion' },
    actions: { en: 'Actions', es: 'Acciones' },
  },
  status: {
    active: { en: 'Active', es: 'Activa' },
    partially_used: { en: 'Partially Used', es: 'Parcialmente Usada' },
    redeemed: { en: 'Redeemed', es: 'Canjeada' },
    expired: { en: 'Expired', es: 'Expirada' },
  },
  modal: {
    create: { en: 'Create Gift Card', es: 'Crear Tarjeta de Regalo' },
    edit: { en: 'Edit Gift Card', es: 'Editar Tarjeta de Regalo' },
    view: { en: 'Gift Card Details', es: 'Detalles de Tarjeta' },
    value: { en: 'Value Amount', es: 'Monto' },
    expiryDate: { en: 'Expiry Date', es: 'Fecha de Expiracion' },
    notes: { en: 'Notes', es: 'Notas' },
    generateCode: { en: 'Generate Code', es: 'Generar Codigo' },
    save: { en: 'Save', es: 'Guardar' },
    cancel: { en: 'Cancel', es: 'Cancelar' },
    deactivate: { en: 'Deactivate', es: 'Desactivar' },
    transactionHistory: { en: 'Transaction History', es: 'Historial de Transacciones' },
    fullDetails: { en: 'Full Details', es: 'Detalles Completos' },
    purchaserInfo: { en: 'Purchaser Information', es: 'Informacion del Comprador' },
    recipientInfo: { en: 'Recipient Information', es: 'Informacion del Destinatario' },
  },
  transactions: {
    purchase: { en: 'Purchase', es: 'Compra' },
    redemption: { en: 'Redemption', es: 'Canje' },
    refund: { en: 'Refund', es: 'Reembolso' },
    noTransactions: { en: 'No transactions yet', es: 'Sin transacciones aun' },
  },
  empty: {
    title: { en: 'No Gift Cards Found', es: 'No se encontraron tarjetas' },
    description: { en: 'Create your first gift card to get started', es: 'Crea tu primera tarjeta para comenzar' },
  },
  confirmDeactivate: {
    title: { en: 'Deactivate Gift Card?', es: 'Desactivar Tarjeta?' },
    message: { en: 'This will prevent the card from being used. This action cannot be undone.', es: 'Esto evitara que la tarjeta sea utilizada. Esta accion no se puede deshacer.' },
    confirm: { en: 'Yes, Deactivate', es: 'Si, Desactivar' },
  },
};

// Helper: Generate random gift card code
const generateGiftCardCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Helper: Mask code for display
const maskCode = (code: string): string => {
  const parts = code.split('-');
  if (parts.length === 4) {
    return `XXXX-XXXX-XXXX-${parts[3]}`;
  }
  return code.length > 4 ? `${'X'.repeat(code.length - 4)}${code.slice(-4)}` : code;
};

// Helper: Format currency
const formatCurrency = (amount: number): string => {
  return `₡${amount.toLocaleString('es-CR')}`;
};

// Helper: Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper: Get stored gift cards
const getStoredGiftCards = (): AdminGiftCard[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper: Save gift cards to storage
const saveGiftCards = (cards: AdminGiftCard[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

// Helper: Calculate stats
const calculateStats = (cards: AdminGiftCard[]): GiftCardStats => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const redeemedThisMonth = cards.filter(card => {
    const hasRedemptionThisMonth = card.transactions.some(t =>
      t.type === 'redemption' && new Date(t.date) >= startOfMonth
    );
    return hasRedemptionThisMonth;
  }).length;

  const revenueThisMonth = cards.reduce((sum, card) => {
    const monthlyRedemptions = card.transactions
      .filter(t => t.type === 'redemption' && new Date(t.date) >= startOfMonth)
      .reduce((tSum, t) => tSum + t.amount, 0);
    return sum + monthlyRedemptions;
  }, 0);

  return {
    totalIssued: cards.length,
    totalValueOutstanding: cards.reduce((sum, card) => sum + card.currentBalance, 0),
    redeemedThisMonth,
    revenueThisMonth,
  };
};

// Helper: Determine gift card status
const determineStatus = (card: AdminGiftCard): GiftCardStatus => {
  const now = new Date();
  const expiryDate = new Date(card.expiryDate);

  if (expiryDate < now) return 'expired';
  if (card.currentBalance === 0) return 'redeemed';
  if (card.currentBalance < card.originalValue) return 'partially_used';
  return 'active';
};

// Status badge component
const StatusBadge: React.FC<{ status: GiftCardStatus; language: 'en' | 'es' }> = ({ status, language }) => {
  const styles: Record<GiftCardStatus, { bg: string; text: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-700' },
    partially_used: { bg: 'bg-amber-100', text: 'text-amber-700' },
    redeemed: { bg: 'bg-blue-100', text: 'text-blue-700' },
    expired: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const style = styles[status];
  const label = content.status[status][language];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'forest' | 'espresso' | 'purple' | 'amber';
}> = ({ title, value, icon, color }) => {
  const bgColors = {
    forest: 'bg-forest',
    espresso: 'bg-espresso',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColors[color]} rounded-xl flex items-center justify-center`}>
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold text-forest">{value}</p>
          <p className="text-sm text-forest/60">{title}</p>
        </div>
      </div>
    </div>
  );
};

export const GiftCardManagement: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'es';

  // State
  const [giftCards, setGiftCards] = useState<AdminGiftCard[]>([]);
  const [stats, setStats] = useState<GiftCardStats>({
    totalIssued: 0,
    totalValueOutstanding: 0,
    redeemedThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GiftCardStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<AdminGiftCard | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    code: '',
    value: 10000,
    expiryDate: '',
    notes: '',
  });

  // Helper for bilingual text
  const getText = (textObj: { en: string; es: string }) => textObj[lang];

  // Load gift cards from localStorage
  const loadGiftCards = useCallback(() => {
    setIsLoading(true);
    const cards = getStoredGiftCards();
    // Update statuses
    const updatedCards = cards.map(card => ({
      ...card,
      status: determineStatus(card),
    }));
    setGiftCards(updatedCards);
    setStats(calculateStats(updatedCards));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadGiftCards();
  }, [loadGiftCards]);

  // Filter gift cards
  const filteredCards = giftCards.filter(card => {
    const matchesSearch = searchQuery === '' ||
      card.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle create gift card
  const handleCreate = () => {
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);

    setFormData({
      code: generateGiftCardCode(),
      value: 10000,
      expiryDate: defaultExpiry.toISOString().split('T')[0],
      notes: '',
    });
    setShowCreateModal(true);
  };

  // Handle edit gift card
  const handleEdit = (card: AdminGiftCard) => {
    setSelectedCard(card);
    setFormData({
      code: card.code,
      value: card.originalValue,
      expiryDate: card.expiryDate.split('T')[0],
      notes: card.notes || '',
    });
    setShowEditModal(true);
  };

  // Handle view gift card
  const handleView = (card: AdminGiftCard) => {
    setSelectedCard(card);
    setShowViewModal(true);
  };

  // Handle deactivate (expire) gift card
  const handleDeactivate = (card: AdminGiftCard) => {
    if (window.confirm(getText(content.confirmDeactivate.message))) {
      const updatedCards = giftCards.map(c => {
        if (c.id === card.id) {
          return {
            ...c,
            expiryDate: new Date().toISOString(),
            status: 'expired' as GiftCardStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveGiftCards(updatedCards);
      loadGiftCards();
    }
  };

  // Handle save create
  const handleSaveCreate = () => {
    const now = new Date().toISOString();
    const newCard: AdminGiftCard = {
      id: `gc_${Date.now()}`,
      code: formData.code,
      originalValue: formData.value,
      currentBalance: formData.value,
      status: 'active',
      purchasedDate: now,
      expiryDate: formData.expiryDate,
      notes: formData.notes,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          date: now,
          amount: formData.value,
          type: 'purchase',
          notes: 'Initial purchase',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const updatedCards = [...giftCards, newCard];
    saveGiftCards(updatedCards);
    loadGiftCards();
    setShowCreateModal(false);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!selectedCard) return;

    const updatedCards = giftCards.map(card => {
      if (card.id === selectedCard.id) {
        return {
          ...card,
          expiryDate: formData.expiryDate,
          notes: formData.notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return card;
    });

    saveGiftCards(updatedCards);
    loadGiftCards();
    setShowEditModal(false);
    setSelectedCard(null);
  };

  // Generate new code
  const handleGenerateCode = () => {
    setFormData({ ...formData, code: generateGiftCardCode() });
  };

  // Status filter tabs
  const filterTabs: { value: 'all' | GiftCardStatus; label: { en: string; es: string } }[] = [
    { value: 'all', label: content.filter.all },
    { value: 'active', label: content.filter.active },
    { value: 'partially_used', label: content.filter.partiallyUsed },
    { value: 'redeemed', label: content.filter.redeemed },
    { value: 'expired', label: content.filter.expired },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {getText(content.title)}
          </h1>
          <p className="text-forest/60">
            {getText(content.subtitle)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadGiftCards}
            className="p-2 bg-sand/30 text-forest rounded-xl hover:bg-sand/50 transition-colors"
            title={lang === 'es' ? 'Actualizar' : 'Refresh'}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
          >
            <Plus size={18} />
            <span>{getText(content.createButton)}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={getText(content.stats.totalIssued)}
          value={stats.totalIssued}
          icon={<Gift size={24} />}
          color="forest"
        />
        <StatsCard
          title={getText(content.stats.totalOutstanding)}
          value={formatCurrency(stats.totalValueOutstanding)}
          icon={<DollarSign size={24} />}
          color="espresso"
        />
        <StatsCard
          title={getText(content.stats.redeemedMonth)}
          value={stats.redeemedThisMonth}
          icon={<CreditCard size={24} />}
          color="purple"
        />
        <StatsCard
          title={getText(content.stats.revenueMonth)}
          value={formatCurrency(stats.revenueThisMonth)}
          icon={<TrendingUp size={24} />}
          color="amber"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="text"
              placeholder={getText(content.search.placeholder)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f3] rounded-xl text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-forest text-white'
                  : 'bg-[#faf8f3] text-forest/70 hover:bg-sand/30'
              }`}
            >
              {getText(tab.label)}
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-md text-xs">
                {tab.value === 'all'
                  ? giftCards.length
                  : giftCards.filter(c => c.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-sand border-t-forest rounded-full animate-spin mx-auto mb-4" />
            <p className="text-forest/60">
              {lang === 'es' ? 'Cargando tarjetas...' : 'Loading gift cards...'}
            </p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="p-12 text-center">
            <Gift size={48} className="text-sand mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-forest mb-2">
              {getText(content.empty.title)}
            </h3>
            <p className="text-forest/60 mb-4">
              {getText(content.empty.description)}
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
            >
              <Plus size={18} />
              <span>{getText(content.createButton)}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#faf8f3] border-b border-sand/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.code)}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.originalValue)}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.currentBalance)}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.status)}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.purchasedDate)}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.expiryDate)}
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-forest">
                    {getText(content.table.actions)}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-[#faf8f3] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-forest font-medium">
                        {maskCode(card.code)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-forest">{formatCurrency(card.originalValue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        card.currentBalance === 0 ? 'text-forest/50' : 'text-espresso'
                      }`}>
                        {formatCurrency(card.currentBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={card.status} language={lang} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-forest/70">{formatDate(card.purchasedDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-forest/70">{formatDate(card.expiryDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(card)}
                          className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
                          title={lang === 'es' ? 'Ver' : 'View'}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(card)}
                          className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
                          title={lang === 'es' ? 'Editar' : 'Edit'}
                        >
                          <Edit2 size={18} />
                        </button>
                        {card.status !== 'expired' && (
                          <button
                            onClick={() => handleDeactivate(card)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={lang === 'es' ? 'Desactivar' : 'Deactivate'}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Gift Card Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-sand/30">
              <h2 className="text-xl font-bold text-forest">
                {showCreateModal ? getText(content.modal.create) : getText(content.modal.edit)}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedCard(null);
                }}
                className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Code Field (only for create) */}
              {showCreateModal && (
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    {getText(content.table.code)}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest font-mono focus:outline-none"
                    />
                    <button
                      onClick={handleGenerateCode}
                      className="px-4 py-3 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors text-sm font-medium"
                    >
                      {getText(content.modal.generateCode)}
                    </button>
                  </div>
                </div>
              )}

              {/* Value Field (only for create) */}
              {showCreateModal && (
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    {getText(content.modal.value)}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/60">₡</span>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                      min={1000}
                      step={1000}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[5000, 10000, 25000, 50000].map((val) => (
                      <button
                        key={val}
                        onClick={() => setFormData({ ...formData, value: val })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.value === val
                            ? 'bg-forest text-white'
                            : 'bg-sand/30 text-forest hover:bg-sand/50'
                        }`}
                      >
                        {formatCurrency(val)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expiry Date Field */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.modal.expiryDate)}
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.modal.notes)}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                  placeholder={lang === 'es' ? 'Notas adicionales...' : 'Additional notes...'}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-sand/30">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedCard(null);
                }}
                className="px-4 py-2 text-forest/70 hover:text-forest transition-colors"
              >
                {getText(content.modal.cancel)}
              </button>
              <button
                onClick={showCreateModal ? handleSaveCreate : handleSaveEdit}
                className="px-6 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors font-medium"
              >
                {getText(content.modal.save)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Gift Card Modal */}
      {showViewModal && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-sand/30">
              <h2 className="text-xl font-bold text-forest">
                {getText(content.modal.view)}
              </h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCard(null);
                }}
                className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Gift Card Preview */}
              <div className="bg-gradient-to-br from-forest to-forest/80 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-sand/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Gift className="w-8 h-8 text-sand" />
                    <StatusBadge status={selectedCard.status} language={lang} />
                  </div>
                  <p className="text-2xl font-bold mb-2">{formatCurrency(selectedCard.currentBalance)}</p>
                  <p className="text-sm text-white/70">
                    {lang === 'es' ? 'de' : 'of'} {formatCurrency(selectedCard.originalValue)}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="font-mono text-lg tracking-wider">{selectedCard.code}</p>
                  </div>
                </div>
              </div>

              {/* Full Details */}
              <div>
                <h3 className="text-sm font-semibold text-forest mb-3">
                  {getText(content.modal.fullDetails)}
                </h3>
                <div className="bg-[#faf8f3] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-forest/60">{getText(content.table.purchasedDate)}</span>
                    <span className="text-forest font-medium">{formatDate(selectedCard.purchasedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">{getText(content.table.expiryDate)}</span>
                    <span className="text-forest font-medium">{formatDate(selectedCard.expiryDate)}</span>
                  </div>
                  {selectedCard.notes && (
                    <div className="pt-2 border-t border-sand/30">
                      <span className="text-forest/60 text-sm">{getText(content.modal.notes)}</span>
                      <p className="text-forest mt-1">{selectedCard.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-sm font-semibold text-forest mb-3">
                  {getText(content.modal.transactionHistory)}
                </h3>
                {selectedCard.transactions.length === 0 ? (
                  <div className="bg-[#faf8f3] rounded-xl p-4 text-center">
                    <Clock size={24} className="text-sand mx-auto mb-2" />
                    <p className="text-forest/60 text-sm">
                      {getText(content.transactions.noTransactions)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCard.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-[#faf8f3] rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'purchase' ? 'bg-green-100' :
                            tx.type === 'redemption' ? 'bg-blue-100' : 'bg-amber-100'
                          }`}>
                            {tx.type === 'purchase' ? (
                              <Plus size={18} className="text-green-600" />
                            ) : tx.type === 'redemption' ? (
                              <CreditCard size={18} className="text-blue-600" />
                            ) : (
                              <RefreshCw size={18} className="text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-forest">
                              {getText(content.transactions[tx.type])}
                            </p>
                            <p className="text-xs text-forest/60">
                              {formatDate(tx.date)}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium ${
                          tx.type === 'purchase' || tx.type === 'refund'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {tx.type === 'purchase' || tx.type === 'refund' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-sand/30">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedCard);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-forest hover:bg-sand/30 rounded-xl transition-colors"
              >
                <Edit2 size={18} />
                <span>{lang === 'es' ? 'Editar' : 'Edit'}</span>
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCard(null);
                }}
                className="px-6 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors font-medium"
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardManagement;
