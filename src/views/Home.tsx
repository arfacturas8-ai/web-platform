/**
 * Café 1973 - Home Page
 * Dynamic content from Content Manager
 * Mobile-first landing page
 */
import React, { useEffect, useState } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useSettings } from '@/hooks/useSettings';
import { trackPageView } from '@/utils/analytics';
import { getImageUrl } from '@/utils/constants';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import * as LucideIcons from 'lucide-react';
import {
  Coffee,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Star,
  ChevronRight,
  Award,
  X,
} from 'lucide-react';

// Translations for all supported languages
const translations = {
  reviews: {
    en: 'reviews',
    es: 'reseñas',
    it: 'recensioni',
    de: 'Bewertungen',
    fr: 'avis',
    sv: 'recensioner',
  },
  whyChooseUs: {
    en: 'Why Choose Us?',
    es: '¿Por qué elegirnos?',
    it: 'Perché sceglierci?',
    de: 'Warum uns wählen?',
    fr: 'Pourquoi nous choisir?',
    sv: 'Varför välja oss?',
  },
  whatCustomersSay: {
    en: 'What Our Customers Say',
    es: 'Lo que dicen nuestros clientes',
    it: 'Cosa dicono i nostri clienti',
    de: 'Was unsere Kunden sagen',
    fr: 'Ce que disent nos clients',
    sv: 'Vad våra kunder säger',
  },
  gallery: {
    en: 'Gallery',
    es: 'Galería',
    it: 'Galleria',
    de: 'Galerie',
    fr: 'Galerie',
    sv: 'Galleri',
  },
  since1973: {
    en: 'Since 1973',
    es: 'Desde 1973',
    it: 'Dal 1973',
    de: 'Seit 1973',
    fr: 'Depuis 1973',
    sv: 'Sedan 1973',
  },
  familyBusinessText: {
    en: 'For over 50 years, we have been part of the Moravia community. Every day we strive to offer the best coffee and bakery experience, keeping alive the recipes that have accompanied us for generations.',
    es: 'Por más de 50 años, hemos sido parte de la comunidad de Moravia. Cada día nos esforzamos por ofrecer la mejor experiencia de café y repostería, manteniendo vivas las recetas que nos han acompañado por generaciones.',
    it: 'Da oltre 50 anni, siamo parte della comunità di Moravia. Ogni giorno ci impegniamo a offrire la migliore esperienza di caffè e pasticceria, mantenendo vive le ricette che ci accompagnano da generazioni.',
    de: 'Seit über 50 Jahren sind wir Teil der Gemeinschaft von Moravia. Jeden Tag bemühen wir uns, das beste Kaffee- und Bäckereierlebnis zu bieten und die Rezepte am Leben zu erhalten, die uns seit Generationen begleiten.',
    fr: 'Depuis plus de 50 ans, nous faisons partie de la communauté de Moravia. Chaque jour, nous nous efforçons d\'offrir la meilleure expérience de café et de pâtisserie, en gardant vivantes les recettes qui nous accompagnent depuis des générations.',
    sv: 'I över 50 år har vi varit en del av Moravia-samhället. Varje dag strävar vi efter att erbjuda den bästa kaffe- och bageriupplevelsen och hålla recepten levande som har följt oss i generationer.',
  },
  exploreMenu: {
    en: 'Explore Menu',
    es: 'Explorar Menú',
    it: 'Esplora il Menu',
    de: 'Menü erkunden',
    fr: 'Explorer le Menu',
    sv: 'Utforska menyn',
  },
  visitUs: {
    en: 'Visit Us',
    es: 'Visítanos',
    it: 'Visitaci',
    de: 'Besuchen Sie uns',
    fr: 'Visitez-nous',
    sv: 'Besök oss',
  },
  hours: {
    en: 'Hours',
    es: 'Horario',
    it: 'Orari',
    de: 'Öffnungszeiten',
    fr: 'Horaires',
    sv: 'Öppettider',
  },
  mondayFriday: {
    en: 'Monday - Friday',
    es: 'Lunes - Viernes',
    it: 'Lunedì - Venerdì',
    de: 'Montag - Freitag',
    fr: 'Lundi - Vendredi',
    sv: 'Måndag - Fredag',
  },
  saturday: {
    en: 'Saturday',
    es: 'Sábado',
    it: 'Sabato',
    de: 'Samstag',
    fr: 'Samedi',
    sv: 'Lördag',
  },
  sunday: {
    en: 'Sunday',
    es: 'Domingo',
    it: 'Domenica',
    de: 'Sonntag',
    fr: 'Dimanche',
    sv: 'Söndag',
  },
  location: {
    en: 'Location',
    es: 'Ubicación',
    it: 'Posizione',
    de: 'Standort',
    fr: 'Emplacement',
    sv: 'Plats',
  },
  contactUs: {
    en: 'Contact Us',
    es: 'Contáctanos',
    it: 'Contattaci',
    de: 'Kontaktieren Sie uns',
    fr: 'Contactez-nous',
    sv: 'Kontakta oss',
  },
  allRightsReserved: {
    en: 'All rights reserved.',
    es: 'Todos los derechos reservados.',
    it: 'Tutti i diritti riservati.',
    de: 'Alle Rechte vorbehalten.',
    fr: 'Tous droits réservés.',
    sv: 'Alla rättigheter förbehållna.',
  },
};

// Dynamic icon component
const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <Coffee className={className} />;
  return <IconComponent className={className} />;
};

export const Home: React.FC = () => {
  const { language } = useLanguage();
  const { hero, features, promo, testimonials, gallery } = useSiteContent();
  const { data: settings } = useSettings();
  const [promoDismissed, setPromoDismissed] = useState(false);

  useEffect(() => {
    trackPageView('/', 'Home');
  }, []);

  // Get localized text - supports all 6 languages
  const getText = (en?: string | { en: string; es?: string; it?: string; de?: string; fr?: string; sv?: string }, es?: string) => {
    // If first argument is an object with language keys, use it
    if (typeof en === 'object' && en !== null) {
      const translations = en as { en: string; es?: string; it?: string; de?: string; fr?: string; sv?: string };
      return translations[language as keyof typeof translations] || translations.en || '';
    }
    // Spanish returns Spanish if available
    if (language === 'es' && es) return es;
    // All other languages fall back to English (database only has es/en)
    return en || '';
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-20">
      {/* Promo Banner */}
      {promo && !promoDismissed && (
        <div
          className="sticky top-0 z-50 px-4 py-3 flex items-center justify-center gap-4"
          style={{
            backgroundColor: promo.background_color,
            color: promo.text_color,
          }}
        >
          {promo.link ? (
            <Link to={promo.link} className="text-sm font-medium hover:underline">
              {getText(promo.text, promo.text_es)}
            </Link>
          ) : (
            <span className="text-sm font-medium">{getText(promo.text, promo.text_es)}</span>
          )}
          {promo.dismissible && (
            <button
              onClick={() => setPromoDismissed(true)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={hero.image_url && !hero.video_url ? {
          backgroundImage: `url(${getImageUrl(hero.image_url)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Video Background */}
        {hero.video_url && (
          <video
            autoPlay={hero.video_autoplay !== false}
            loop={hero.video_loop !== false}
            muted={hero.video_muted !== false}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={getImageUrl(hero.video_url)} type="video/mp4" />
          </video>
        )}

        {/* Background Overlay */}
        <div className={`absolute inset-0 ${hero.image_url || hero.video_url ? 'bg-black/40' : 'bg-gradient-to-b from-forest/5 to-transparent'}`} />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-12 max-w-xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-forest rounded-full mb-6">
              <Coffee className="w-10 h-10 text-sand" />
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-2 ${hero.image_url || hero.video_url ? 'text-white' : 'text-forest'}`}>
              {getText(hero.title, hero.title_es)}
            </h1>
            <p className={`text-sm tracking-widest uppercase ${hero.image_url || hero.video_url ? 'text-white/80' : 'text-forest/60'}`}>
              {getText(hero.subtitle, hero.subtitle_es)}
            </p>
          </div>

          {/* Tagline */}
          {(hero.tagline || hero.tagline_es) && (
            <p
              className={`text-lg sm:text-xl mb-10 leading-relaxed animate-fade-in ${hero.image_url || hero.video_url ? 'text-white/90' : 'text-forest/80'}`}
              style={{ animationDelay: '100ms' }}
            >
              {getText(hero.tagline, hero.tagline_es)}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            {hero.cta_primary_text && hero.cta_primary_link && (
              <Link
                to={hero.cta_primary_link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all active:scale-[0.98]"
              >
                {getText(hero.cta_primary_text, hero.cta_primary_text_es)}
                <ChevronRight size={18} />
              </Link>
            )}
            {hero.cta_secondary_text && hero.cta_secondary_link && (
              <Link
                to={hero.cta_secondary_link}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 rounded-full font-medium transition-all active:scale-[0.98] ${
                  hero.image_url || hero.video_url
                    ? 'text-white border-white hover:bg-white hover:text-forest'
                    : 'text-forest border-forest hover:bg-forest hover:text-white'
                }`}
              >
                {getText(hero.cta_secondary_text, hero.cta_secondary_text_es)}
              </Link>
            )}
          </div>

          {/* Rating Badge */}
          {settings?.tripadvisor_rating && (
            <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-sand fill-sand" />
                ))}
              </div>
              <span className="text-sm font-medium text-forest">{settings.tripadvisor_rating}</span>
              <span className="text-sm text-forest/60">• 500+ {getText(translations.reviews)}</span>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 rounded-full flex items-start justify-center p-2 ${hero.image_url || hero.video_url ? 'border-white/50' : 'border-forest/30'}`}>
            <div className={`w-1.5 h-3 rounded-full ${hero.image_url || hero.video_url ? 'bg-white/50' : 'bg-forest/30'}`} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest text-center mb-12">
              {getText(translations.whyChooseUs)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="text-center p-6 rounded-2xl bg-[#faf8f3] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/30 rounded-full mb-4 text-forest">
                    <DynamicIcon name={feature.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-forest mb-2">
                    {getText(feature.title, feature.title_es)}
                  </h3>
                  <p className="text-sm text-forest/60 leading-relaxed">
                    {getText(feature.description, feature.description_es)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="px-6 py-16 bg-[#faf8f3]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest text-center mb-12">
              {getText(translations.whatCustomersSay)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    {testimonial.author_image ? (
                      <img
                        src={getImageUrl(testimonial.author_image)}
                        alt={testimonial.author_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-sand/30 flex items-center justify-center text-forest font-bold">
                        {testimonial.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-forest">{testimonial.author_name}</p>
                      {testimonial.source && (
                        <p className="text-xs text-forest/50">{testimonial.source}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= testimonial.rating ? 'text-sand fill-sand' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-forest/70 leading-relaxed">
                    "{getText(testimonial.text, testimonial.text_es)}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest text-center mb-12">
              {getText(translations.gallery)}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.slice(0, 6).map((item) => (
                <div key={item.id} className="aspect-square rounded-2xl overflow-hidden">
                  {item.media_type === 'video' && item.video_url ? (
                    <video
                      src={getImageUrl(item.video_url)}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={getText(item.alt_text, item.alt_text_es)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-forest rounded-3xl p-8 sm:p-12 text-center">
            <Award className="w-12 h-12 text-sand mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {getText(translations.since1973)}
            </h2>
            <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              {getText(translations.familyBusinessText)}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sand text-forest rounded-full font-medium hover:bg-sand/90 transition-all"
            >
              {getText(translations.exploreMenu)}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest text-center mb-12">
            {getText(translations.visitUs)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Hours */}
            <div className="bg-[#faf8f3] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-forest">
                  {getText(translations.hours)}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                {settings?.opening_hours ? (
                  Object.entries(settings.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-forest">
                      <span className="capitalize">{day}</span>
                      <span className="font-medium">{hours.open} - {hours.close}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between text-forest">
                      <span>{getText(translations.mondayFriday)}</span>
                      <span className="font-medium">6:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between text-forest">
                      <span>{getText(translations.saturday)}</span>
                      <span className="font-medium">7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-forest">
                      <span>{getText(translations.sunday)}</span>
                      <span className="font-medium">7:00 AM - 6:00 PM</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#faf8f3] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-forest">
                  {getText(translations.location)}
                </h3>
              </div>
              <p className="text-sm text-forest mb-4">
                {settings?.address || 'Moravia, San José, Costa Rica'}
              </p>
              {/* Navigation Apps */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-forest hover:bg-forest hover:text-white transition-all touch-scale"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Google Maps
                </a>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(settings?.waze_address || settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-forest hover:bg-forest hover:text-white transition-all touch-scale"
                >
                  Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-8">
            {getText(translations.contactUs)}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {settings?.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-soft text-forest hover:shadow-card transition-all"
              >
                <Phone size={18} />
                <span className="font-medium">{settings.contact_phone}</span>
              </a>
            )}
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-forest/60">
            © {new Date().getFullYear()} {settings?.restaurant_name || 'Café 1973'}. {getText(translations.allRightsReserved)}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Home;
