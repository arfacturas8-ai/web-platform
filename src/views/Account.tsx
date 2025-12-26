/**
 * Cafe 1973 | Bakery - My Account Page
 * Mobile-first customer account management
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Edit2,
  Bell,
  Lock,
  Calendar,
  Star,
  Coffee
} from 'lucide-react';

// Types
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isDefault: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'cafe1973_user_profile',
  ORDERS: 'cafe1973_order_history',
  ADDRESSES: 'cafe1973_addresses',
};

// Default demo data
const defaultProfile: UserProfile = {
  name: 'Maria Garcia',
  email: 'maria.garcia@email.com',
  phone: '+506 8888-1234',
  memberSince: '2023-06-15',
};

const defaultOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    items: ['Cafe Latte', 'Croissant', 'Tres Leches'],
    total: 8500,
    status: 'completed',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    items: ['Cappuccino', 'Pan de Chocolate'],
    total: 4200,
    status: 'completed',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-25',
    items: ['Americano', 'Empanada de Carne', 'Flan'],
    total: 6800,
    status: 'preparing',
  },
];

const defaultAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    street: 'Avenida Central 123',
    city: 'San Jose',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Work',
    street: 'Calle 5, Edificio Torre',
    city: 'Escazu',
    isDefault: false,
  },
];

// Translations
const translations = {
  en: {
    myAccount: 'My Account',
    memberSince: 'Member since',
    totalOrders: 'Total Orders',
    loyaltyPoints: 'Loyalty Points',
    memberStatus: 'Member Since',
    recentOrders: 'Recent Orders',
    viewAll: 'View All',
    orderNumber: 'Order',
    items: 'items',
    savedAddresses: 'Saved Addresses',
    addAddress: 'Add Address',
    defaultLabel: 'Default',
    favorites: 'Favorites',
    noFavorites: 'No favorites yet',
    browsMenu: 'Browse our menu to add your favorite items',
    exploreMenu: 'Explore Menu',
    accountSettings: 'Account Settings',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    notifications: 'Notification Preferences',
    logout: 'Log Out',
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pts: 'pts',
    home: 'Home',
    work: 'Work',
  },
  es: {
    myAccount: 'Mi Cuenta',
    memberSince: 'Miembro desde',
    totalOrders: 'Pedidos Totales',
    loyaltyPoints: 'Puntos de Lealtad',
    memberStatus: 'Miembro Desde',
    recentOrders: 'Pedidos Recientes',
    viewAll: 'Ver Todos',
    orderNumber: 'Pedido',
    items: 'articulos',
    savedAddresses: 'Direcciones Guardadas',
    addAddress: 'Agregar Direccion',
    defaultLabel: 'Principal',
    favorites: 'Favoritos',
    noFavorites: 'Sin favoritos aun',
    browsMenu: 'Explora nuestro menu para agregar tus favoritos',
    exploreMenu: 'Explorar Menu',
    accountSettings: 'Configuracion de Cuenta',
    editProfile: 'Editar Perfil',
    changePassword: 'Cambiar Contrasena',
    notifications: 'Preferencias de Notificacion',
    logout: 'Cerrar Sesion',
    pending: 'Pendiente',
    preparing: 'Preparando',
    ready: 'Listo',
    completed: 'Completado',
    cancelled: 'Cancelado',
    pts: 'pts',
    home: 'Casa',
    work: 'Trabajo',
  },
  it: {
    myAccount: 'Il Mio Account',
    memberSince: 'Membro dal',
    totalOrders: 'Ordini Totali',
    loyaltyPoints: 'Punti Fedeltà',
    memberStatus: 'Membro Dal',
    recentOrders: 'Ordini Recenti',
    viewAll: 'Vedi Tutti',
    orderNumber: 'Ordine',
    items: 'articoli',
    savedAddresses: 'Indirizzi Salvati',
    addAddress: 'Aggiungi Indirizzo',
    defaultLabel: 'Predefinito',
    favorites: 'Preferiti',
    noFavorites: 'Nessun preferito ancora',
    browsMenu: 'Esplora il nostro menu per aggiungere i tuoi preferiti',
    exploreMenu: 'Esplora Menu',
    accountSettings: 'Impostazioni Account',
    editProfile: 'Modifica Profilo',
    changePassword: 'Cambia Password',
    notifications: 'Preferenze Notifiche',
    logout: 'Esci',
    pending: 'In Attesa',
    preparing: 'In Preparazione',
    ready: 'Pronto',
    completed: 'Completato',
    cancelled: 'Cancellato',
    pts: 'pts',
    home: 'Casa',
    work: 'Lavoro',
  },
  de: {
    myAccount: 'Mein Konto',
    memberSince: 'Mitglied seit',
    totalOrders: 'Gesamtbestellungen',
    loyaltyPoints: 'Treuepunkte',
    memberStatus: 'Mitglied Seit',
    recentOrders: 'Letzte Bestellungen',
    viewAll: 'Alle Anzeigen',
    orderNumber: 'Bestellung',
    items: 'Artikel',
    savedAddresses: 'Gespeicherte Adressen',
    addAddress: 'Adresse Hinzufügen',
    defaultLabel: 'Standard',
    favorites: 'Favoriten',
    noFavorites: 'Noch keine Favoriten',
    browsMenu: 'Durchsuchen Sie unser Menü, um Ihre Favoriten hinzuzufügen',
    exploreMenu: 'Menü Erkunden',
    accountSettings: 'Kontoeinstellungen',
    editProfile: 'Profil Bearbeiten',
    changePassword: 'Passwort Ändern',
    notifications: 'Benachrichtigungseinstellungen',
    logout: 'Abmelden',
    pending: 'Ausstehend',
    preparing: 'In Zubereitung',
    ready: 'Fertig',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    pts: 'Pkt',
    home: 'Zuhause',
    work: 'Arbeit',
  },
  fr: {
    myAccount: 'Mon Compte',
    memberSince: 'Membre depuis',
    totalOrders: 'Commandes Totales',
    loyaltyPoints: 'Points de Fidélité',
    memberStatus: 'Membre Depuis',
    recentOrders: 'Commandes Récentes',
    viewAll: 'Voir Tout',
    orderNumber: 'Commande',
    items: 'articles',
    savedAddresses: 'Adresses Enregistrées',
    addAddress: 'Ajouter Adresse',
    defaultLabel: 'Par Défaut',
    favorites: 'Favoris',
    noFavorites: 'Pas encore de favoris',
    browsMenu: 'Parcourez notre menu pour ajouter vos favoris',
    exploreMenu: 'Explorer le Menu',
    accountSettings: 'Paramètres du Compte',
    editProfile: 'Modifier le Profil',
    changePassword: 'Changer le Mot de Passe',
    notifications: 'Préférences de Notification',
    logout: 'Déconnexion',
    pending: 'En Attente',
    preparing: 'En Préparation',
    ready: 'Prêt',
    completed: 'Terminé',
    cancelled: 'Annulé',
    pts: 'pts',
    home: 'Domicile',
    work: 'Travail',
  },
  sv: {
    myAccount: 'Mitt Konto',
    memberSince: 'Medlem sedan',
    totalOrders: 'Totala Beställningar',
    loyaltyPoints: 'Lojalitetspoäng',
    memberStatus: 'Medlem Sedan',
    recentOrders: 'Senaste Beställningar',
    viewAll: 'Visa Alla',
    orderNumber: 'Beställning',
    items: 'artiklar',
    savedAddresses: 'Sparade Adresser',
    addAddress: 'Lägg Till Adress',
    defaultLabel: 'Standard',
    favorites: 'Favoriter',
    noFavorites: 'Inga favoriter ännu',
    browsMenu: 'Bläddra i vår meny för att lägga till dina favoriter',
    exploreMenu: 'Utforska Menyn',
    accountSettings: 'Kontoinställningar',
    editProfile: 'Redigera Profil',
    changePassword: 'Ändra Lösenord',
    notifications: 'Aviseringsinställningar',
    logout: 'Logga Ut',
    pending: 'Väntande',
    preparing: 'Förbereder',
    ready: 'Klar',
    completed: 'Slutförd',
    cancelled: 'Avbokad',
    pts: 'pts',
    home: 'Hem',
    work: 'Arbete',
  },
};

export const Account: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const storedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(defaultOrders));
    }

    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    } else {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(defaultAddresses));
    }
  }, []);

  // Format price for Costa Rica
  const formatPrice = (price: number) => `₡${price.toLocaleString('es-CR')}`;

  // Format date
  const localeMap: Record<string, string> = {
    en: 'en-US', es: 'es-CR', it: 'it-IT', de: 'de-DE', fr: 'fr-FR', sv: 'sv-SE'
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(localeMap[language] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  // Get status text
  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: t.pending,
      preparing: t.preparing,
      ready: t.ready,
      completed: t.completed,
      cancelled: t.cancelled,
    };
    return statusMap[status];
  };

  // Calculate loyalty points (demo: 10 points per 1000 colones spent)
  const loyaltyPoints = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, order) => acc + Math.floor(order.total / 100), 0);

  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect
    logger.debug('Logging out...');
    // For demo, we'll just clear the profile
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-b border-sand-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-forest">{t.myAccount}</h1>
              <p className="text-xs text-forest/60">Cafe 1973 | Bakery</p>
            </div>
            <LanguageSelector variant="minimal" />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <section className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="w-16 h-16 bg-sand/30 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-forest/60" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-forest truncate">{profile.name}</h2>
              <p className="text-sm text-forest/60 truncate">{profile.email}</p>
              <p className="text-xs text-forest/40 mt-1">
                {t.memberSince} {formatDate(profile.memberSince)}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <Package size={24} className="mx-auto text-forest/60 mb-2" />
            <p className="text-2xl font-bold text-forest">{orders.length}</p>
            <p className="text-xs text-forest/60">{t.totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <Star size={24} className="mx-auto text-espresso mb-2" />
            <p className="text-2xl font-bold text-espresso">{loyaltyPoints}</p>
            <p className="text-xs text-forest/60">{t.loyaltyPoints}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <Calendar size={24} className="mx-auto text-forest/60 mb-2" />
            <p className="text-lg font-bold text-forest">
              {new Date(profile.memberSince).getFullYear()}
            </p>
            <p className="text-xs text-forest/60">{t.memberStatus}</p>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-sand/30 flex items-center justify-between">
            <h3 className="font-semibold text-forest flex items-center gap-2">
              <Package size={18} className="text-forest/60" />
              {t.recentOrders}
            </h3>
            <Link
              to="/orders"
              className="text-sm text-espresso font-medium flex items-center gap-1 hover:underline"
            >
              {t.viewAll}
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-sand/20">
            {orders.slice(0, 3).map((order, index) => (
              <div
                key={order.id}
                className="px-4 py-3 hover:bg-sand/10 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-forest text-sm">
                    {t.orderNumber} #{order.orderNumber}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-xs text-forest/60 mb-1">{formatDate(order.date)}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-forest/50 truncate max-w-[60%]">
                    {order.items.slice(0, 2).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2}`}
                  </p>
                  <span className="font-semibold text-espresso text-sm">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Addresses */}
        <section className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-sand/30 flex items-center justify-between">
            <h3 className="font-semibold text-forest flex items-center gap-2">
              <MapPin size={18} className="text-forest/60" />
              {t.savedAddresses}
            </h3>
            <button className="text-sm text-espresso font-medium flex items-center gap-1 hover:underline">
              <Plus size={16} />
              {t.addAddress}
            </button>
          </div>
          <div className="divide-y divide-sand/20">
            {addresses.map((address, index) => (
              <div
                key={address.id}
                className="px-4 py-3 hover:bg-sand/10 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-forest text-sm">
                        {address.label === 'Home' ? t.home : address.label === 'Work' ? t.work : address.label}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-sand/40 text-forest/70 px-2 py-0.5 rounded-full">
                          {t.defaultLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-forest/60 mt-0.5 truncate">
                      {address.street}, {address.city}
                    </p>
                  </div>
                  <button className="p-2 text-forest/40 hover:text-forest transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Favorites */}
        <section className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-sand/30">
            <h3 className="font-semibold text-forest flex items-center gap-2">
              <Heart size={18} className="text-forest/60" />
              {t.favorites}
            </h3>
          </div>
          <div className="px-4 py-8 text-center">
            <div className="w-16 h-16 bg-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee size={28} className="text-forest/30" />
            </div>
            <p className="text-forest/60 text-sm mb-1">{t.noFavorites}</p>
            <p className="text-forest/40 text-xs mb-4">{t.browsMenu}</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-full text-sm font-medium hover:bg-forest/90 transition-all"
            >
              {t.exploreMenu}
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* Account Settings */}
        <section className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-sand/30">
            <h3 className="font-semibold text-forest flex items-center gap-2">
              <Settings size={18} className="text-forest/60" />
              {t.accountSettings}
            </h3>
          </div>
          <div className="divide-y divide-sand/20">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-sand/10 transition-colors">
              <div className="flex items-center gap-3">
                <Edit2 size={18} className="text-forest/60" />
                <span className="text-forest text-sm">{t.editProfile}</span>
              </div>
              <ChevronRight size={18} className="text-forest/40" />
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-sand/10 transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-forest/60" />
                <span className="text-forest text-sm">{t.changePassword}</span>
              </div>
              <ChevronRight size={18} className="text-forest/40" />
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-sand/10 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-forest/60" />
                <span className="text-forest text-sm">{t.notifications}</span>
              </div>
              <ChevronRight size={18} className="text-forest/40" />
            </button>
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-white rounded-2xl shadow-soft flex items-center justify-center gap-2 text-red-600 font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>{t.logout}</span>
        </button>
      </main>

      <MobileNavBar />
    </div>
  );
};

export default Account;
