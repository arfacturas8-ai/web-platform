/**
 * Cafe 1973 - Blog/News Page
 * News, recipes, and updates from the cafe
 * Mobile-first design with bilingual support
 */
import React, { useEffect, useState } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Newspaper,
  Calendar,
  Tag,
  ChevronRight,
  Clock,
  User,
  Mail,
  Send,
} from 'lucide-react';

// Blog post interface
interface BlogPost {
  id: string;
  title: { en: string; es: string; it: string; de: string; fr: string; sv: string };
  excerpt: { en: string; es: string; it: string; de: string; fr: string; sv: string };
  category: 'news' | 'recipes' | 'events' | 'tips';
  author: string;
  date: string;
  readTime: number;
  imageUrl?: string;
  featured?: boolean;
}

// Category interface
interface Category {
  id: string;
  label: { en: string; es: string; it: string; de: string; fr: string; sv: string };
}

// Content translations
const content = {
  hero: {
    title: { en: 'News & Updates', es: 'Noticias y Actualizaciones', it: 'Notizie e Aggiornamenti', de: 'Nachrichten & Updates', fr: 'Actualités et Mises à Jour', sv: 'Nyheter & Uppdateringar' },
    subtitle: {
      en: 'Stay updated with the latest from Cafe 1973',
      es: 'Mantente al dia con lo ultimo de Cafe 1973',
      it: 'Rimani aggiornato con le ultime novità dal Cafe 1973',
      de: 'Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten vom Cafe 1973',
      fr: 'Restez informé des dernières nouvelles du Cafe 1973',
      sv: 'Håll dig uppdaterad med det senaste från Cafe 1973',
    },
  },
  categories: {
    all: { en: 'All', es: 'Todos', it: 'Tutti', de: 'Alle', fr: 'Tous', sv: 'Alla' },
    news: { en: 'News', es: 'Noticias', it: 'Notizie', de: 'Nachrichten', fr: 'Actualités', sv: 'Nyheter' },
    recipes: { en: 'Recipes', es: 'Recetas', it: 'Ricette', de: 'Rezepte', fr: 'Recettes', sv: 'Recept' },
    events: { en: 'Events', es: 'Eventos', it: 'Eventi', de: 'Veranstaltungen', fr: 'Événements', sv: 'Evenemang' },
    tips: { en: 'Tips', es: 'Consejos', it: 'Consigli', de: 'Tipps', fr: 'Conseils', sv: 'Tips' },
  },
  featured: { en: 'Featured', es: 'Destacado', it: 'In Evidenza', de: 'Empfohlen', fr: 'À la Une', sv: 'Utvald' },
  readMore: { en: 'Read More', es: 'Leer Mas', it: 'Leggi di Più', de: 'Mehr Lesen', fr: 'Lire Plus', sv: 'Läs Mer' },
  minRead: { en: 'min read', es: 'min de lectura', it: 'min di lettura', de: 'Min. Lesezeit', fr: 'min de lecture', sv: 'min läsning' },
  newsletter: {
    title: { en: 'Subscribe to Our Newsletter', es: 'Suscribete a Nuestro Boletin', it: 'Iscriviti alla Nostra Newsletter', de: 'Abonnieren Sie Unseren Newsletter', fr: 'Abonnez-vous à Notre Newsletter', sv: 'Prenumerera på Vårt Nyhetsbrev' },
    description: {
      en: 'Get the latest news, recipes, and exclusive offers delivered to your inbox.',
      es: 'Recibe las ultimas noticias, recetas y ofertas exclusivas en tu correo.',
      it: 'Ricevi le ultime notizie, ricette e offerte esclusive nella tua casella di posta.',
      de: 'Erhalten Sie die neuesten Nachrichten, Rezepte und exklusive Angebote in Ihrem Posteingang.',
      fr: 'Recevez les dernières actualités, recettes et offres exclusives dans votre boîte mail.',
      sv: 'Få de senaste nyheterna, recepten och exklusiva erbjudandena i din inkorg.',
    },
    placeholder: { en: 'Enter your email', es: 'Ingresa tu correo', it: 'Inserisci la tua email', de: 'Geben Sie Ihre E-Mail ein', fr: 'Entrez votre email', sv: 'Ange din e-post' },
    button: { en: 'Subscribe', es: 'Suscribirse', it: 'Iscriviti', de: 'Abonnieren', fr: "S'abonner", sv: 'Prenumerera' },
    success: {
      en: 'Thank you for subscribing!',
      es: 'Gracias por suscribirte!',
      it: 'Grazie per esserti iscritto!',
      de: 'Vielen Dank für Ihre Anmeldung!',
      fr: 'Merci de vous être abonné!',
      sv: 'Tack för att du prenumererar!',
    },
  },
  emptyState: { en: 'No posts in this category.', es: 'No hay publicaciones en esta categoria.', it: 'Nessun post in questa categoria.', de: 'Keine Beiträge in dieser Kategorie.', fr: 'Aucun article dans cette catégorie.', sv: 'Inga inlägg i denna kategori.' },
  footer: { en: 'All rights reserved.', es: 'Todos los derechos reservados.', it: 'Tutti i diritti riservati.', de: 'Alle Rechte vorbehalten.', fr: 'Tous droits réservés.', sv: 'Alla rättigheter förbehållna.' },
};

// Default blog posts
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: {
      en: 'New Summer Menu 2024',
      es: 'Nuevo Menu de Verano 2024',
      it: 'Nuovo Menu Estivo 2024',
      de: 'Neues Sommermenü 2024',
      fr: 'Nouveau Menu d\'Été 2024',
      sv: 'Ny Sommarmeny 2024',
    },
    excerpt: {
      en: 'Discover our refreshing new summer offerings, featuring tropical fruits and cold brew specials that will keep you cool all season long.',
      es: 'Descubre nuestras refrescantes nuevas ofertas de verano, con frutas tropicales y especialidades de cafe frio que te mantendran fresco toda la temporada.',
      it: 'Scopri le nostre nuove e rinfrescanti offerte estive, con frutti tropicali e specialità di caffè freddo che ti manterranno fresco per tutta la stagione.',
      de: 'Entdecken Sie unsere erfrischenden neuen Sommerangebote mit tropischen Früchten und Cold Brew-Spezialitäten, die Sie die ganze Saison über kühl halten.',
      fr: 'Découvrez nos nouvelles offres d\'été rafraîchissantes, avec des fruits tropicaux et des spécialités de café froid qui vous garderont au frais toute la saison.',
      sv: 'Upptäck våra uppfriskande nya sommarerbjudanden, med tropiska frukter och cold brew-specialiteter som håller dig sval hela säsongen.',
    },
    category: 'news',
    author: 'Maria Rodriguez',
    date: '2024-06-15',
    readTime: 3,
    featured: true,
  },
  {
    id: '2',
    title: {
      en: 'Secret Recipe: Our Famous Tres Leches',
      es: 'Receta Secreta: Nuestro Famoso Tres Leches',
      it: 'Ricetta Segreta: Il Nostro Famoso Tres Leches',
      de: 'Geheimrezept: Unser Berühmter Tres Leches',
      fr: 'Recette Secrète : Notre Fameux Tres Leches',
      sv: 'Hemligt Recept: Vår Berömda Tres Leches',
    },
    excerpt: {
      en: 'For the first time ever, we are sharing the recipe behind our most beloved dessert. Learn the techniques passed down through three generations.',
      es: 'Por primera vez, compartimos la receta detras de nuestro postre mas querido. Aprende las tecnicas transmitidas por tres generaciones.',
      it: 'Per la prima volta in assoluto, condividiamo la ricetta del nostro dessert più amato. Impara le tecniche tramandate attraverso tre generazioni.',
      de: 'Zum ersten Mal teilen wir das Rezept hinter unserem beliebtesten Dessert. Lernen Sie die Techniken, die über drei Generationen weitergegeben wurden.',
      fr: 'Pour la première fois, nous partageons la recette de notre dessert le plus apprécié. Apprenez les techniques transmises sur trois générations.',
      sv: 'För första gången någonsin delar vi receptet bakom vår mest älskade dessert. Lär dig teknikerna som förts vidare genom tre generationer.',
    },
    category: 'recipes',
    author: 'Ana Maria Solis',
    date: '2024-06-10',
    readTime: 8,
  },
  {
    id: '3',
    title: {
      en: 'Coffee Origins: From Costa Rican Farms',
      es: 'Origenes del Cafe: Desde Fincas Costarricenses',
      it: 'Origini del Caffè: Dalle Fattorie Costaricane',
      de: 'Kaffeeherkunft: Von Costa-Ricanischen Farmen',
      fr: 'Origines du Café : Des Fermes Costaricaines',
      sv: 'Kaffets Ursprung: Från Costaricanska Gårdar',
    },
    excerpt: {
      en: 'Take a journey with us to the highlands of Tarrazu, where we source our premium coffee beans. Meet the farmers who make it all possible.',
      es: 'Acompananos en un viaje a las tierras altas de Tarrazu, donde obtenemos nuestros granos de cafe premium. Conoce a los agricultores que lo hacen posible.',
      it: 'Fai un viaggio con noi verso gli altipiani di Tarrazu, dove troviamo i nostri chicchi di caffè premium. Incontra gli agricoltori che rendono tutto possibile.',
      de: 'Begleiten Sie uns auf eine Reise in die Hochebenen von Tarrazu, wo wir unsere Premium-Kaffeebohnen beziehen. Treffen Sie die Bauern, die dies alles möglich machen.',
      fr: 'Faites un voyage avec nous dans les hautes terres de Tarrazu, où nous nous approvisionnons en grains de café premium. Rencontrez les agriculteurs qui rendent tout cela possible.',
      sv: 'Ta med oss på en resa till högländerna i Tarrazu, där vi får våra premium kaffebönor. Möt bönderna som gör allt detta möjligt.',
    },
    category: 'tips',
    author: 'Roberto Vargas',
    date: '2024-06-05',
    readTime: 6,
  },
  {
    id: '4',
    title: {
      en: 'Holiday Hours Announcement',
      es: 'Anuncio de Horarios de Feriados',
      it: 'Annuncio Orari Festivi',
      de: 'Ankündigung der Feiertagsöffnungszeiten',
      fr: 'Annonce des Horaires de Vacances',
      sv: 'Meddelande om Helgöppettider',
    },
    excerpt: {
      en: 'Planning your holiday visits? Here are our special operating hours for the upcoming holiday season. We will be open most days to serve you!',
      es: 'Planificando tus visitas de vacaciones? Aqui estan nuestros horarios especiales para la temporada de feriados. Estaremos abiertos la mayoria de los dias para atenderte!',
      it: 'Stai pianificando le tue visite durante le vacanze? Ecco i nostri orari speciali per la stagione festiva. Saremo aperti la maggior parte dei giorni per servirti!',
      de: 'Planen Sie Ihre Urlaubsbesuche? Hier sind unsere speziellen Öffnungszeiten für die bevorstehende Ferienzeit. Wir haben an den meisten Tagen geöffnet, um Sie zu bedienen!',
      fr: 'Vous planifiez vos visites de vacances ? Voici nos horaires spéciaux pour la saison des fêtes. Nous serons ouverts la plupart des jours pour vous servir !',
      sv: 'Planerar du dina semesterbesök? Här är våra speciella öppettider för den kommande högtidssäsongen. Vi kommer vara öppna de flesta dagar för att betjäna dig!',
    },
    category: 'news',
    author: 'Carlos Rodriguez',
    date: '2024-05-28',
    readTime: 2,
  },
  {
    id: '5',
    title: {
      en: 'Behind the Scenes: A Day at Cafe 1973',
      es: 'Detras de Camaras: Un Dia en Cafe 1973',
      it: 'Dietro le Quinte: Una Giornata al Cafe 1973',
      de: 'Hinter den Kulissen: Ein Tag im Cafe 1973',
      fr: 'Dans les Coulisses : Une Journée au Cafe 1973',
      sv: 'Bakom Kulisserna: En Dag på Cafe 1973',
    },
    excerpt: {
      en: 'Ever wondered what happens before we open our doors? Join us for an exclusive look at our morning routines, from baking fresh bread to brewing the perfect cup.',
      es: 'Alguna vez te preguntaste que sucede antes de abrir nuestras puertas? Acompananos en una mirada exclusiva a nuestras rutinas matutinas, desde hornear pan fresco hasta preparar la taza perfecta.',
      it: 'Ti sei mai chiesto cosa succede prima che apriamo le nostre porte? Unisciti a noi per uno sguardo esclusivo alle nostre routine mattutine, dalla cottura del pane fresco alla preparazione della tazza perfetta.',
      de: 'Haben Sie sich jemals gefragt, was passiert, bevor wir unsere Türen öffnen? Begleiten Sie uns für einen exklusiven Einblick in unsere Morgenroutinen, vom Backen frischen Brotes bis zum Brühen der perfekten Tasse.',
      fr: 'Vous êtes-vous déjà demandé ce qui se passe avant que nous ouvrions nos portes ? Rejoignez-nous pour un aperçu exclusif de nos routines matinales, de la cuisson du pain frais à la préparation de la tasse parfaite.',
      sv: 'Har du någonsin undrat vad som händer innan vi öppnar våra dörrar? Följ med oss för en exklusiv inblick i våra morgonrutiner, från att baka färskt bröd till att brygga den perfekta koppen.',
    },
    category: 'news',
    author: 'Maria Rodriguez',
    date: '2024-05-20',
    readTime: 5,
  },
  {
    id: '6',
    title: {
      en: 'Perfect Coffee Brewing at Home',
      es: 'Preparacion Perfecta de Cafe en Casa',
      it: 'Preparazione Perfetta del Caffè a Casa',
      de: 'Perfekte Kaffeezubereitung zu Hause',
      fr: 'Préparation Parfaite du Café à la Maison',
      sv: 'Perfekt Kaffebrygning Hemma',
    },
    excerpt: {
      en: 'Master the art of brewing cafe-quality coffee at home with these expert tips from our head barista. Equipment, techniques, and common mistakes to avoid.',
      es: 'Domina el arte de preparar cafe de calidad de cafeteria en casa con estos consejos expertos de nuestro barista principal. Equipos, tecnicas y errores comunes que evitar.',
      it: 'Padroneggia l\'arte di preparare caffè di qualità da bar a casa con questi consigli esperti dal nostro capo barista. Attrezzature, tecniche e errori comuni da evitare.',
      de: 'Meistern Sie die Kunst, Kaffee in Café-Qualität zu Hause zu brühen, mit diesen Expertentipps unseres Chefbaristas. Ausrüstung, Techniken und häufige Fehler, die Sie vermeiden sollten.',
      fr: 'Maîtrisez l\'art de préparer un café de qualité café à la maison avec ces conseils d\'experts de notre chef barista. Équipement, techniques et erreurs courantes à éviter.',
      sv: 'Bemästra konsten att brygga kaffe av kaféskvalitet hemma med dessa experttips från vår huvudbarista. Utrustning, tekniker och vanliga misstag att undvika.',
    },
    category: 'tips',
    author: 'Roberto Vargas',
    date: '2024-05-15',
    readTime: 7,
  },
  {
    id: '7',
    title: {
      en: 'Live Music Fridays Return!',
      es: 'Regresan los Viernes de Musica en Vivo!',
      it: 'Tornano i Venerdì di Musica dal Vivo!',
      de: 'Live-Musik-Freitage Kehren Zurück!',
      fr: 'Les Vendredis Musique Live Reviennent !',
      sv: 'Livemusikvredagar Återvänder!',
    },
    excerpt: {
      en: 'We are thrilled to announce the return of our popular Live Music Fridays. Join us every Friday evening for local artists, great coffee, and amazing vibes.',
      es: 'Estamos emocionados de anunciar el regreso de nuestros populares Viernes de Musica en Vivo. Acompananos cada viernes por la noche con artistas locales, buen cafe y un ambiente increible.',
      it: 'Siamo entusiasti di annunciare il ritorno dei nostri popolari Venerdì di Musica dal Vivo. Unisciti a noi ogni venerdì sera con artisti locali, ottimo caffè e atmosfera fantastica.',
      de: 'Wir freuen uns, die Rückkehr unserer beliebten Live-Musik-Freitage ankündigen zu können. Besuchen Sie uns jeden Freitagabend mit lokalen Künstlern, großartigem Kaffee und toller Atmosphäre.',
      fr: 'Nous sommes ravis d\'annoncer le retour de nos populaires Vendredis Musique Live. Rejoignez-nous chaque vendredi soir avec des artistes locaux, un excellent café et une ambiance incroyable.',
      sv: 'Vi är glada att kunna meddela att våra populära Livemusikvredagar är tillbaka. Följ med oss varje fredagskväll med lokala artister, gott kaffe och fantastisk stämning.',
    },
    category: 'events',
    author: 'Carlos Rodriguez',
    date: '2024-05-10',
    readTime: 3,
  },
  {
    id: '8',
    title: {
      en: 'Traditional Pan de Yuca Recipe',
      es: 'Receta Tradicional de Pan de Yuca',
      it: 'Ricetta Tradizionale del Pan de Yuca',
      de: 'Traditionelles Pan de Yuca Rezept',
      fr: 'Recette Traditionnelle du Pan de Yuca',
      sv: 'Traditionellt Pan de Yuca Recept',
    },
    excerpt: {
      en: 'Learn how to make authentic Costa Rican pan de yuca with this step-by-step guide. Crispy on the outside, soft and cheesy on the inside.',
      es: 'Aprende a hacer autentico pan de yuca costarricense con esta guia paso a paso. Crujiente por fuera, suave y con queso por dentro.',
      it: 'Impara a fare l\'autentico pan de yuca costaricano con questa guida passo-passo. Croccante fuori, morbido e formaggio dentro.',
      de: 'Lernen Sie, wie man authentisches costa-ricanisches Pan de Yuca mit dieser Schritt-für-Schritt-Anleitung zubereitet. Knusprig außen, weich und käsig innen.',
      fr: 'Apprenez à faire l\'authentique pan de yuca costaricain avec ce guide étape par étape. Croustillant à l\'extérieur, moelleux et fromage à l\'intérieur.',
      sv: 'Lär dig att göra autentisk costaricansk pan de yuca med denna steg-för-steg-guide. Krispig utvändigt, mjuk och ostig invändigt.',
    },
    category: 'recipes',
    author: 'Ana Maria Solis',
    date: '2024-05-05',
    readTime: 6,
  },
];

// Categories for filtering
const categories: Category[] = [
  { id: 'all', label: content.categories.all },
  { id: 'news', label: content.categories.news },
  { id: 'recipes', label: content.categories.recipes },
  { id: 'events', label: content.categories.events },
  { id: 'tips', label: content.categories.tips },
];

// Local storage key
const STORAGE_KEY = 'cafe1973_blog_posts';

export const Blog: React.FC = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize posts from localStorage or use defaults
    const storedPosts = localStorage.getItem(STORAGE_KEY);
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch {
        setPosts(defaultBlogPosts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBlogPosts));
      }
    } else {
      setPosts(defaultBlogPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBlogPosts));
    }
  }, []);

  // Helper function to get localized text
  const getText = (textObj: { en: string; es: string; it: string; de: string; fr: string; sv: string }) => {
    return textObj[language as keyof typeof textObj] || textObj.en;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: { [key: string]: string } = {
      en: 'en-US',
      es: 'es-ES',
      it: 'it-IT',
      de: 'de-DE',
      fr: 'fr-FR',
      sv: 'sv-SE',
    };
    return date.toLocaleDateString(localeMap[language] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const cat = content.categories[category as keyof typeof content.categories];
    return cat ? getText(cat) : category;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-100 text-blue-700',
      recipes: 'bg-orange-100 text-orange-700',
      events: 'bg-purple-100 text-purple-700',
      tips: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Filter posts by category
  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  // Get featured post
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured || selectedCategory !== 'all');

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would call an API
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-20">
      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-forest to-forest/90 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-sand rounded-full" />
          <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-sand rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-sand rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full mb-6">
            <Newspaper className="w-10 h-10 text-sand" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {getText(content.hero.title)}
          </h1>
          <p className="text-lg text-sand/90 tracking-wide">
            {getText(content.hero.subtitle)}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && (
        <section className="px-6 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-sand text-forest text-xs font-semibold rounded-full">
                {getText(content.featured)}
              </span>
            </div>
            <div className="bg-[#faf8f3] rounded-3xl overflow-hidden shadow-soft animate-fade-in">
              {/* Image placeholder */}
              <div className="h-48 sm:h-64 bg-gradient-to-br from-sand/40 to-sand/20 flex items-center justify-center">
                <Newspaper className="w-16 h-16 text-forest/20" />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(featuredPost.category)}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {getCategoryLabel(featuredPost.category)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-forest/60">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.date)}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
                  {getText(featuredPost.title)}
                </h2>
                <p className="text-forest/70 leading-relaxed mb-6">
                  {getText(featuredPost.excerpt)}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-forest/60">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} {getText(content.minRead)}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all active:scale-[0.98]">
                    {getText(content.readMore)}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="px-6 py-8 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] ${
                  selectedCategory === category.id
                    ? 'bg-forest text-white shadow-md'
                    : 'bg-white text-forest/70 hover:bg-sand/30 border border-sand/30'
                }`}
              >
                {getText(category.label)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-6 py-8 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-sand/40 to-sand/20 flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-forest/20" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-forest mb-2 line-clamp-2">
                    {getText(post.title)}
                  </h3>
                  <p className="text-sm text-forest/60 leading-relaxed mb-4 line-clamp-3">
                    {getText(post.excerpt)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-sand/30">
                    <div className="flex items-center gap-2 text-xs text-forest/50">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-forest/50">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime} {getText(content.minRead)}
                    </div>
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sand/20 text-forest rounded-xl font-medium hover:bg-sand/30 transition-all active:scale-[0.98]">
                    {getText(content.readMore)}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {regularPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sand/30 rounded-full mb-4">
                <Newspaper className="w-8 h-8 text-forest/40" />
              </div>
              <p className="text-forest/60">
                {getText(content.emptyState)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16 bg-forest">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sand/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-sand" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {getText(content.newsletter.title)}
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            {getText(content.newsletter.description)}
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={getText(content.newsletter.placeholder)}
              className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-sand focus:ring-2 focus:ring-sand/30"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sand text-forest rounded-full font-medium hover:bg-sand/90 transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              {getText(content.newsletter.button)}
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-sand font-medium animate-fade-in">
              {getText(content.newsletter.success)}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-forest/60">
            &copy; {new Date().getFullYear()} Cafe 1973.{' '}
            {getText(content.footer)}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Blog;
