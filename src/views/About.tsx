/**
 * Cafe 1973 - About Us Page
 * Our Story, Values, Team, and Promise
 * Mobile-first design with bilingual support
 */
import React, { useEffect } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Heart,
  Award,
  Users,
  Leaf,
  Clock,
  MapPin,
  ChevronRight,
  Coffee,
  Sparkles,
  History,
  Target,
  HandHeart,
} from 'lucide-react';

// Content translations
const content = {
  hero: {
    title: { en: 'Our Story', es: 'Nuestra Historia', it: 'La Nostra Storia', de: 'Unsere Geschichte', fr: 'Notre Histoire', sv: 'Vår Historia' },
    subtitle: { en: 'A legacy of passion and flavor', es: 'Un legado de pasion y sabor', it: 'Un\'eredità di passione e sapore', de: 'Ein Erbe von Leidenschaft und Geschmack', fr: 'Un héritage de passion et de saveur', sv: 'Ett arv av passion och smak' },
  },
  history: {
    title: { en: 'Our History', es: 'Nuestra Historia', it: 'La Nostra Storia', de: 'Unsere Geschichte', fr: 'Notre Histoire', sv: 'Vår Historia' },
    paragraph1: {
      en: 'Founded in 1973 in the heart of Moravia, Costa Rica, Cafe 1973 began as a small family bakery with a big dream: to bring the finest artisan breads and pastries to our community.',
      es: 'Fundado en 1973 en el corazon de Moravia, Costa Rica, Cafe 1973 comenzo como una pequena panaderia familiar con un gran sueno: llevar los mejores panes y pasteles artesanales a nuestra comunidad.',
      it: 'Fondato nel 1973 nel cuore di Moravia, Costa Rica, Cafe 1973 è iniziato come una piccola panetteria familiare con un grande sogno: portare i migliori pani e dolci artigianali alla nostra comunità.',
      de: 'Gegründet 1973 im Herzen von Moravia, Costa Rica, begann Cafe 1973 als kleine Familienbäckerei mit einem großen Traum: die feinsten handwerklichen Brote und Gebäcke in unsere Gemeinde zu bringen.',
      fr: 'Fondé en 1973 au cœur de Moravia, Costa Rica, Cafe 1973 a commencé comme une petite boulangerie familiale avec un grand rêve : apporter les meilleurs pains et pâtisseries artisanaux à notre communauté.',
      sv: 'Grundat 1973 i hjärtat av Moravia, Costa Rica, började Cafe 1973 som ett litet familjebageri med en stor dröm: att ge det finaste hantverksbrödet och bakverken till vår gemenskap.',
    },
    paragraph2: {
      en: 'For over 50 years, three generations of our family have dedicated themselves to perfecting traditional recipes while embracing innovation. What started as a humble bakery has grown into a beloved gathering place for neighbors, friends, and visitors from around the world.',
      es: 'Durante mas de 50 anos, tres generaciones de nuestra familia se han dedicado a perfeccionar recetas tradicionales mientras abrazan la innovacion. Lo que comenzo como una humilde panaderia se ha convertido en un querido lugar de encuentro para vecinos, amigos y visitantes de todo el mundo.',
      it: 'Per oltre 50 anni, tre generazioni della nostra famiglia si sono dedicate a perfezionare ricette tradizionali abbracciando l\'innovazione. Ciò che è iniziato come una umile panetteria è cresciuto fino a diventare un amato luogo di ritrovo per vicini, amici e visitatori da tutto il mondo.',
      de: 'Seit über 50 Jahren widmen sich drei Generationen unserer Familie der Perfektionierung traditioneller Rezepte und gleichzeitig der Innovation. Was als bescheidene Bäckerei begann, ist zu einem beliebten Treffpunkt für Nachbarn, Freunde und Besucher aus aller Welt geworden.',
      fr: 'Depuis plus de 50 ans, trois générations de notre famille se sont consacrées à perfectionner les recettes traditionnelles tout en embrassant l\'innovation. Ce qui a commencé comme une humble boulangerie est devenu un lieu de rencontre bien-aimé pour les voisins, les amis et les visiteurs du monde entier.',
      sv: 'I över 50 år har tre generationer av vår familj ägnat sig åt att förfina traditionella recept samtidigt som de omfamnar innovation. Det som började som ett ödmjukt bageri har vuxit till en älskad mötesplats för grannar, vänner och besökare från hela världen.',
    },
    paragraph3: {
      en: 'Today, we continue to honor our roots while looking toward the future, always staying true to the values that have made us who we are.',
      es: 'Hoy, continuamos honrando nuestras raices mientras miramos hacia el futuro, siempre fieles a los valores que nos han hecho quienes somos.',
      it: 'Oggi continuiamo a onorare le nostre radici guardando al futuro, rimanendo sempre fedeli ai valori che ci hanno reso ciò che siamo.',
      de: 'Heute ehren wir weiterhin unsere Wurzeln und blicken in die Zukunft, immer treu den Werten, die uns zu dem gemacht haben, was wir sind.',
      fr: 'Aujourd\'hui, nous continuons à honorer nos racines tout en regardant vers l\'avenir, en restant toujours fidèles aux valeurs qui ont fait de nous ce que nous sommes.',
      sv: 'Idag fortsätter vi att hedra våra rötter samtidigt som vi ser mot framtiden, alltid trogna de värderingar som har gjort oss till vilka vi är.',
    },
  },
  values: {
    title: { en: 'Our Values', es: 'Nuestros Valores', it: 'I Nostri Valori', de: 'Unsere Werte', fr: 'Nos Valeurs', sv: 'Våra Värderingar' },
    items: [
      {
        icon: Award,
        title: { en: 'Quality', es: 'Calidad', it: 'Qualità', de: 'Qualität', fr: 'Qualité', sv: 'Kvalitet' },
        description: {
          en: 'We never compromise on ingredients. Every item is crafted with the finest local and imported ingredients.',
          es: 'Nunca comprometemos los ingredientes. Cada articulo esta elaborado con los mejores ingredientes locales e importados.',
          it: 'Non scendiamo mai a compromessi sugli ingredienti. Ogni articolo è realizzato con i migliori ingredienti locali e importati.',
          de: 'Wir machen bei Zutaten keine Kompromisse. Jedes Produkt wird mit den feinsten lokalen und importierten Zutaten hergestellt.',
          fr: 'Nous ne faisons jamais de compromis sur les ingrédients. Chaque article est fabriqué avec les meilleurs ingrédients locaux et importés.',
          sv: 'Vi kompromissar aldrig med ingredienser. Varje produkt tillverkas med de finaste lokala och importerade ingredienserna.',
        },
      },
      {
        icon: History,
        title: { en: 'Tradition', es: 'Tradicion', it: 'Tradizione', de: 'Tradition', fr: 'Tradition', sv: 'Tradition' },
        description: {
          en: 'Our recipes have been passed down through generations, preserving the authentic flavors that our customers love.',
          es: 'Nuestras recetas han sido transmitidas a traves de generaciones, preservando los sabores autenticos que nuestros clientes aman.',
          it: 'Le nostre ricette sono state tramandate di generazione in generazione, preservando i sapori autentici che i nostri clienti amano.',
          de: 'Unsere Rezepte wurden über Generationen weitergegeben und bewahren die authentischen Aromen, die unsere Kunden lieben.',
          fr: 'Nos recettes ont été transmises de génération en génération, préservant les saveurs authentiques que nos clients adorent.',
          sv: 'Våra recept har gått i arv genom generationer och bevarar de autentiska smaker som våra kunder älskar.',
        },
      },
      {
        icon: Users,
        title: { en: 'Community', es: 'Comunidad', it: 'Comunità', de: 'Gemeinschaft', fr: 'Communauté', sv: 'Gemenskap' },
        description: {
          en: 'We are proud to be part of the Moravia community, supporting local suppliers and giving back whenever possible.',
          es: 'Estamos orgullosos de ser parte de la comunidad de Moravia, apoyando a proveedores locales y retribuyendo siempre que sea posible.',
          it: 'Siamo orgogliosi di far parte della comunità di Moravia, sostenendo i fornitori locali e restituendo quando possibile.',
          de: 'Wir sind stolz darauf, Teil der Gemeinschaft von Moravia zu sein, lokale Lieferanten zu unterstützen und wann immer möglich etwas zurückzugeben.',
          fr: 'Nous sommes fiers de faire partie de la communauté de Moravia, en soutenant les fournisseurs locaux et en redonnant autant que possible.',
          sv: 'Vi är stolta över att vara en del av Moravia-gemenskapen, stödja lokala leverantörer och ge tillbaka när det är möjligt.',
        },
      },
      {
        icon: Leaf,
        title: { en: 'Sustainability', es: 'Sostenibilidad', it: 'Sostenibilità', de: 'Nachhaltigkeit', fr: 'Durabilité', sv: 'Hållbarhet' },
        description: {
          en: 'We are committed to environmentally responsible practices, from sourcing to packaging.',
          es: 'Estamos comprometidos con practicas ambientalmente responsables, desde el abastecimiento hasta el empaque.',
          it: 'Siamo impegnati in pratiche ambientalmente responsabili, dall\'approvvigionamento all\'imballaggio.',
          de: 'Wir sind umweltverantwortlichen Praktiken verpflichtet, von der Beschaffung bis zur Verpackung.',
          fr: 'Nous nous engageons à des pratiques respectueuses de l\'environnement, de l\'approvisionnement à l\'emballage.',
          sv: 'Vi är engagerade i miljöansvariga metoder, från inköp till förpackning.',
        },
      },
    ],
  },
  team: {
    title: { en: 'The Team', es: 'El Equipo', it: 'Il Team', de: 'Das Team', fr: 'L\'Équipe', sv: 'Teamet' },
    subtitle: {
      en: 'The passionate people behind every delicious creation',
      es: 'Las personas apasionadas detras de cada deliciosa creacion',
      it: 'Le persone appassionate dietro ogni deliziosa creazione',
      de: 'Die leidenschaftlichen Menschen hinter jeder köstlichen Kreation',
      fr: 'Les personnes passionnées derrière chaque délicieuse création',
      sv: 'De passionerade människorna bakom varje läcker skapelse',
    },
    members: [
      {
        name: 'Maria Rodriguez',
        role: { en: 'Founder & Head Baker', es: 'Fundadora y Panadera Principal', it: 'Fondatrice e Capo Panettiere', de: 'Gründerin & Chefbäckerin', fr: 'Fondatrice et Boulangère en Chef', sv: 'Grundare & Chefbagare' },
        placeholder: true,
      },
      {
        name: 'Carlos Rodriguez',
        role: { en: 'Executive Chef', es: 'Chef Ejecutivo', it: 'Chef Esecutivo', de: 'Chefkoch', fr: 'Chef Exécutif', sv: 'Exekutiv Kock' },
        placeholder: true,
      },
      {
        name: 'Ana Maria Solis',
        role: { en: 'Pastry Chef', es: 'Chef Pastelera', it: 'Chef Pasticcera', de: 'Konditormeisterin', fr: 'Chef Pâtissière', sv: 'Konditoriechef' },
        placeholder: true,
      },
      {
        name: 'Roberto Vargas',
        role: { en: 'Coffee Master', es: 'Maestro del Cafe', it: 'Maestro del Caffè', de: 'Kaffeemeister', fr: 'Maître du Café', sv: 'Kaffemästare' },
        placeholder: true,
      },
    ],
  },
  promise: {
    title: { en: 'Our Promise', es: 'Nuestra Promesa', it: 'La Nostra Promessa', de: 'Unser Versprechen', fr: 'Notre Promesse', sv: 'Vårt Löfte' },
    items: [
      {
        icon: Sparkles,
        title: { en: 'Quality Ingredients', es: 'Ingredientes de Calidad', it: 'Ingredienti di Qualità', de: 'Qualitätszutaten', fr: 'Ingrédients de Qualité', sv: 'Kvalitetsingredienser' },
        description: {
          en: 'We source only the finest ingredients - from locally grown coffee beans to imported European butter.',
          es: 'Solo utilizamos los mejores ingredientes - desde granos de cafe cultivados localmente hasta mantequilla europea importada.',
          it: 'Utilizziamo solo i migliori ingredienti - dai chicchi di caffè coltivati localmente al burro europeo importato.',
          de: 'Wir beziehen nur die feinsten Zutaten - von lokal angebauten Kaffeebohnen bis zu importierter europäischer Butter.',
          fr: 'Nous n\'utilisons que les meilleurs ingrédients - des grains de café cultivés localement au beurre européen importé.',
          sv: 'Vi använder endast de finaste ingredienserna - från lokalt odlade kaffebönor till importerat europeiskt smör.',
        },
      },
      {
        icon: Clock,
        title: { en: 'Fresh Daily', es: 'Fresco Diariamente', it: 'Fresco Ogni Giorno', de: 'Täglich Frisch', fr: 'Frais Quotidiennement', sv: 'Färskt Dagligen' },
        description: {
          en: 'Our bakers arrive before dawn to ensure every item is freshly made each morning.',
          es: 'Nuestros panaderos llegan antes del amanecer para asegurar que cada articulo sea fresco cada manana.',
          it: 'I nostri panettieri arrivano prima dell\'alba per garantire che ogni articolo sia fresco ogni mattina.',
          de: 'Unsere Bäcker kommen vor der Morgendämmerung, um sicherzustellen, dass jedes Produkt jeden Morgen frisch hergestellt wird.',
          fr: 'Nos boulangers arrivent avant l\'aube pour s\'assurer que chaque article est fraîchement préparé chaque matin.',
          sv: 'Våra bagare kommer före gryningen för att säkerställa att varje produkt är nybakad varje morgon.',
        },
      },
      {
        icon: HandHeart,
        title: { en: 'Made with Love', es: 'Hecho con Amor', it: 'Fatto con Amore', de: 'Mit Liebe Gemacht', fr: 'Fait avec Amour', sv: 'Gjort med Kärlek' },
        description: {
          en: 'Every pastry, every loaf, every cup of coffee is prepared with care and passion.',
          es: 'Cada pastel, cada barra de pan, cada taza de cafe se prepara con cuidado y pasion.',
          it: 'Ogni dolce, ogni pagnotta, ogni tazza di caffè è preparata con cura e passione.',
          de: 'Jedes Gebäck, jeder Laib, jede Tasse Kaffee wird mit Sorgfalt und Leidenschaft zubereitet.',
          fr: 'Chaque pâtisserie, chaque pain, chaque tasse de café est préparée avec soin et passion.',
          sv: 'Varje bakverk, varje bröd, varje kopp kaffe är förberedd med omsorg och passion.',
        },
      },
      {
        icon: Target,
        title: { en: 'Consistent Excellence', es: 'Excelencia Constante', it: 'Eccellenza Costante', de: 'Konstante Exzellenz', fr: 'Excellence Constante', sv: 'Konsekvent Excellens' },
        description: {
          en: 'Whether its your first visit or your thousandth, you can expect the same exceptional quality every time.',
          es: 'Ya sea tu primera visita o la milesima, puedes esperar la misma calidad excepcional cada vez.',
          it: 'Che sia la tua prima visita o la millesima, puoi aspettarti la stessa qualità eccezionale ogni volta.',
          de: 'Ob es Ihr erster oder Ihr tausendster Besuch ist, Sie können jedes Mal die gleiche außergewöhnliche Qualität erwarten.',
          fr: 'Que ce soit votre première visite ou votre millième, vous pouvez vous attendre à la même qualité exceptionnelle à chaque fois.',
          sv: 'Oavsett om det är ditt första besök eller ditt tusende, kan du förvänta dig samma exceptionella kvalitet varje gång.',
        },
      },
    ],
  },
  location: {
    title: { en: 'Visit Us', es: 'Visitanos', it: 'Visitaci', de: 'Besuchen Sie Uns', fr: 'Visitez-Nous', sv: 'Besök Oss' },
    description: {
      en: 'We would love to welcome you to our bakery. Come experience the warmth and flavors of Cafe 1973.',
      es: 'Nos encantaria darte la bienvenida a nuestra panaderia. Ven a experimentar la calidez y los sabores de Cafe 1973.',
      it: 'Ci piacerebbe darti il benvenuto nella nostra panetteria. Vieni a sperimentare il calore e i sapori di Cafe 1973.',
      de: 'Wir würden uns freuen, Sie in unserer Bäckerei willkommen zu heißen. Erleben Sie die Wärme und Aromen von Cafe 1973.',
      fr: 'Nous serions ravis de vous accueillir dans notre boulangerie. Venez découvrir la chaleur et les saveurs de Cafe 1973.',
      sv: 'Vi skulle älska att välkomna dig till vårt bageri. Kom och upplev värmen och smakerna hos Cafe 1973.',
    },
    cta: { en: 'Get Directions', es: 'Como Llegar', it: 'Ottieni Indicazioni', de: 'Wegbeschreibung', fr: 'Obtenir l\'Itinéraire', sv: 'Få Vägbeskrivning' },
  },
};

// UI translations for interface strings
const uiTranslations = {
  en: { since1973: 'Since 1973', founded: 'Founded', years: 'Years', generations: 'Generations', viewMenu: 'View Menu', allRights: 'All rights reserved.' },
  es: { since1973: 'Desde 1973', founded: 'Fundado', years: 'Años', generations: 'Generaciones', viewMenu: 'Ver Menú', allRights: 'Todos los derechos reservados.' },
  it: { since1973: 'Dal 1973', founded: 'Fondato', years: 'Anni', generations: 'Generazioni', viewMenu: 'Vedi Menu', allRights: 'Tutti i diritti riservati.' },
  de: { since1973: 'Seit 1973', founded: 'Gegründet', years: 'Jahre', generations: 'Generationen', viewMenu: 'Menü Ansehen', allRights: 'Alle Rechte vorbehalten.' },
  fr: { since1973: 'Depuis 1973', founded: 'Fondé', years: 'Années', generations: 'Générations', viewMenu: 'Voir le Menu', allRights: 'Tous droits réservés.' },
  sv: { since1973: 'Sedan 1973', founded: 'Grundat', years: 'År', generations: 'Generationer', viewMenu: 'Se Meny', allRights: 'Alla rättigheter förbehållna.' },
};

export const About: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper function to get localized text with fallback to English
  const getText = (textObj: { en: string; es: string; it?: string; de?: string; fr?: string; sv?: string }) => {
    const lang = language as keyof typeof textObj;
    return textObj[lang] || textObj.en;
  };

  // Get UI translations for current language
  const ui = uiTranslations[language as keyof typeof uiTranslations] || uiTranslations.en;

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-20">
      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-forest to-forest/90 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-sand rounded-full" />
          <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-sand rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-sand rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full mb-6">
            <Coffee className="w-10 h-10 text-sand" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {getText(content.hero.title)}
          </h1>
          <p className="text-lg text-sand/90 tracking-wide">
            {getText(content.hero.subtitle)}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm">{ui.since1973}</span>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-full mb-4">
              <History className="w-7 h-7 text-forest" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              {getText(content.history.title)}
            </h2>
          </div>

          <div className="space-y-6 text-forest/80 leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
            <p>{getText(content.history.paragraph1)}</p>
            <p>{getText(content.history.paragraph2)}</p>
            <p>{getText(content.history.paragraph3)}</p>
          </div>

          {/* Timeline highlight */}
          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">1973</div>
              <div className="text-sm text-forest/60">{ui.founded}</div>
            </div>
            <div className="w-px h-12 bg-sand hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">50+</div>
              <div className="text-sm text-forest/60">{ui.years}</div>
            </div>
            <div className="w-px h-12 bg-sand hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-forest">3</div>
              <div className="text-sm text-forest/60">{ui.generations}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              {getText(content.values.title)}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.values.items.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-soft animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-sand/30 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-forest" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest mb-2">
                        {getText(value.title)}
                      </h3>
                      <p className="text-sm text-forest/70 leading-relaxed">
                        {getText(value.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-full mb-4">
              <Users className="w-7 h-7 text-forest" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.team.title)}
            </h2>
            <p className="text-forest/60 max-w-xl mx-auto">
              {getText(content.team.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {content.team.members.map((member, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Placeholder photo */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-sand/40 to-sand/20 flex items-center justify-center border-2 border-sand/30">
                  <span className="text-2xl font-bold text-forest/40">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-forest text-sm">{member.name}</h3>
                <p className="text-xs text-forest/60 mt-1">{getText(member.role)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="px-6 py-16 bg-forest">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {getText(content.promise.title)}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.promise.items.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-sand/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-sand" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {getText(item.title)}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {getText(item.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Preview Section */}
      <section className="px-6 py-16 bg-[#faf8f3]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-soft animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-forest rounded-full mb-6">
              <MapPin className="w-8 h-8 text-sand" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-4">
              {getText(content.location.title)}
            </h2>
            <p className="text-forest/70 leading-relaxed max-w-xl mx-auto mb-8">
              {getText(content.location.description)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all active:scale-[0.98]"
              >
                {getText(content.location.cta)}
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-forest text-forest rounded-full font-medium hover:bg-forest hover:text-white transition-all active:scale-[0.98]"
              >
                {ui.viewMenu}
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-forest/60">
            &copy; {new Date().getFullYear()} Cafe 1973. {ui.allRights}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default About;
