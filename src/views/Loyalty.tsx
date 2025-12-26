/**
 * Cafe 1973 - Loyalty/Rewards Page
 * Customer-facing rewards program page
 * Mobile-first design
 */
import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Gift, Star, Trophy, Award, Coffee, Percent, ChevronRight, Clock, Check } from 'lucide-react';

// Storage key for demo points
const LOYALTY_POINTS_KEY = 'cafe1973_loyalty_points';

// Tier configuration
const TIERS = {
  bronze: { min: 0, max: 500, color: 'bg-amber-600', textColor: 'text-amber-600' },
  silver: { min: 501, max: 1500, color: 'bg-gray-400', textColor: 'text-gray-500' },
  gold: { min: 1501, max: Infinity, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
};

// Mock point history data
const mockPointHistory = [
  {
    id: 1,
    date: '2024-01-15',
    description: {
      en: 'Coffee Purchase',
      es: 'Compra de Cafe',
      it: 'Acquisto di Caffe',
      de: 'Kaffee-Kauf',
      fr: 'Achat de Cafe',
      sv: 'Kaffekop'
    },
    points: 25,
    type: 'earn'
  },
  {
    id: 2,
    date: '2024-01-14',
    description: {
      en: 'Pastry Purchase',
      es: 'Compra de Pasteleria',
      it: 'Acquisto di Pasticceria',
      de: 'Backwaren-Kauf',
      fr: 'Achat de Patisserie',
      sv: 'Bakverkskop'
    },
    points: 15,
    type: 'earn'
  },
  {
    id: 3,
    date: '2024-01-12',
    description: {
      en: 'Free Coffee Redeemed',
      es: 'Cafe Gratis Canjeado',
      it: 'Caffe Gratuito Riscattato',
      de: 'Kostenloser Kaffee Eingelost',
      fr: 'Cafe Gratuit Echange',
      sv: 'Gratis Kaffe Inlost'
    },
    points: -100,
    type: 'redeem'
  },
  {
    id: 4,
    date: '2024-01-10',
    description: {
      en: 'Breakfast Order',
      es: 'Pedido de Desayuno',
      it: 'Ordine Colazione',
      de: 'Fruhstucksbestellung',
      fr: 'Commande Petit-dejeuner',
      sv: 'Frukostbestallning'
    },
    points: 45,
    type: 'earn'
  },
  {
    id: 5,
    date: '2024-01-08',
    description: {
      en: 'Welcome Bonus',
      es: 'Bono de Bienvenida',
      it: 'Bonus di Benvenuto',
      de: 'Willkommensbonus',
      fr: 'Bonus de Bienvenue',
      sv: 'Valkomstbonus'
    },
    points: 50,
    type: 'earn'
  },
];

// Available rewards
const rewards = [
  {
    id: 1,
    name: {
      en: 'Free Coffee',
      es: 'Cafe Gratis',
      it: 'Caffe Gratuito',
      de: 'Kostenloser Kaffee',
      fr: 'Cafe Gratuit',
      sv: 'Gratis Kaffe'
    },
    points: 100,
    icon: Coffee
  },
  {
    id: 2,
    name: {
      en: 'Free Pastry',
      es: 'Pasteleria Gratis',
      it: 'Pasticceria Gratuita',
      de: 'Kostenlose Backwaren',
      fr: 'Patisserie Gratuite',
      sv: 'Gratis Bakverk'
    },
    points: 200,
    icon: Gift
  },
  {
    id: 3,
    name: {
      en: '20% Off Order',
      es: '20% de Descuento',
      it: '20% di Sconto',
      de: '20% Rabatt',
      fr: '20% de Reduction',
      sv: '20% Rabatt'
    },
    points: 500,
    icon: Percent
  },
  {
    id: 4,
    name: {
      en: 'Free Breakfast',
      es: 'Desayuno Gratis',
      it: 'Colazione Gratuita',
      de: 'Kostenloses Fruhstuck',
      fr: 'Petit-dejeuner Gratuit',
      sv: 'Gratis Frukost'
    },
    points: 750,
    icon: Award
  },
];

// Translations for all supported languages
const translations = {
  en: {
    rewardsProgram: 'Rewards Program',
    rewardsProgramDesc: 'Earn points with every purchase and redeem them for amazing rewards',
    yourPoints: 'Your Points',
    progressTo: 'Progress to',
    youNeed: 'You need',
    morePointsTo: 'more points to reach',
    howItWorks: 'How It Works',
    earnPoints: 'Earn Points',
    earnPointsDesc: 'Earn 1 point for every $1 you spend on purchases',
    levelUp: 'Level Up',
    levelUpDesc: 'Accumulate points to unlock exclusive benefits at each tier',
    redeemRewards: 'Redeem Rewards',
    redeemRewardsDesc: 'Use your points to get free drinks, food, and discounts',
    membershipTiers: 'Membership Tiers',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    points: 'points',
    yourTier: 'Your tier',
    availableRewards: 'Available Rewards',
    redeem: 'Redeem',
    pointsHistory: 'Points History',
    joinToday: 'Join Today',
    joinTodayDesc: 'Sign up now and receive 250 welcome bonus points!',
    joinRewardsProgram: 'Join Rewards Program',
    visitStoreDesc: 'Visit our store to earn more points!',
    viewMenu: 'View Menu',
    pointsExpire: 'Points expire 12 months after last activity.',
  },
  es: {
    rewardsProgram: 'Programa de Recompensas',
    rewardsProgramDesc: 'Gana puntos con cada compra y canjealos por recompensas increibles',
    yourPoints: 'Tus Puntos',
    progressTo: 'Progreso al nivel',
    youNeed: 'Necesitas',
    morePointsTo: 'puntos mas para alcanzar',
    howItWorks: 'Como Funciona',
    earnPoints: 'Gana Puntos',
    earnPointsDesc: 'Gana 1 punto por cada $1 que gastes en tus compras',
    levelUp: 'Sube de Nivel',
    levelUpDesc: 'Acumula puntos para desbloquear beneficios exclusivos de cada nivel',
    redeemRewards: 'Canjea Recompensas',
    redeemRewardsDesc: 'Usa tus puntos para obtener bebidas, comidas y descuentos gratis',
    membershipTiers: 'Niveles de Membresia',
    bronze: 'Bronce',
    silver: 'Plata',
    gold: 'Oro',
    points: 'puntos',
    yourTier: 'Tu nivel',
    availableRewards: 'Recompensas Disponibles',
    redeem: 'Canjear',
    pointsHistory: 'Historial de Puntos',
    joinToday: 'Unete Hoy',
    joinTodayDesc: 'Registrate ahora y recibe 250 puntos de bienvenida!',
    joinRewardsProgram: 'Unirme al Programa',
    visitStoreDesc: 'Visita nuestra tienda para ganar mas puntos!',
    viewMenu: 'Ver Menu',
    pointsExpire: 'Los puntos expiran 12 meses despues de la ultima actividad.',
  },
  it: {
    rewardsProgram: 'Programma Premi',
    rewardsProgramDesc: 'Guadagna punti ad ogni acquisto e riscattali per premi fantastici',
    yourPoints: 'I Tuoi Punti',
    progressTo: 'Progresso verso',
    youNeed: 'Hai bisogno di',
    morePointsTo: 'punti in piu per raggiungere',
    howItWorks: 'Come Funziona',
    earnPoints: 'Guadagna Punti',
    earnPointsDesc: 'Guadagna 1 punto per ogni $1 speso negli acquisti',
    levelUp: 'Avanza di Livello',
    levelUpDesc: 'Accumula punti per sbloccare benefici esclusivi a ogni livello',
    redeemRewards: 'Riscatta Premi',
    redeemRewardsDesc: 'Usa i tuoi punti per ottenere bevande, cibo e sconti gratuiti',
    membershipTiers: 'Livelli di Iscrizione',
    bronze: 'Bronzo',
    silver: 'Argento',
    gold: 'Oro',
    points: 'punti',
    yourTier: 'Il tuo livello',
    availableRewards: 'Premi Disponibili',
    redeem: 'Riscatta',
    pointsHistory: 'Cronologia Punti',
    joinToday: 'Iscriviti Oggi',
    joinTodayDesc: 'Registrati ora e ricevi 250 punti bonus di benvenuto!',
    joinRewardsProgram: 'Iscriviti al Programma',
    visitStoreDesc: 'Visita il nostro negozio per guadagnare piu punti!',
    viewMenu: 'Vedi Menu',
    pointsExpire: 'I punti scadono 12 mesi dopo l\'ultima attivita.',
  },
  de: {
    rewardsProgram: 'Pramienprogramm',
    rewardsProgramDesc: 'Sammeln Sie Punkte bei jedem Einkauf und losen Sie diese fur tolle Pramien ein',
    yourPoints: 'Ihre Punkte',
    progressTo: 'Fortschritt zu',
    youNeed: 'Sie benotigen',
    morePointsTo: 'weitere Punkte um zu erreichen',
    howItWorks: 'Wie es Funktioniert',
    earnPoints: 'Punkte Sammeln',
    earnPointsDesc: 'Verdienen Sie 1 Punkt fur jeden ausgegebenen $1',
    levelUp: 'Aufsteigen',
    levelUpDesc: 'Sammeln Sie Punkte, um exklusive Vorteile auf jeder Stufe freizuschalten',
    redeemRewards: 'Pramien Einlosen',
    redeemRewardsDesc: 'Verwenden Sie Ihre Punkte fur kostenlose Getranke, Essen und Rabatte',
    membershipTiers: 'Mitgliedschaftsstufen',
    bronze: 'Bronze',
    silver: 'Silber',
    gold: 'Gold',
    points: 'Punkte',
    yourTier: 'Ihre Stufe',
    availableRewards: 'Verfugbare Pramien',
    redeem: 'Einlosen',
    pointsHistory: 'Punkteverlauf',
    joinToday: 'Heute Beitreten',
    joinTodayDesc: 'Melden Sie sich jetzt an und erhalten Sie 250 Willkommensbonuspunkte!',
    joinRewardsProgram: 'Dem Pramienprogramm Beitreten',
    visitStoreDesc: 'Besuchen Sie unser Geschaft, um mehr Punkte zu sammeln!',
    viewMenu: 'Menu Ansehen',
    pointsExpire: 'Punkte verfallen 12 Monate nach der letzten Aktivitat.',
  },
  fr: {
    rewardsProgram: 'Programme de Recompenses',
    rewardsProgramDesc: 'Gagnez des points a chaque achat et echangez-les contre des recompenses incroyables',
    yourPoints: 'Vos Points',
    progressTo: 'Progres vers',
    youNeed: 'Vous avez besoin de',
    morePointsTo: 'points de plus pour atteindre',
    howItWorks: 'Comment ca Marche',
    earnPoints: 'Gagner des Points',
    earnPointsDesc: 'Gagnez 1 point pour chaque $1 depense lors de vos achats',
    levelUp: 'Monter de Niveau',
    levelUpDesc: 'Accumulez des points pour debloquer des avantages exclusifs a chaque niveau',
    redeemRewards: 'Echanger des Recompenses',
    redeemRewardsDesc: 'Utilisez vos points pour obtenir des boissons, de la nourriture et des remises gratuites',
    membershipTiers: 'Niveaux d\'Adhesion',
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    points: 'points',
    yourTier: 'Votre niveau',
    availableRewards: 'Recompenses Disponibles',
    redeem: 'Echanger',
    pointsHistory: 'Historique des Points',
    joinToday: 'Rejoignez Aujourd\'hui',
    joinTodayDesc: 'Inscrivez-vous maintenant et recevez 250 points bonus de bienvenue!',
    joinRewardsProgram: 'Rejoindre le Programme',
    visitStoreDesc: 'Visitez notre magasin pour gagner plus de points!',
    viewMenu: 'Voir le Menu',
    pointsExpire: 'Les points expirent 12 mois apres la derniere activite.',
  },
  sv: {
    rewardsProgram: 'Belöningsprogram',
    rewardsProgramDesc: 'Tjana poang vid varje kop och los in dem for fantastiska belöningar',
    yourPoints: 'Dina Poang',
    progressTo: 'Framsteg till',
    youNeed: 'Du behöver',
    morePointsTo: 'fler poang för att na',
    howItWorks: 'Hur det Fungerar',
    earnPoints: 'Tjana Poang',
    earnPointsDesc: 'Tjana 1 poang för varje $1 du spenderar pa köp',
    levelUp: 'Niva Upp',
    levelUpDesc: 'Samla poang för att lasa upp exklusiva fördelar pa varje niva',
    redeemRewards: 'Los in Belöningar',
    redeemRewardsDesc: 'Anvand dina poang för att fa gratis drycker, mat och rabatter',
    membershipTiers: 'Medlemsnivaer',
    bronze: 'Brons',
    silver: 'Silver',
    gold: 'Guld',
    points: 'poang',
    yourTier: 'Din niva',
    availableRewards: 'Tillgangliga Belöningar',
    redeem: 'Los in',
    pointsHistory: 'Poanghistorik',
    joinToday: 'Ga med Idag',
    joinTodayDesc: 'Registrera dig nu och fa 250 valkomstbonuspoang!',
    joinRewardsProgram: 'Ga med i Programmet',
    visitStoreDesc: 'Besök var butik för att tjana fler poang!',
    viewMenu: 'Visa Meny',
    pointsExpire: 'Poang löper ut 12 manader efter senaste aktivitet.',
  },
};

export const Loyalty: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [points, setPoints] = useState<number>(250);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // Load points from localStorage on mount
  useEffect(() => {
    const storedPoints = localStorage.getItem(LOYALTY_POINTS_KEY);
    if (storedPoints !== null) {
      setPoints(parseInt(storedPoints, 10));
      setIsJoined(true);
    }
  }, []);

  // Save points to localStorage when changed
  const savePoints = (newPoints: number) => {
    localStorage.setItem(LOYALTY_POINTS_KEY, newPoints.toString());
    setPoints(newPoints);
    setIsJoined(true);
  };

  // Handle join program
  const handleJoin = () => {
    savePoints(250); // Starting bonus
  };

  // Get current tier
  const getCurrentTier = () => {
    if (points >= TIERS.gold.min) return 'gold';
    if (points >= TIERS.silver.min) return 'silver';
    return 'bronze';
  };

  // Get next tier info
  const getNextTierInfo = () => {
    const currentTier = getCurrentTier();
    if (currentTier === 'bronze') {
      return { name: t.silver, pointsNeeded: TIERS.silver.min - points };
    }
    if (currentTier === 'silver') {
      return { name: t.gold, pointsNeeded: TIERS.gold.min - points };
    }
    return null;
  };

  // Calculate progress percentage to next tier
  const getTierProgress = () => {
    const currentTier = getCurrentTier();
    if (currentTier === 'gold') return 100;

    const tierConfig = TIERS[currentTier];
    const nextTierMin = currentTier === 'bronze' ? TIERS.silver.min : TIERS.gold.min;
    const progressInTier = points - tierConfig.min;
    const tierRange = nextTierMin - tierConfig.min;

    return Math.min(Math.round((progressInTier / tierRange) * 100), 100);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTierInfo();
  const tierProgress = getTierProgress();

  // Tier benefits
  const tierBenefits = {
    bronze: {
      en: ['1 point per $1 spent', 'Birthday reward', 'Member-only offers'],
      es: ['1 punto por $1 gastado', 'Recompensa de cumpleanos', 'Ofertas exclusivas'],
      it: ['1 punto per $1 speso', 'Premio di compleanno', 'Offerte riservate ai membri'],
      de: ['1 Punkt pro $1 ausgegeben', 'Geburtstagsbelohnung', 'Exklusive Angebote'],
      fr: ['1 point par $1 depense', 'Recompense d\'anniversaire', 'Offres exclusives'],
      sv: ['1 poang per $1 spenderad', 'Födelsedagsbelöning', 'Medlemserbjudanden'],
    },
    silver: {
      en: ['1.5 points per $1 spent', 'Free coffee on signup anniversary', 'Early access to new items', 'Priority seating'],
      es: ['1.5 puntos por $1 gastado', 'Cafe gratis en aniversario', 'Acceso anticipado a nuevos productos', 'Asientos prioritarios'],
      it: ['1.5 punti per $1 speso', 'Caffe gratuito all\'anniversario', 'Accesso anticipato ai nuovi prodotti', 'Posti prioritari'],
      de: ['1.5 Punkte pro $1 ausgegeben', 'Kostenloser Kaffee am Jubilaum', 'Fruhzeitiger Zugang zu neuen Artikeln', 'Prioritatssitzplatze'],
      fr: ['1.5 points par $1 depense', 'Cafe gratuit a l\'anniversaire', 'Acces anticipe aux nouveaux articles', 'Places prioritaires'],
      sv: ['1.5 poang per $1 spenderad', 'Gratis kaffe pa arsdagen', 'Tidig tillgang till nya produkter', 'Prioriterad sittning'],
    },
    gold: {
      en: ['2 points per $1 spent', 'Free pastry monthly', 'Exclusive tastings', 'VIP events access', 'Free delivery'],
      es: ['2 puntos por $1 gastado', 'Pasteleria gratis mensual', 'Degustaciones exclusivas', 'Acceso a eventos VIP', 'Entrega gratis'],
      it: ['2 punti per $1 speso', 'Pasticceria gratuita mensile', 'Degustazioni esclusive', 'Accesso a eventi VIP', 'Consegna gratuita'],
      de: ['2 Punkte pro $1 ausgegeben', 'Kostenlose Backwaren monatlich', 'Exklusive Verkostungen', 'VIP-Eventzugang', 'Kostenlose Lieferung'],
      fr: ['2 points par $1 depense', 'Patisserie gratuite mensuelle', 'Degustations exclusives', 'Acces aux evenements VIP', 'Livraison gratuite'],
      sv: ['2 poang per $1 spenderad', 'Gratis bakverk manatligen', 'Exklusiva provsmakningar', 'VIP-eventtillgang', 'Gratis leverans'],
    },
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative bg-forest text-white px-6 py-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-sand/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sand/20 rounded-full mb-6">
            <Gift className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {t.rewardsProgram}
          </h1>
          <p className="text-white/80 text-lg">
            {t.rewardsProgramDesc}
          </p>
        </div>
      </section>

      {/* Points Display Card */}
      {isJoined && (
        <section className="px-6 -mt-6 relative z-20">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-forest/60 mb-1">
                  {t.yourPoints}
                </p>
                <p className="text-4xl font-bold text-forest">{points.toLocaleString()}</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${TIERS[currentTier].color} text-white font-semibold capitalize flex items-center gap-2`}>
                <Trophy size={18} />
                {currentTier === 'bronze' && t.bronze}
                {currentTier === 'silver' && t.silver}
                {currentTier === 'gold' && t.gold}
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-forest/60">
                    {t.progressTo} {nextTier.name}
                  </span>
                  <span className="text-forest font-medium">{tierProgress}%</span>
                </div>
                <div className="h-3 bg-sand/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
                <p className="text-xs text-forest/50 mt-2">
                  {nextTier.pointsNeeded} {t.morePointsTo} {nextTier.name}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="px-6 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-forest text-center mb-8">
            {t.howItWorks}
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-forest" />
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-1">
                  {t.earnPoints}
                </h3>
                <p className="text-sm text-forest/60">
                  {t.earnPointsDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-forest" />
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-1">
                  {t.levelUp}
                </h3>
                <p className="text-sm text-forest/60">
                  {t.levelUpDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-forest" />
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-1">
                  {t.redeemRewards}
                </h3>
                <p className="text-sm text-forest/60">
                  {t.redeemRewardsDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier System */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-forest text-center mb-8">
            {t.membershipTiers}
          </h2>

          <div className="space-y-4">
            {/* Bronze Tier */}
            <div className={`rounded-xl p-5 border-2 transition-all ${currentTier === 'bronze' ? 'border-amber-600 bg-amber-50' : 'border-sand/30 bg-[#faf8f3]'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">
                      {t.bronze}
                    </h3>
                    <p className="text-xs text-forest/50">0 - 500 {t.points}</p>
                  </div>
                </div>
                {currentTier === 'bronze' && (
                  <span className="text-xs px-2 py-1 bg-amber-600 text-white rounded-full">
                    {t.yourTier}
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {(tierBenefits.bronze[language as keyof typeof tierBenefits.bronze] || tierBenefits.bronze.en).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-forest/70">
                    <Check size={16} className="text-amber-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Silver Tier */}
            <div className={`rounded-xl p-5 border-2 transition-all ${currentTier === 'silver' ? 'border-gray-400 bg-gray-50' : 'border-sand/30 bg-[#faf8f3]'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">
                      {t.silver}
                    </h3>
                    <p className="text-xs text-forest/50">501 - 1,500 {t.points}</p>
                  </div>
                </div>
                {currentTier === 'silver' && (
                  <span className="text-xs px-2 py-1 bg-gray-400 text-white rounded-full">
                    {t.yourTier}
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {(tierBenefits.silver[language as keyof typeof tierBenefits.silver] || tierBenefits.silver.en).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-forest/70">
                    <Check size={16} className="text-gray-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gold Tier */}
            <div className={`rounded-xl p-5 border-2 transition-all ${currentTier === 'gold' ? 'border-yellow-500 bg-yellow-50' : 'border-sand/30 bg-[#faf8f3]'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">
                      {t.gold}
                    </h3>
                    <p className="text-xs text-forest/50">1,501+ {t.points}</p>
                  </div>
                </div>
                {currentTier === 'gold' && (
                  <span className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-full">
                    {t.yourTier}
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {(tierBenefits.gold[language as keyof typeof tierBenefits.gold] || tierBenefits.gold.en).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-forest/70">
                    <Check size={16} className="text-yellow-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rewards */}
      <section className="px-6 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-forest text-center mb-8">
            {t.availableRewards}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const canRedeem = isJoined && points >= reward.points;
              const IconComponent = reward.icon;

              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                    canRedeem ? 'border-forest/20 hover:border-forest/40' : 'border-transparent opacity-75'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    canRedeem ? 'bg-forest/10' : 'bg-sand/30'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${canRedeem ? 'text-forest' : 'text-forest/40'}`} />
                  </div>
                  <h3 className="font-semibold text-forest text-sm mb-1">
                    {reward.name[language as keyof typeof reward.name] || reward.name.en}
                  </h3>
                  <p className={`text-sm font-bold ${canRedeem ? 'text-forest' : 'text-forest/50'}`}>
                    {reward.points} pts
                  </p>
                  {canRedeem && (
                    <button className="mt-3 w-full py-2 bg-forest text-white text-xs font-medium rounded-lg hover:bg-forest/90 transition-colors">
                      {t.redeem}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Point History */}
      {isJoined && (
        <section className="px-6 py-12 bg-white">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-forest text-center mb-8">
              {t.pointsHistory}
            </h2>

            <div className="space-y-3">
              {mockPointHistory.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-sand/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <Star className="w-5 h-5 text-green-600" />
                      ) : (
                        <Gift className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-forest text-sm">
                        {transaction.description[language as keyof typeof transaction.description] || transaction.description.en}
                      </p>
                      <p className="text-xs text-forest/50 flex items-center gap-1">
                        <Clock size={12} />
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    transaction.type === 'earn' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {transaction.type === 'earn' ? '+' : ''}{transaction.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isJoined && (
        <section className="px-6 py-12">
          <div className="max-w-lg mx-auto">
            <div className="bg-forest rounded-2xl p-8 text-center">
              <Trophy className="w-12 h-12 text-sand mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {t.joinToday}
              </h2>
              <p className="text-white/80 mb-6">
                {t.joinTodayDesc}
              </p>
              <button
                onClick={handleJoin}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sand text-forest rounded-full font-semibold hover:bg-sand/90 transition-all active:scale-[0.98]"
              >
                {t.joinRewardsProgram}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Already a member CTA */}
      {isJoined && (
        <section className="px-6 py-12">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-forest/60 mb-4">
              {t.visitStoreDesc}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
            >
              {t.viewMenu}
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-forest/60">
            {t.pointsExpire}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Loyalty;
