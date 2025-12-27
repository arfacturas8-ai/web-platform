/**
 * Cafe 1973 - Reservations Page
 * Bisqueria-inspired design with Cafe 1973 brand colors
 * Moravia, Costa Rica
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackPageView } from '@/utils/analytics';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Link } from '@/lib/router';
import {
  CalendarDays,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail,
  Coffee,
  MapPin
} from 'lucide-react';

// Generate dates for the next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Available time slots
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

// Party sizes
const partySizes = [1, 2, 3, 4, 5, 6, 7, 8];

// Translations for all supported languages
const translations = {
  en: {
    pageTitle: 'Book a Table',
    subtitle: 'Reserve your spot at Cafe 1973',
    reservationConfirmed: 'Reservation Confirmed!',
    emailSent: 'We have sent you an email with the details.',
    date: 'Date',
    time: 'Time',
    guests: 'Guests',
    howManyGuests: 'How many guests?',
    selectDate: 'Select date',
    selectTime: 'Select time',
    today: 'Today',
    continue: 'Continue',
    back: 'Back',
    yourReservation: 'Your reservation',
    people: 'guests',
    contactInfo: 'Contact Information',
    fullName: 'Full name',
    yourName: 'Your name',
    phone: 'Phone',
    email: 'Email',
    specialRequests: 'Special requests',
    allergiesEtc: 'Allergies, celebrations, etc.',
    booking: 'Booking...',
    confirmReservation: 'Confirm Reservation',
    backToHome: 'Back to Home',
    makeAnother: 'Make Another Reservation',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  es: {
    pageTitle: 'Reservar Mesa',
    subtitle: 'Reserva tu lugar en Cafe 1973',
    reservationConfirmed: 'Reservacion Confirmada!',
    emailSent: 'Te hemos enviado un correo con los detalles.',
    date: 'Fecha',
    time: 'Hora',
    guests: 'Personas',
    howManyGuests: 'Cuantas personas?',
    selectDate: 'Selecciona fecha',
    selectTime: 'Selecciona hora',
    today: 'Hoy',
    continue: 'Continuar',
    back: 'Volver',
    yourReservation: 'Tu reservacion',
    people: 'personas',
    contactInfo: 'Datos de contacto',
    fullName: 'Nombre completo',
    yourName: 'Tu nombre',
    phone: 'Telefono',
    email: 'Correo electronico',
    specialRequests: 'Notas especiales',
    allergiesEtc: 'Alergias, celebraciones, etc.',
    booking: 'Reservando...',
    confirmReservation: 'Confirmar Reservacion',
    backToHome: 'Volver al Inicio',
    makeAnother: 'Hacer Otra Reservacion',
    days: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  },
  it: {
    pageTitle: 'Prenota un Tavolo',
    subtitle: 'Prenota il tuo posto al Cafe 1973',
    reservationConfirmed: 'Prenotazione Confermata!',
    emailSent: 'Ti abbiamo inviato un\'email con i dettagli.',
    date: 'Data',
    time: 'Ora',
    guests: 'Ospiti',
    howManyGuests: 'Quanti ospiti?',
    selectDate: 'Seleziona data',
    selectTime: 'Seleziona ora',
    today: 'Oggi',
    continue: 'Continua',
    back: 'Indietro',
    yourReservation: 'La tua prenotazione',
    people: 'ospiti',
    contactInfo: 'Informazioni di Contatto',
    fullName: 'Nome completo',
    yourName: 'Il tuo nome',
    phone: 'Telefono',
    email: 'Email',
    specialRequests: 'Richieste speciali',
    allergiesEtc: 'Allergie, celebrazioni, ecc.',
    booking: 'Prenotazione...',
    confirmReservation: 'Conferma Prenotazione',
    backToHome: 'Torna alla Home',
    makeAnother: 'Fai un\'altra Prenotazione',
    days: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
  },
  de: {
    pageTitle: 'Tisch Reservieren',
    subtitle: 'Reservieren Sie Ihren Platz im Cafe 1973',
    reservationConfirmed: 'Reservierung Bestatigt!',
    emailSent: 'Wir haben Ihnen eine E-Mail mit den Details gesendet.',
    date: 'Datum',
    time: 'Uhrzeit',
    guests: 'Gaste',
    howManyGuests: 'Wie viele Gaste?',
    selectDate: 'Datum wahlen',
    selectTime: 'Uhrzeit wahlen',
    today: 'Heute',
    continue: 'Weiter',
    back: 'Zuruck',
    yourReservation: 'Ihre Reservierung',
    people: 'Gaste',
    contactInfo: 'Kontaktinformationen',
    fullName: 'Vollstandiger Name',
    yourName: 'Ihr Name',
    phone: 'Telefon',
    email: 'E-Mail',
    specialRequests: 'Besondere Wunsche',
    allergiesEtc: 'Allergien, Feiern, usw.',
    booking: 'Reservierung lauft...',
    confirmReservation: 'Reservierung Bestatigen',
    backToHome: 'Zuruck zur Startseite',
    makeAnother: 'Weitere Reservierung',
    days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  },
  fr: {
    pageTitle: 'Reserver une Table',
    subtitle: 'Reservez votre place au Cafe 1973',
    reservationConfirmed: 'Reservation Confirmee!',
    emailSent: 'Nous vous avons envoye un e-mail avec les details.',
    date: 'Date',
    time: 'Heure',
    guests: 'Personnes',
    howManyGuests: 'Combien de personnes?',
    selectDate: 'Selectionner la date',
    selectTime: 'Selectionner l\'heure',
    today: 'Aujourd\'hui',
    continue: 'Continuer',
    back: 'Retour',
    yourReservation: 'Votre reservation',
    people: 'personnes',
    contactInfo: 'Informations de Contact',
    fullName: 'Nom complet',
    yourName: 'Votre nom',
    phone: 'Telephone',
    email: 'E-mail',
    specialRequests: 'Demandes speciales',
    allergiesEtc: 'Allergies, celebrations, etc.',
    booking: 'Reservation...',
    confirmReservation: 'Confirmer la Reservation',
    backToHome: 'Retour a l\'Accueil',
    makeAnother: 'Faire une Autre Reservation',
    days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  sv: {
    pageTitle: 'Boka Bord',
    subtitle: 'Reservera din plats pa Cafe 1973',
    reservationConfirmed: 'Bokning Bekraftad!',
    emailSent: 'Vi har skickat ett e-postmeddelande med detaljerna.',
    date: 'Datum',
    time: 'Tid',
    guests: 'Gaster',
    howManyGuests: 'Hur manga gaster?',
    selectDate: 'Valj datum',
    selectTime: 'Valj tid',
    today: 'Idag',
    continue: 'Fortsatt',
    back: 'Tillbaka',
    yourReservation: 'Din bokning',
    people: 'gaster',
    contactInfo: 'Kontaktinformation',
    fullName: 'Fullstandigt namn',
    yourName: 'Ditt namn',
    phone: 'Telefon',
    email: 'E-post',
    specialRequests: 'Speciella onskemol',
    allergiesEtc: 'Allergier, firanden, osv.',
    booking: 'Bokar...',
    confirmReservation: 'Bekrafta Bokning',
    backToHome: 'Tillbaka till Startsidan',
    makeAnother: 'Gor en Ny Bokning',
    days: ['Son', 'Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lor'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
  }
};

export const Reservations: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPartySize, setSelectedPartySize] = useState<number>(2);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dates = generateDates();

  useEffect(() => {
    trackPageView('/reservations', 'Reservations');
  }, []);

  const formatDate = (date: Date) => {
    return {
      day: t.days[date.getDay()],
      date: date.getDate(),
      month: t.months[date.getMonth()]
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const resetReservation = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedPartySize(2);
    setStep(1);
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setIsSuccess(false);
  };

  const canProceedToStep2 = selectedDate && selectedTime && selectedPartySize;
  const canSubmit = formData.name && formData.phone;

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream">
        {/* Floating Language Selector */}
        <FloatingLanguageSelector />

        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-forest rounded-full flex items-center justify-center mb-8 animate-scale-in shadow-elevated">
            <Check className="w-12 h-12 text-cream" strokeWidth={3} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-forest mb-3">
            {t.reservationConfirmed}
          </h1>
          <p className="text-forest/60 mb-10 max-w-sm">
            {t.emailSent}
          </p>

          {/* Reservation Details Card */}
          <div className="card p-8 w-full max-w-md mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-sand/30 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-forest" />
              </div>
              <div className="text-left">
                <p className="font-bold text-forest">Cafe 1973</p>
                <p className="text-sm text-forest/60 flex items-center gap-1">
                  <MapPin size={12} />
                  Moravia, Costa Rica
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-sand-light">
                <span className="text-forest/60 flex items-center gap-2">
                  <CalendarDays size={16} />
                  {t.date}
                </span>
                <span className="font-semibold text-forest">
                  {selectedDate && `${formatDate(selectedDate).day}, ${formatDate(selectedDate).date} ${formatDate(selectedDate).month}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-sand-light">
                <span className="text-forest/60 flex items-center gap-2">
                  <Clock size={16} />
                  {t.time}
                </span>
                <span className="font-semibold text-forest">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-forest/60 flex items-center gap-2">
                  <Users size={16} />
                  {t.guests}
                </span>
                <span className="font-semibold text-forest">{selectedPartySize} {t.people}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link to="/" className="btn btn-outline flex-1">
              {t.backToHome}
            </Link>
            <button onClick={resetReservation} className="btn btn-primary flex-1">
              {t.makeAnother}
            </button>
          </div>
        </div>

        {/* Bottom Nav Spacer */}
        <div className="bottom-nav-spacer" />
        <MobileNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="navbar">
        <div className="container">
          <div className="nav-container">
            {/* Back / Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="nav-icon-btn"
                aria-label="Back to home"
              >
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-forest">{t.pageTitle}</h1>
                <p className="text-xs text-forest/60">Cafe 1973 | Bakery</p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= 1 ? 'bg-forest text-cream' : 'bg-sand/50 text-forest/40'
              }`}>
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <div className="w-8 h-0.5 bg-sand-light">
                <div className={`h-full bg-forest transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= 2 ? 'bg-forest text-cream' : 'bg-sand/50 text-forest/40'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-forest py-10 md:py-14">
        <div className="container">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sand/20 rounded-full text-sand text-sm font-medium mb-4">
              <CalendarDays size={16} />
              <span>Est. 1973</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-cream mb-2">
              {t.pageTitle}
            </h2>
            <p className="text-cream/70">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="section py-8 md:py-12">
        <div className="container max-w-2xl">
          {step === 1 ? (
            <div className="space-y-8 animate-fade-in">
              {/* Party Size */}
              <section className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-sand/30 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-forest" />
                  </div>
                  <h2 className="text-lg font-bold text-forest">
                    {t.howManyGuests}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {partySizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedPartySize(size)}
                      className={`w-14 h-14 rounded-2xl font-semibold text-lg transition-all ${
                        selectedPartySize === size
                          ? 'bg-forest text-cream shadow-card'
                          : 'bg-cream text-forest border-2 border-sand-light hover:border-forest'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Date Selection */}
              <section className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-sand/30 rounded-full flex items-center justify-center">
                    <CalendarDays size={20} className="text-forest" />
                  </div>
                  <h2 className="text-lg font-bold text-forest">
                    {t.selectDate}
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                  {dates.map((date, index) => {
                    const { day, date: dateNum, month } = formatDate(date);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = index === 0;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 w-20 py-4 rounded-2xl text-center transition-all ${
                          isSelected
                            ? 'bg-forest text-cream shadow-card'
                            : 'bg-cream text-forest border-2 border-sand-light hover:border-forest'
                        }`}
                      >
                        <p className={`text-xs uppercase font-medium ${isSelected ? 'text-cream/70' : 'text-forest/50'}`}>
                          {isToday ? t.today : day}
                        </p>
                        <p className="text-2xl font-bold my-1">{dateNum}</p>
                        <p className={`text-xs ${isSelected ? 'text-cream/70' : 'text-forest/50'}`}>{month}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Time Selection */}
              <section className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-sand/30 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-forest" />
                  </div>
                  <h2 className="text-lg font-bold text-forest">
                    {t.selectTime}
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedTime === time
                          ? 'bg-forest text-cream shadow-card'
                          : 'bg-cream text-forest border-2 border-sand-light hover:border-forest'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              {/* Continue Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className={`btn w-full py-4 text-base ${
                  canProceedToStep2
                    ? 'btn-primary'
                    : 'bg-sand/50 text-forest/40 cursor-not-allowed'
                }`}
              >
                {t.continue}
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-forest/60 hover:text-forest transition-colors font-medium"
              >
                <ChevronLeft size={20} />
                <span>{t.back}</span>
              </button>

              {/* Summary Card */}
              <div className="card p-5 bg-sand/20 border-sand">
                <p className="text-sm text-forest/60 mb-2">{t.yourReservation}</p>
                <div className="flex items-center gap-4 text-forest">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-forest/60" />
                    {selectedDate && `${formatDate(selectedDate).day}, ${formatDate(selectedDate).date} ${formatDate(selectedDate).month}`}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-forest/30" />
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-forest/60" />
                    {selectedTime}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-forest/30" />
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-forest/60" />
                    {selectedPartySize} {t.people}
                  </span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-forest mb-6">
                  {t.contactInfo}
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-2">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder={t.yourName}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-2">
                      {t.phone} *
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input pl-12"
                        placeholder="+506 8888-8888"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-2">
                      {t.email}
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input pl-12"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-2">
                      {t.specialRequests}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="form-input resize-none"
                      placeholder={t.allergiesEtc}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`btn w-full py-4 text-base flex items-center justify-center gap-3 ${
                  canSubmit && !isSubmitting
                    ? 'btn-primary'
                    : 'bg-sand/50 text-forest/40 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    <span>{t.booking}</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>{t.confirmReservation}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav Spacer */}
      <div className="bottom-nav-spacer" />

      {/* Mobile Bottom Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Reservations;
