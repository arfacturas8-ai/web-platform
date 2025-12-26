/**
 * Café 1973 | Bakery - Reservations Page
 * Mobile-first reservation system
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackPageView } from '@/utils/analytics';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import {
  CalendarDays,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail
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
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  es: {
    pageTitle: 'Reservar Mesa',
    reservationConfirmed: '¡Reservación Confirmada!',
    emailSent: 'Te hemos enviado un correo con los detalles.',
    date: 'Fecha',
    time: 'Hora',
    guests: 'Personas',
    howManyGuests: '¿Cuántas personas?',
    selectDate: 'Selecciona fecha',
    selectTime: 'Selecciona hora',
    today: 'Hoy',
    continue: 'Continuar',
    back: 'Volver',
    yourReservation: 'Tu reservación',
    people: 'personas',
    contactInfo: 'Datos de contacto',
    fullName: 'Nombre completo',
    yourName: 'Tu nombre',
    phone: 'Teléfono',
    email: 'Correo electrónico',
    specialRequests: 'Notas especiales',
    allergiesEtc: 'Alergias, celebraciones, etc.',
    booking: 'Reservando...',
    confirmReservation: 'Confirmar Reservación',
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  },
  it: {
    pageTitle: 'Prenota un Tavolo',
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
    days: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
  },
  de: {
    pageTitle: 'Tisch Reservieren',
    reservationConfirmed: 'Reservierung Bestätigt!',
    emailSent: 'Wir haben Ihnen eine E-Mail mit den Details gesendet.',
    date: 'Datum',
    time: 'Uhrzeit',
    guests: 'Gäste',
    howManyGuests: 'Wie viele Gäste?',
    selectDate: 'Datum wählen',
    selectTime: 'Uhrzeit wählen',
    today: 'Heute',
    continue: 'Weiter',
    back: 'Zurück',
    yourReservation: 'Ihre Reservierung',
    people: 'Gäste',
    contactInfo: 'Kontaktinformationen',
    fullName: 'Vollständiger Name',
    yourName: 'Ihr Name',
    phone: 'Telefon',
    email: 'E-Mail',
    specialRequests: 'Besondere Wünsche',
    allergiesEtc: 'Allergien, Feiern, usw.',
    booking: 'Reservierung läuft...',
    confirmReservation: 'Reservierung Bestätigen',
    days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  },
  fr: {
    pageTitle: 'Réserver une Table',
    reservationConfirmed: 'Réservation Confirmée!',
    emailSent: 'Nous vous avons envoyé un e-mail avec les détails.',
    date: 'Date',
    time: 'Heure',
    guests: 'Personnes',
    howManyGuests: 'Combien de personnes?',
    selectDate: 'Sélectionner la date',
    selectTime: 'Sélectionner l\'heure',
    today: 'Aujourd\'hui',
    continue: 'Continuer',
    back: 'Retour',
    yourReservation: 'Votre réservation',
    people: 'personnes',
    contactInfo: 'Informations de Contact',
    fullName: 'Nom complet',
    yourName: 'Votre nom',
    phone: 'Téléphone',
    email: 'E-mail',
    specialRequests: 'Demandes spéciales',
    allergiesEtc: 'Allergies, célébrations, etc.',
    booking: 'Réservation...',
    confirmReservation: 'Confirmer la Réservation',
    days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  },
  sv: {
    pageTitle: 'Boka Bord',
    reservationConfirmed: 'Bokning Bekräftad!',
    emailSent: 'Vi har skickat ett e-postmeddelande med detaljerna.',
    date: 'Datum',
    time: 'Tid',
    guests: 'Gäster',
    howManyGuests: 'Hur många gäster?',
    selectDate: 'Välj datum',
    selectTime: 'Välj tid',
    today: 'Idag',
    continue: 'Fortsätt',
    back: 'Tillbaka',
    yourReservation: 'Din bokning',
    people: 'gäster',
    contactInfo: 'Kontaktinformation',
    fullName: 'Fullständigt namn',
    yourName: 'Ditt namn',
    phone: 'Telefon',
    email: 'E-post',
    specialRequests: 'Speciella önskemål',
    allergiesEtc: 'Allergier, firanden, osv.',
    booking: 'Bokar...',
    confirmReservation: 'Bekräfta Bokning',
    days: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
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

  const canProceedToStep2 = selectedDate && selectedTime && selectedPartySize;
  const canSubmit = formData.name && formData.phone;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf8f3] pb-24">
        {/* Floating Language Selector */}
        <FloatingLanguageSelector />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-forest mb-2">
            {t.reservationConfirmed}
          </h1>
          <p className="text-forest/60 mb-8">
            {t.emailSent}
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-soft w-full max-w-sm">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-forest/60">{t.date}</span>
                <span className="font-medium text-forest">
                  {selectedDate && `${formatDate(selectedDate).day}, ${formatDate(selectedDate).date} ${formatDate(selectedDate).month}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest/60">{t.time}</span>
                <span className="font-medium text-forest">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest/60">{t.guests}</span>
                <span className="font-medium text-forest">{selectedPartySize}</span>
              </div>
            </div>
          </div>
        </div>
        <MobileNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-b border-sand-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-forest">
                {t.pageTitle}
              </h1>
              <p className="text-xs text-forest/60">Café 1973 | Bakery</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-forest/60">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= 1 ? 'bg-forest text-white' : 'bg-sand/50'}`}>1</span>
              <ChevronRight size={14} />
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= 2 ? 'bg-forest text-white' : 'bg-sand/50'}`}>2</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {step === 1 ? (
          <div className="space-y-8 animate-fade-in">
            {/* Party Size */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-forest" />
                <h2 className="font-semibold text-forest">
                  {t.howManyGuests}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {partySizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedPartySize(size)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all ${
                      selectedPartySize === size
                        ? 'bg-forest text-white'
                        : 'bg-white text-forest border border-sand-200 hover:border-forest'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Date Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={18} className="text-forest" />
                <h2 className="font-semibold text-forest">
                  {t.selectDate}
                </h2>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                {dates.map((date, index) => {
                  const { day, date: dateNum, month } = formatDate(date);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = index === 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'bg-forest text-white'
                          : 'bg-white text-forest border border-sand-200 hover:border-forest'
                      }`}
                    >
                      <p className={`text-[10px] uppercase ${isSelected ? 'text-white/70' : 'text-forest/50'}`}>
                        {isToday ? t.today : day}
                      </p>
                      <p className="text-lg font-bold">{dateNum}</p>
                      <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-forest/50'}`}>{month}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Time Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-forest" />
                <h2 className="font-semibold text-forest">
                  {t.selectTime}
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl font-medium text-sm transition-all ${
                      selectedTime === time
                        ? 'bg-forest text-white'
                        : 'bg-white text-forest border border-sand-200 hover:border-forest'
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
              className={`w-full py-4 rounded-xl font-medium transition-all ${
                canProceedToStep2
                  ? 'bg-forest text-white hover:bg-forest/90 active:scale-[0.98]'
                  : 'bg-sand/50 text-forest/40 cursor-not-allowed'
              }`}
            >
              {t.continue}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-forest/60 hover:text-forest transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">{t.back}</span>
            </button>

            {/* Summary */}
            <div className="bg-sand/20 rounded-xl p-4">
              <p className="text-sm text-forest/60 mb-1">{t.yourReservation}</p>
              <p className="font-semibold text-forest">
                {selectedDate && `${formatDate(selectedDate).day}, ${formatDate(selectedDate).date} ${formatDate(selectedDate).month}`} • {selectedTime} • {selectedPartySize} {t.people}
              </p>
            </div>

            {/* Contact Form */}
            <section className="space-y-4">
              <h2 className="font-semibold text-forest">
                {t.contactInfo}
              </h2>

              <div>
                <label className="block text-sm text-forest/60 mb-1.5">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest"
                  placeholder={t.yourName}
                />
              </div>

              <div>
                <label className="block text-sm text-forest/60 mb-1.5">
                  {t.phone} *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest"
                    placeholder="+506 8888-8888"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-forest/60 mb-1.5">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-forest/60 mb-1.5">
                  {t.specialRequests}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest resize-none"
                  placeholder={t.allergiesEtc}
                />
              </div>
            </section>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                canSubmit && !isSubmitting
                  ? 'bg-forest text-white hover:bg-forest/90 active:scale-[0.98]'
                  : 'bg-sand/50 text-forest/40 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.booking}</span>
                </>
              ) : (
                <span>{t.confirmReservation}</span>
              )}
            </button>
          </div>
        )}
      </main>

      <MobileNavBar />
    </div>
  );
};

export default Reservations;
