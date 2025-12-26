/**
 * Café 1973 | Bakery - Admin Dashboard
 * Main dashboard with stats, orders, and analytics
 */
import React from 'react';
import { Link } from '@/lib/router';
import { useDashboardStats } from '@/hooks/useAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Coffee,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Skeleton, SkeletonDashboardCard } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: 'forest' | 'sand' | 'espresso';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, trend, color = 'forest' }) => {
  const bgColors = {
    forest: 'bg-forest',
    sand: 'bg-sand',
    espresso: 'bg-espresso'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${bgColors[color]} rounded-xl flex items-center justify-center`}>
          <div className="text-white">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-forest">{value}</p>
        <p className="text-sm font-medium text-forest/80 mt-1">{title}</p>
        <p className="text-xs text-forest/50 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const { language } = useLanguage();

  const formatPrice = (price: number) => `₡${price.toLocaleString('es-CR')}`;

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-sand/30 text-sand-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-forest/10 text-forest',
      no_show: 'bg-gray-100 text-gray-600',
    };
    return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock size={14} />;
      case 'confirmed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" rounded="lg" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonDashboardCard key={i} />
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reservations Skeleton */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y divide-sand/20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10" rounded="lg" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" rounded="full" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items Skeleton */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y divide-sand/20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8" rounded="lg" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-6 w-20" rounded="full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <Skeleton className="h-5 w-48 mb-6" />
            <Skeleton className="h-[250px] w-full" rounded="lg" />
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <Skeleton className="h-5 w-40 mb-6" />
            <Skeleton className="h-[250px] w-full" rounded="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-forest mb-2">
            {language === 'es' ? 'Error al cargar' : 'Failed to load'}
          </h2>
          <p className="text-forest/60 mb-4">
            {language === 'es' ? 'No se pudo cargar el dashboard' : 'Could not load dashboard data'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
          >
            {language === 'es' ? 'Reintentar' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {language === 'es' ? 'Panel de Control' : 'Dashboard'}
          </h1>
          <p className="text-forest/60">
            {language === 'es'
              ? '¡Bienvenido! Aquí está lo que pasa hoy.'
              : "Welcome back! Here's what's happening today."}
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
        >
          <ShoppingBag size={18} />
          <span>{language === 'es' ? 'Ver Pedidos' : 'View Orders'}</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={language === 'es' ? 'Reservaciones Hoy' : "Today's Reservations"}
          value={stats?.today_reservations || 0}
          icon={<Calendar size={24} />}
          description={language === 'es' ? 'Confirmadas para hoy' : 'Confirmed for today'}
          trend={12}
          color="forest"
        />
        <StatsCard
          title={language === 'es' ? 'Ingresos Hoy' : "Today's Revenue"}
          value={formatPrice(stats?.today_revenue || 0)}
          icon={<DollarSign size={24} />}
          description={language === 'es' ? 'Ventas del día' : "Today's sales"}
          trend={8}
          color="espresso"
        />
        <StatsCard
          title={language === 'es' ? 'Pendientes' : 'Pending'}
          value={stats?.pending_reservations || 0}
          icon={<Clock size={24} />}
          description={language === 'es' ? 'Esperando confirmación' : 'Awaiting confirmation'}
          color="sand"
        />
        <StatsCard
          title={language === 'es' ? 'Clientes' : 'Customers'}
          value={stats?.total_customers || 0}
          icon={<Users size={24} />}
          description={language === 'es' ? 'Clientes registrados' : 'Registered customers'}
          trend={5}
          color="forest"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
            <h2 className="font-semibold text-forest">
              {language === 'es' ? 'Reservaciones Recientes' : 'Recent Reservations'}
            </h2>
            <Link to="/admin/reservations" className="text-sm text-forest/60 hover:text-forest flex items-center gap-1">
              {language === 'es' ? 'Ver todas' : 'View all'}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-sand/20">
            {stats?.recent_reservations && stats.recent_reservations.length > 0 ? (
              stats.recent_reservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="px-6 py-4 hover:bg-[#faf8f3] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sand/30 rounded-xl flex items-center justify-center">
                        <Users size={18} className="text-forest" />
                      </div>
                      <div>
                        <p className="font-medium text-forest">{reservation.customer_name}</p>
                        <p className="text-sm text-forest/60">
                          {reservation.party_size} {language === 'es' ? 'personas' : 'guests'} • {reservation.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        {reservation.status}
                      </span>
                      <p className="text-xs text-forest/50 mt-1">
                        {format(new Date(reservation.date), 'MMM d')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Coffee size={32} className="text-sand mx-auto mb-2" />
                <p className="text-forest/50">
                  {language === 'es' ? 'No hay reservaciones recientes' : 'No recent reservations'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
            <h2 className="font-semibold text-forest">
              {language === 'es' ? 'Productos Populares' : 'Popular Items'}
            </h2>
            <Link to="/admin/menu" className="text-sm text-forest/60 hover:text-forest flex items-center gap-1">
              {language === 'es' ? 'Ver menú' : 'View menu'}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-sand/20">
            {stats?.popular_items && stats.popular_items.length > 0 ? (
              stats.popular_items.slice(0, 5).map((item, index) => (
                <div key={item.id} className="px-6 py-4 hover:bg-[#faf8f3] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="font-medium text-forest">{item.name}</p>
                    </div>
                    <span className="px-3 py-1 bg-sand/30 rounded-full text-sm font-medium text-forest">
                      {item.count} {language === 'es' ? 'pedidos' : 'orders'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Coffee size={32} className="text-sand mx-auto mb-2" />
                <p className="text-forest/50">
                  {language === 'es' ? 'No hay datos disponibles' : 'No data available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservations Trend */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-forest mb-6">
            {language === 'es' ? 'Tendencia de Reservaciones (7 días)' : 'Reservations Trend (7 days)'}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.reservations_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1bd92" strokeOpacity={0.3} />
              <XAxis dataKey="date" stroke="#223833" fontSize={12} />
              <YAxis stroke="#223833" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #d1bd92',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#223833"
                strokeWidth={3}
                dot={{ fill: '#223833', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#d1bd92', stroke: '#223833' }}
                name={language === 'es' ? 'Reservaciones' : 'Reservations'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Items Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-forest mb-6">
            {language === 'es' ? 'Productos Más Vendidos' : 'Top Selling Items'}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.popular_items || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1bd92" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#223833" fontSize={11} />
              <YAxis stroke="#223833" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #d1bd92',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar
                dataKey="count"
                fill="#223833"
                radius={[8, 8, 0, 0]}
                name={language === 'es' ? 'Pedidos' : 'Orders'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
