/**
 * Cafe 1973 - Contact Page
 * Mobile-first contact page with form, info, and map
 */
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Instagram,
  Facebook,
  Send,
  CheckCircle,
  Navigation,
} from 'lucide-react';

const translations = {
  en: {
    contactUs: 'Contact Us',
    heroSubtitle: "We'd love to hear from you. Get in touch with us for reservations, catering, or any questions.",
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    openingHours: 'Opening Hours',
    mondayFriday: 'Monday - Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    sendMessage: 'Send us a Message',
    formSubtitle: "Fill out the form below and we'll get back to you soon.",
    messageSent: 'Message Sent!',
    thankYou: "Thank you for contacting us. We'll respond as soon as possible.",
    sendAnother: 'Send Another Message',
    name: 'Name',
    yourName: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    subject: 'Subject',
    selectSubject: 'Select a subject',
    generalInquiry: 'General Inquiry',
    reservations: 'Reservations',
    cateringServices: 'Catering Services',
    feedback: 'Feedback',
    other: 'Other',
    message: 'Message',
    howCanWeHelp: 'How can we help you?',
    sending: 'Sending...',
    sendMessageBtn: 'Send Message',
    findUs: 'Find Us',
    mapComingSoon: 'Map view coming soon',
    followUs: 'Follow Us',
    socialSubtitle: 'Stay connected with us on social media for updates and special offers.',
    allRights: 'All rights reserved.',
  },
  es: {
    contactUs: 'Contáctanos',
    heroSubtitle: 'Nos encantaría saber de ti. Contáctanos para reservaciones, catering o cualquier pregunta.',
    phone: 'Teléfono',
    email: 'Correo',
    address: 'Dirección',
    openingHours: 'Horario de Atención',
    mondayFriday: 'Lunes - Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    sendMessage: 'Envíanos un Mensaje',
    formSubtitle: 'Completa el formulario y te responderemos pronto.',
    messageSent: '¡Mensaje Enviado!',
    thankYou: 'Gracias por contactarnos. Te responderemos lo antes posible.',
    sendAnother: 'Enviar Otro Mensaje',
    name: 'Nombre',
    yourName: 'Tu nombre',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@correo.com',
    subject: 'Asunto',
    selectSubject: 'Selecciona un tema',
    generalInquiry: 'Consulta General',
    reservations: 'Reservaciones',
    cateringServices: 'Servicios de Catering',
    feedback: 'Comentarios',
    other: 'Otro',
    message: 'Mensaje',
    howCanWeHelp: '¿Cómo podemos ayudarte?',
    sending: 'Enviando...',
    sendMessageBtn: 'Enviar Mensaje',
    findUs: 'Encuéntranos',
    mapComingSoon: 'Vista del mapa próximamente',
    followUs: 'Síguenos',
    socialSubtitle: 'Mantente conectado con nosotros en redes sociales para actualizaciones y ofertas especiales.',
    allRights: 'Todos los derechos reservados.',
  },
  it: {
    contactUs: 'Contattaci',
    heroSubtitle: 'Ci piacerebbe sentirti. Contattaci per prenotazioni, catering o qualsiasi domanda.',
    phone: 'Telefono',
    email: 'Email',
    address: 'Indirizzo',
    openingHours: 'Orari di Apertura',
    mondayFriday: 'Lunedì - Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica',
    sendMessage: 'Inviaci un Messaggio',
    formSubtitle: 'Compila il modulo e ti risponderemo presto.',
    messageSent: 'Messaggio Inviato!',
    thankYou: 'Grazie per averci contattato. Risponderemo il prima possibile.',
    sendAnother: 'Invia un Altro Messaggio',
    name: 'Nome',
    yourName: 'Il tuo nome',
    emailLabel: 'Email',
    emailPlaceholder: 'tua@email.com',
    subject: 'Oggetto',
    selectSubject: 'Seleziona un oggetto',
    generalInquiry: 'Richiesta Generale',
    reservations: 'Prenotazioni',
    cateringServices: 'Servizi di Catering',
    feedback: 'Feedback',
    other: 'Altro',
    message: 'Messaggio',
    howCanWeHelp: 'Come possiamo aiutarti?',
    sending: 'Invio in corso...',
    sendMessageBtn: 'Invia Messaggio',
    findUs: 'Trovaci',
    mapComingSoon: 'Vista mappa in arrivo',
    followUs: 'Seguici',
    socialSubtitle: 'Resta connesso con noi sui social media per aggiornamenti e offerte speciali.',
    allRights: 'Tutti i diritti riservati.',
  },
  de: {
    contactUs: 'Kontaktieren Sie uns',
    heroSubtitle: 'Wir freuen uns von Ihnen zu hören. Kontaktieren Sie uns für Reservierungen, Catering oder Fragen.',
    phone: 'Telefon',
    email: 'E-Mail',
    address: 'Adresse',
    openingHours: 'Öffnungszeiten',
    mondayFriday: 'Montag - Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
    sendMessage: 'Nachricht senden',
    formSubtitle: 'Füllen Sie das Formular aus und wir melden uns bei Ihnen.',
    messageSent: 'Nachricht gesendet!',
    thankYou: 'Vielen Dank für Ihre Nachricht. Wir antworten so schnell wie möglich.',
    sendAnother: 'Weitere Nachricht senden',
    name: 'Name',
    yourName: 'Ihr Name',
    emailLabel: 'E-Mail',
    emailPlaceholder: 'ihre@email.com',
    subject: 'Betreff',
    selectSubject: 'Betreff auswählen',
    generalInquiry: 'Allgemeine Anfrage',
    reservations: 'Reservierungen',
    cateringServices: 'Catering-Service',
    feedback: 'Feedback',
    other: 'Sonstiges',
    message: 'Nachricht',
    howCanWeHelp: 'Wie können wir Ihnen helfen?',
    sending: 'Wird gesendet...',
    sendMessageBtn: 'Nachricht senden',
    findUs: 'Finden Sie uns',
    mapComingSoon: 'Kartenansicht kommt bald',
    followUs: 'Folgen Sie uns',
    socialSubtitle: 'Bleiben Sie mit uns in sozialen Medien für Updates und Sonderangebote verbunden.',
    allRights: 'Alle Rechte vorbehalten.',
  },
  fr: {
    contactUs: 'Contactez-nous',
    heroSubtitle: 'Nous serions ravis de vous entendre. Contactez-nous pour réservations, traiteur ou toute question.',
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    openingHours: "Heures d'ouverture",
    mondayFriday: 'Lundi - Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
    sendMessage: 'Envoyez-nous un Message',
    formSubtitle: 'Remplissez le formulaire et nous vous répondrons bientôt.',
    messageSent: 'Message Envoyé!',
    thankYou: 'Merci de nous avoir contactés. Nous vous répondrons dès que possible.',
    sendAnother: 'Envoyer un Autre Message',
    name: 'Nom',
    yourName: 'Votre nom',
    emailLabel: 'Email',
    emailPlaceholder: 'votre@email.com',
    subject: 'Sujet',
    selectSubject: 'Sélectionnez un sujet',
    generalInquiry: 'Demande Générale',
    reservations: 'Réservations',
    cateringServices: 'Services Traiteur',
    feedback: 'Commentaires',
    other: 'Autre',
    message: 'Message',
    howCanWeHelp: 'Comment pouvons-nous vous aider?',
    sending: 'Envoi en cours...',
    sendMessageBtn: 'Envoyer le Message',
    findUs: 'Trouvez-nous',
    mapComingSoon: 'Vue de la carte bientôt disponible',
    followUs: 'Suivez-nous',
    socialSubtitle: 'Restez connecté avec nous sur les réseaux sociaux pour des mises à jour et des offres spéciales.',
    allRights: 'Tous droits réservés.',
  },
  sv: {
    contactUs: 'Kontakta oss',
    heroSubtitle: 'Vi vill gärna höra från dig. Kontakta oss för bokningar, catering eller frågor.',
    phone: 'Telefon',
    email: 'E-post',
    address: 'Adress',
    openingHours: 'Öppettider',
    mondayFriday: 'Måndag - Fredag',
    saturday: 'Lördag',
    sunday: 'Söndag',
    sendMessage: 'Skicka ett Meddelande',
    formSubtitle: 'Fyll i formuläret så återkommer vi snart.',
    messageSent: 'Meddelande Skickat!',
    thankYou: 'Tack för att du kontaktade oss. Vi svarar så snart som möjligt.',
    sendAnother: 'Skicka ett Annat Meddelande',
    name: 'Namn',
    yourName: 'Ditt namn',
    emailLabel: 'E-post',
    emailPlaceholder: 'din@email.com',
    subject: 'Ämne',
    selectSubject: 'Välj ett ämne',
    generalInquiry: 'Allmän Förfrågan',
    reservations: 'Bokningar',
    cateringServices: 'Cateringtjänster',
    feedback: 'Feedback',
    other: 'Övrigt',
    message: 'Meddelande',
    howCanWeHelp: 'Hur kan vi hjälpa dig?',
    sending: 'Skickar...',
    sendMessageBtn: 'Skicka Meddelande',
    findUs: 'Hitta oss',
    mapComingSoon: 'Kartvy kommer snart',
    followUs: 'Följ oss',
    socialSubtitle: 'Håll kontakten med oss på sociala medier för uppdateringar och specialerbjudanden.',
    allRights: 'Alla rättigheter förbehållna.',
  },
};

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const { data: settings } = useSettings();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Subject options
  const subjectOptions = [
    { value: '', label: t.selectSubject },
    { value: 'general', label: t.generalInquiry },
    { value: 'reservations', label: t.reservations },
    { value: 'catering', label: t.cateringServices },
    { value: 'feedback', label: t.feedback },
    { value: 'other', label: t.other },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-20">
      {/* Floating Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative bg-forest py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.contactUs}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Phone Card */}
            <a
              href={`tel:${settings?.contact_phone || '+506 2235-6789'}`}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-card transition-all text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/30 rounded-full mb-4 group-hover:bg-forest group-hover:text-white transition-colors">
                <Phone className="w-6 h-6 text-forest group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">
                {t.phone}
              </h3>
              <p className="text-forest/70 text-sm">
                {settings?.contact_phone || '+506 2235-6789'}
              </p>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${settings?.contact_email || 'info@cafe1973.com'}`}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-card transition-all text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/30 rounded-full mb-4 group-hover:bg-forest group-hover:text-white transition-colors">
                <Mail className="w-6 h-6 text-forest group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">
                {t.email}
              </h3>
              <p className="text-forest/70 text-sm">
                {settings?.contact_email || 'info@cafe1973.com'}
              </p>
            </a>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/30 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-forest" />
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">
                {t.address}
              </h3>
              <p className="text-forest/70 text-sm">
                {settings?.address || 'Moravia, San Jose, Costa Rica'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-forest rounded-full mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-forest">
              {t.openingHours}
            </h2>
          </div>

          <div className="max-w-md mx-auto bg-[#faf8f3] rounded-2xl p-6">
            <div className="space-y-3">
              {settings?.opening_hours ? (
                Object.entries(settings.opening_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-sand/30 last:border-0">
                    <span className="text-forest font-medium capitalize">{day}</span>
                    <span className="text-forest/70">{hours.open} - {hours.close}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-sand/30">
                    <span className="text-forest font-medium">
                      {t.mondayFriday}
                    </span>
                    <span className="text-forest/70">6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-sand/30">
                    <span className="text-forest font-medium">
                      {t.saturday}
                    </span>
                    <span className="text-forest/70">7:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-forest font-medium">
                      {t.sunday}
                    </span>
                    <span className="text-forest/70">7:00 AM - 6:00 PM</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-forest mb-2">
              {t.sendMessage}
            </h2>
            <p className="text-forest/60">
              {t.formSubtitle}
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-2">
                {t.messageSent}
              </h3>
              <p className="text-forest/60 mb-6">
                {t.thankYou}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
              >
                {t.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft">
              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">
                    {t.name} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                    placeholder={t.yourName}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">
                    {t.emailLabel} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-forest mb-2">
                    {t.subject} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-forest mb-2">
                    {t.message} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all resize-none"
                    placeholder={t.howCanWeHelp}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t.sendMessageBtn}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-forest mb-2">
              {t.findUs}
            </h2>
            <p className="text-forest/60">
              {settings?.address || 'Moravia, San Jose, Costa Rica'}
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="relative bg-[#faf8f3] rounded-2xl overflow-hidden aspect-video mb-6">
            {settings?.business_latitude && settings?.business_longitude ? (
              <iframe
                title="Location Map"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${settings.business_latitude},${settings.business_longitude}&zoom=15`}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-forest/60">
                <MapPin className="w-12 h-12 mb-4 text-forest/40" />
                <p className="text-sm">
                  {t.mapComingSoon}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
            >
              <Navigation className="w-5 h-5" />
              Google Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(settings?.waze_address || settings?.address || 'Cafe 1973 Moravia Costa Rica')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest border-2 border-forest rounded-full font-medium hover:bg-forest hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.54 6.63c-.17-.37-.5-.63-.9-.63h-5.28c-.39 0-.73.26-.9.63l-2.28 5.37h-2c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1h-2l-2.28-5.37zm-4.54 1.37h2l1.5 4h-5l1.5-4zm-6 7h10v4H10v-4z"/>
              </svg>
              Waze
            </a>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-forest mb-4">
            {t.followUs}
          </h2>
          <p className="text-forest/60 mb-8">
            {t.socialSubtitle}
          </p>

          <div className="flex justify-center gap-4">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
            )}
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
            {/* Default social links if none configured */}
            {!settings?.instagram_url && !settings?.facebook_url && (
              <>
                <a
                  href="https://instagram.com/cafe1973cr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://facebook.com/cafe1973cr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-forest rounded-full flex items-center justify-center text-white hover:bg-forest/90 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-forest/60">
            {new Date().getFullYear()} {settings?.restaurant_name || 'Cafe 1973'}. {t.allRights}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Contact;
