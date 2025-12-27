/**
 * Café 1973 - Home Page
 * Bisqueria-inspired design with Cafe 1973 brand colors
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
  ChevronDown,
  Award,
  X,
  ArrowRight,
  Mail,
  Heart,
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
    en: 'Our Gallery',
    es: 'Nuestra Galería',
    it: 'La Nostra Galleria',
    de: 'Unsere Galerie',
    fr: 'Notre Galerie',
    sv: 'Vårt Galleri',
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
  viewAll: {
    en: 'View All',
    es: 'Ver Todo',
    it: 'Vedi Tutto',
    de: 'Alle Ansehen',
    fr: 'Voir Tout',
    sv: 'Se Alla',
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
    en: 'Opening Hours',
    es: 'Horario de Atención',
    it: 'Orari di Apertura',
    de: 'Öffnungszeiten',
    fr: 'Heures d\'Ouverture',
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
    en: 'Our Location',
    es: 'Nuestra Ubicación',
    it: 'La Nostra Posizione',
    de: 'Unser Standort',
    fr: 'Notre Emplacement',
    sv: 'Vår Plats',
  },
  contactUs: {
    en: 'Get In Touch',
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
  scrollDown: {
    en: 'Scroll',
    es: 'Desplazar',
    it: 'Scorri',
    de: 'Scrollen',
    fr: 'Défiler',
    sv: 'Scrolla',
  },
  quickLinks: {
    en: 'Quick Links',
    es: 'Enlaces Rápidos',
    it: 'Link Rapidi',
    de: 'Schnelllinks',
    fr: 'Liens Rapides',
    sv: 'Snabblänkar',
  },
  followUs: {
    en: 'Follow Us',
    es: 'Síguenos',
    it: 'Seguici',
    de: 'Folgen Sie uns',
    fr: 'Suivez-nous',
    sv: 'Följ oss',
  },
  madeWith: {
    en: 'Made with',
    es: 'Hecho con',
    it: 'Fatto con',
    de: 'Gemacht mit',
    fr: 'Fait avec',
    sv: 'Gjord med',
  },
  inCostaRica: {
    en: 'in Costa Rica',
    es: 'en Costa Rica',
    it: 'in Costa Rica',
    de: 'in Costa Rica',
    fr: 'au Costa Rica',
    sv: 'i Costa Rica',
  },
};

// Dynamic icon component
const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
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
    if (typeof en === 'object' && en !== null) {
      const trans = en as { en: string; es?: string; it?: string; de?: string; fr?: string; sv?: string };
      return trans[language as keyof typeof trans] || trans.en || '';
    }
    if (language === 'es' && es) return es;
    return en || '';
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Promo Banner */}
      {promo && !promoDismissed && (
        <div className="promo-banner flex items-center justify-center gap-4">
          {promo.link ? (
            <Link to={promo.link} className="hover:underline">
              {getText(promo.text, promo.text_es)}
            </Link>
          ) : (
            <span>{getText(promo.text, promo.text_es)}</span>
          )}
          {promo.dismissible && (
            <button
              onClick={() => setPromoDismissed(true)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss"
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
      <section className="hero relative">
        {/* Background */}
        <div className="hero-background">
          {hero.video_url ? (
            <video
              autoPlay={hero.video_autoplay !== false}
              loop={hero.video_loop !== false}
              muted={hero.video_muted !== false}
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={getImageUrl(hero.video_url)} type="video/mp4" />
            </video>
          ) : hero.image_url ? (
            <img
              src={getImageUrl(hero.image_url)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-forest via-forest-600 to-forest-800" />
          )}
          <div className="hero-overlay" />
        </div>

        {/* Hero Content */}
        <div className="container">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge animate-fade-in-down">
              <Coffee size={16} />
              <span>Est. 1973</span>
            </div>

            {/* Title */}
            <h1 className="hero-title animate-fade-in-up">
              {getText(hero.title, hero.title_es) || 'The Art of Coffee & Baking'}
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle animate-fade-in-up delay-100">
              {getText(hero.tagline, hero.tagline_es) || getText(hero.subtitle, hero.subtitle_es)}
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions animate-fade-in-up delay-200">
              {hero.cta_primary_text && hero.cta_primary_link && (
                <Link to={hero.cta_primary_link} className="btn btn-secondary btn-lg">
                  {getText(hero.cta_primary_text, hero.cta_primary_text_es)}
                  <ArrowRight size={18} />
                </Link>
              )}
              {hero.cta_secondary_text && hero.cta_secondary_link && (
                <Link
                  to={hero.cta_secondary_link}
                  className="btn btn-lg bg-white/10 text-white border-white/30 hover:bg-white hover:text-forest backdrop-blur-sm"
                >
                  {getText(hero.cta_secondary_text, hero.cta_secondary_text_es)}
                </Link>
              )}
            </div>

            {/* Rating Badge */}
            {settings?.tripadvisor_rating && (
              <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full animate-fade-in-up delay-300">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="text-sand fill-sand" />
                  ))}
                </div>
                <span className="text-white font-semibold">{settings.tripadvisor_rating}</span>
                <span className="text-white/70 text-sm">• 500+ {getText(translations.reviews)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll">
          <span>{getText(translations.scrollDown)}</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="section-title">
              <h2>{getText(translations.whyChooseUs)}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="text-center p-8 rounded-3xl bg-cream transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-forest rounded-2xl mb-6 text-sand">
                    <DynamicIcon name={feature.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-forest mb-3">
                    {getText(feature.title, feature.title_es)}
                  </h3>
                  <p className="text-forest/70 leading-relaxed">
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
        <section className="section bg-cream">
          <div className="container">
            <div className="section-title">
              <h2>{getText(translations.whatCustomersSay)}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={star <= testimonial.rating ? 'text-sand fill-sand' : 'text-sand-light'}
                      />
                    ))}
                  </div>
                  <p className="testimonial-quote">
                    "{getText(testimonial.text, testimonial.text_es)}"
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {testimonial.author_image ? (
                        <img
                          src={getImageUrl(testimonial.author_image)}
                          alt={testimonial.author_name}
                        />
                      ) : (
                        <div className="w-full h-full bg-sand/30 flex items-center justify-center text-forest font-bold text-xl">
                          {testimonial.author_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="testimonial-info">
                      <p className="testimonial-name">{testimonial.author_name}</p>
                      {testimonial.source && (
                        <p className="testimonial-role">{testimonial.source}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="section-title">
              <h2>{getText(translations.gallery)}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {gallery.slice(0, 6).map((item, index) => (
                <div
                  key={item.id}
                  className={`category-card ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  {item.media_type === 'video' && item.video_url ? (
                    <video
                      src={getImageUrl(item.video_url)}
                      className="category-card-image"
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={getText(item.alt_text, item.alt_text_es)}
                      className="category-card-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section - CTA Banner */}
      <section className="section bg-forest">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full mb-8">
              <Award className="w-10 h-10 text-sand" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-6">
              {getText(translations.since1973)}
            </h2>
            <p className="text-cream/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {getText(translations.familyBusinessText)}
            </p>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              {getText(translations.exploreMenu)}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="section bg-cream">
        <div className="container">
          <div className="section-title">
            <h2>{getText(translations.visitUs)}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hours Card */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-forest rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-cream" />
                </div>
                <h3 className="text-xl font-semibold text-forest">
                  {getText(translations.hours)}
                </h3>
              </div>
              <div className="space-y-4">
                {settings?.opening_hours ? (
                  Object.entries(settings.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-sand-light last:border-0">
                      <span className="text-forest/70 capitalize">{day}</span>
                      <span className="font-semibold text-forest">{(hours as { open: string; close: string }).open} - {(hours as { open: string; close: string }).close}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-sand-light">
                      <span className="text-forest/70">{getText(translations.mondayFriday)}</span>
                      <span className="font-semibold text-forest">6:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-sand-light">
                      <span className="text-forest/70">{getText(translations.saturday)}</span>
                      <span className="font-semibold text-forest">7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-forest/70">{getText(translations.sunday)}</span>
                      <span className="font-semibold text-forest">7:00 AM - 6:00 PM</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-forest rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cream" />
                </div>
                <h3 className="text-xl font-semibold text-forest">
                  {getText(translations.location)}
                </h3>
              </div>
              <p className="text-forest/70 mb-6 text-lg">
                {settings?.address || 'Moravia, San José, Costa Rica'}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <MapPin size={16} />
                  Google Maps
                </a>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(settings?.waze_address || settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2>{getText(translations.contactUs)}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {settings?.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="btn btn-outline btn-lg">
                <Phone size={20} />
                {settings.contact_phone}
              </a>
            )}
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg bg-green-500 text-white border-green-500 hover:bg-green-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
            {settings?.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="btn btn-outline btn-lg">
                <Mail size={20} />
                {settings.contact_email}
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
                className="footer-social-link bg-forest text-cream hover:bg-sand hover:text-forest"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link bg-forest text-cream hover:bg-sand hover:text-forest"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-forest" />
                </div>
                <span className="text-xl font-bold text-cream">
                  {settings?.restaurant_name || 'Café 1973'}
                </span>
              </div>
              <p className="footer-description">
                {getText(translations.familyBusinessText).slice(0, 150)}...
              </p>
              <div className="footer-social">
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <Instagram size={18} />
                  </a>
                )}
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <Facebook size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-title">{getText(translations.quickLinks)}</h4>
              <ul className="footer-links">
                <li><Link to="/menu">{getText(translations.exploreMenu)}</Link></li>
                <li><Link to="/reservations">Reservaciones</Link></li>
                <li><Link to="/about">Sobre Nosotros</Link></li>
                <li><Link to="/contact">{getText(translations.contactUs)}</Link></li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="footer-title">{getText(translations.hours)}</h4>
              <ul className="footer-links">
                <li>{getText(translations.mondayFriday)}: 6AM - 8PM</li>
                <li>{getText(translations.saturday)}: 7AM - 9PM</li>
                <li>{getText(translations.sunday)}: 7AM - 6PM</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="footer-title">{getText(translations.contactUs)}</h4>
              <div className="space-y-3">
                {settings?.contact_phone && (
                  <div className="footer-contact-item">
                    <Phone size={16} />
                    <span>{settings.contact_phone}</span>
                  </div>
                )}
                {settings?.contact_email && (
                  <div className="footer-contact-item">
                    <Mail size={16} />
                    <span>{settings.contact_email}</span>
                  </div>
                )}
                <div className="footer-contact-item">
                  <MapPin size={16} />
                  <span>{settings?.address || 'Moravia, San José, Costa Rica'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {settings?.restaurant_name || 'Café 1973'}. {getText(translations.allRightsReserved)}
            </p>
            <p className="text-cream/50 text-sm flex items-center gap-1">
              {getText(translations.madeWith)} <Heart size={14} className="text-red-400 fill-red-400" /> {getText(translations.inCostaRica)}
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Nav Spacer */}
      <div className="bottom-nav-spacer" />

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Home;
