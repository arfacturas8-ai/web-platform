import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  Gift,
  Calendar,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    title: 'Points History',
    subtitle: 'View your points activity and reward redemptions',
    currentBalance: 'Current Balance',
    pts: 'pts',
    transactions: 'Transactions',
    redemptions: 'Redemptions',
    transactionHistory: 'Transaction History',
    noTransactions: 'No transactions yet. Start earning points by making purchases!',
    rewardRedemptions: 'Reward Redemptions',
    noRedemptions: 'No redemptions yet. Browse the rewards marketplace to redeem your points!',
    refreshHistory: 'Refresh History',
    expires: 'Expires',
    redeemed: 'Redeemed',
    used: 'Used',
    expired: 'Expired',
    active: 'Active',
    error: 'Error',
    failedToLoad: 'Failed to load history',
  },
  es: {
    title: 'Historial de Puntos',
    subtitle: 'Ver tu actividad de puntos y canjes de recompensas',
    currentBalance: 'Saldo Actual',
    pts: 'pts',
    transactions: 'Transacciones',
    redemptions: 'Canjes',
    transactionHistory: 'Historial de Transacciones',
    noTransactions: '¡Aún no hay transacciones. Comienza a ganar puntos haciendo compras!',
    rewardRedemptions: 'Canjes de Recompensas',
    noRedemptions: '¡Aún no hay canjes. Explora el catálogo de recompensas para canjear tus puntos!',
    refreshHistory: 'Actualizar Historial',
    expires: 'Expira',
    redeemed: 'Canjeado',
    used: 'Usado',
    expired: 'Expirado',
    active: 'Activo',
    error: 'Error',
    failedToLoad: 'Error al cargar historial',
  },
  it: {
    title: 'Cronologia Punti',
    subtitle: 'Visualizza le tue attività punti e riscatti premi',
    currentBalance: 'Saldo Attuale',
    pts: 'pts',
    transactions: 'Transazioni',
    redemptions: 'Riscatti',
    transactionHistory: 'Cronologia Transazioni',
    noTransactions: 'Nessuna transazione ancora. Inizia a guadagnare punti con i tuoi acquisti!',
    rewardRedemptions: 'Riscatti Premi',
    noRedemptions: 'Nessun riscatto ancora. Esplora il catalogo premi per riscattare i tuoi punti!',
    refreshHistory: 'Aggiorna Cronologia',
    expires: 'Scade',
    redeemed: 'Riscattato',
    used: 'Usato',
    expired: 'Scaduto',
    active: 'Attivo',
    error: 'Errore',
    failedToLoad: 'Caricamento cronologia fallito',
  },
  de: {
    title: 'Punkteverlauf',
    subtitle: 'Punkteaktivität und Prämieneinlösungen anzeigen',
    currentBalance: 'Aktueller Kontostand',
    pts: 'Pkt',
    transactions: 'Transaktionen',
    redemptions: 'Einlösungen',
    transactionHistory: 'Transaktionsverlauf',
    noTransactions: 'Noch keine Transaktionen. Sammeln Sie Punkte durch Einkäufe!',
    rewardRedemptions: 'Prämieneinlösungen',
    noRedemptions: 'Noch keine Einlösungen. Stöbern Sie im Prämienkatalog!',
    refreshHistory: 'Verlauf Aktualisieren',
    expires: 'Läuft ab',
    redeemed: 'Eingelöst',
    used: 'Verwendet',
    expired: 'Abgelaufen',
    active: 'Aktiv',
    error: 'Fehler',
    failedToLoad: 'Verlauf konnte nicht geladen werden',
  },
  fr: {
    title: 'Historique des Points',
    subtitle: 'Consultez votre activité de points et échanges de récompenses',
    currentBalance: 'Solde Actuel',
    pts: 'pts',
    transactions: 'Transactions',
    redemptions: 'Échanges',
    transactionHistory: 'Historique des Transactions',
    noTransactions: 'Pas encore de transactions. Commencez à gagner des points en effectuant des achats!',
    rewardRedemptions: 'Échanges de Récompenses',
    noRedemptions: 'Pas encore d\'échanges. Parcourez le catalogue de récompenses!',
    refreshHistory: 'Actualiser l\'Historique',
    expires: 'Expire',
    redeemed: 'Échangé',
    used: 'Utilisé',
    expired: 'Expiré',
    active: 'Actif',
    error: 'Erreur',
    failedToLoad: 'Échec du chargement de l\'historique',
  },
  sv: {
    title: 'Poänghistorik',
    subtitle: 'Se din poängaktivitet och belöningsinlösen',
    currentBalance: 'Aktuellt Saldo',
    pts: 'pts',
    transactions: 'Transaktioner',
    redemptions: 'Inlösen',
    transactionHistory: 'Transaktionshistorik',
    noTransactions: 'Inga transaktioner ännu. Börja tjäna poäng genom att handla!',
    rewardRedemptions: 'Belöningsinlösen',
    noRedemptions: 'Inga inlösen ännu. Utforska belöningskatalogen för att lösa in dina poäng!',
    refreshHistory: 'Uppdatera Historik',
    expires: 'Utgår',
    redeemed: 'Inlöst',
    used: 'Använd',
    expired: 'Utgången',
    active: 'Aktiv',
    error: 'Fel',
    failedToLoad: 'Kunde inte ladda historik',
  },
};

interface Transaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  order_id?: string;
  created_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

interface Redemption {
  id: string;
  reward_id: string;
  points_spent: number;
  redemption_code: string;
  redeemed_at: string;
  used_at?: string;
  expires_at?: string;
  is_used: boolean;
  is_expired: boolean;
}

export default function PointsHistory() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [availablePoints, setAvailablePoints] = useState(0);

  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const customerId = 'demo-customer-id'; // In production, from auth context

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);

    try {
      // Fetch balance
      const balanceResponse = await fetch(
        `/api/v1/loyalty/balance?customer_id=${customerId}`
      );
      if (!balanceResponse.ok) throw new Error('Failed to fetch balance');
      const balanceData = await balanceResponse.json();
      setAvailablePoints(balanceData.available_points);

      // Fetch transactions
      const transactionsResponse = await fetch(
        `/api/v1/loyalty/transactions?customer_id=${customerId}&limit=100`
      );
      if (!transactionsResponse.ok)
        throw new Error('Failed to fetch transactions');
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

      // Fetch redemptions
      const redemptionsResponse = await fetch(
        `/api/v1/loyalty/redemptions?customer_id=${customerId}&limit=50`
      );
      if (!redemptionsResponse.ok)
        throw new Error('Failed to fetch redemptions');
      const redemptionsData = await redemptionsResponse.json();
      setRedemptions(redemptionsData);
    } catch (err: any) {
      toast({
        title: t.error,
        description: err.message || t.failedToLoad,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'redeemed':
        return <Gift className="h-4 w-4 text-purple-600" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'bonus':
        return <Sparkles className="h-4 w-4 text-yellow-600" />;
      default:
        return <TrendingDown className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'redeemed':
        return 'text-purple-600';
      case 'expired':
        return 'text-orange-600';
      case 'bonus':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      {/* Current Balance Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-background">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t.currentBalance}
            </p>
            <p className="text-4xl font-bold text-primary">
              {availablePoints.toLocaleString()} {t.pts}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">
            <ShoppingBag className="mr-2 h-4 w-4" />
            {t.transactions} ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="redemptions">
            <Gift className="mr-2 h-4 w-4" />
            {t.redemptions} ({redemptions.length})
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{t.transactionHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {t.noTransactions}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={transaction.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">
                                {transaction.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.transaction_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(transaction.created_at)}
                              </span>
                              {transaction.expires_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {t.expires}: {formatDate(transaction.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${getTransactionColor(
                              transaction.transaction_type
                            )}`}
                          >
                            {transaction.points > 0 ? '+' : ''}
                            {transaction.points.toLocaleString()} pts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redemptions Tab */}
        <TabsContent value="redemptions">
          <Card>
            <CardHeader>
              <CardTitle>{t.rewardRedemptions}</CardTitle>
            </CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {t.noRedemptions}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {redemptions.map((redemption, index) => (
                    <div key={redemption.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  redemption.is_expired
                                    ? 'destructive'
                                    : redemption.is_used
                                    ? 'secondary'
                                    : 'default'
                                }
                              >
                                {redemption.is_expired
                                  ? t.expired
                                  : redemption.is_used
                                  ? t.used
                                  : t.active}
                              </Badge>
                              <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                {redemption.redemption_code}
                              </code>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {t.redeemed}: {formatDate(redemption.redeemed_at)}
                              </span>
                              {redemption.used_at && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {t.used}: {formatDate(redemption.used_at)}
                                </span>
                              )}
                              {redemption.expires_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {t.expires}: {formatDate(redemption.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-purple-600">
                              -{redemption.points_spent.toLocaleString()} pts
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={fetchHistory}>
          <Loader2 className="mr-2 h-4 w-4" />
          {t.refreshHistory}
        </Button>
      </div>
    </div>
  );
}
