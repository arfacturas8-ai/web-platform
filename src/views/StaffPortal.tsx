/**
 * Cafe 1973 - Staff Portal
 * Mobile-first employee portal for scheduling, clock in/out, and time-off requests
 */
import React, { useState, useEffect, useMemo } from 'react';
import { logger } from '@/utils/logger';
import { useLanguage } from '@/contexts/LanguageContext';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import {
  Clock,
  Calendar,
  Bell,
  LogOut,
  Play,
  Square,
  FileText,
  ChevronRight,
  Coffee,
  X,
} from 'lucide-react';

// localStorage keys
const STORAGE_KEYS = {
  STAFF_USER: 'cafe1973_staff_user',
  CLOCK_STATUS: 'cafe1973_staff_clock_status',
  SCHEDULE: 'cafe1973_staff_schedule',
  ANNOUNCEMENTS: 'cafe1973_staff_announcements',
};

// Types
interface StaffUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface ClockStatus {
  clockedIn: boolean;
  clockInTime?: string;
  shiftId?: string;
}

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  breakStart?: string;
  breakEnd?: string;
}

interface Announcement {
  id: string;
  title: string;
  titleEs?: string;
  message: string;
  messageEs?: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
}

interface TimeOffRequest {
  startDate: string;
  endDate: string;
  reason: 'vacation' | 'sick' | 'personal' | 'other';
  notes: string;
}

// Content translations
const content = {
  header: {
    greeting: { en: 'Welcome back', es: 'Bienvenido', it: 'Bentornato', de: 'Willkommen zurück', fr: 'Bienvenue', sv: 'Välkommen tillbaka' },
    today: { en: 'Today', es: 'Hoy', it: 'Oggi', de: 'Heute', fr: "Aujourd'hui", sv: 'Idag' },
  },
  clock: {
    title: { en: 'Time Clock', es: 'Reloj de Tiempo', it: 'Orologio', de: 'Stempeluhr', fr: 'Pointeuse', sv: 'Tidsklocka' },
    clockIn: { en: 'Clock In', es: 'Registrar Entrada', it: 'Timbra Entrata', de: 'Einstempeln', fr: 'Pointer Entrée', sv: 'Stämpla In' },
    clockOut: { en: 'Clock Out', es: 'Registrar Salida', it: 'Timbra Uscita', de: 'Ausstempeln', fr: 'Pointer Sortie', sv: 'Stämpla Ut' },
    clockedInSince: { en: 'Clocked in since', es: 'Entrada registrada desde', it: 'Timbrato dalle', de: 'Eingestempelt seit', fr: 'Pointé depuis', sv: 'Instämplad sedan' },
    hoursToday: { en: 'Hours Today', es: 'Horas Hoy', it: 'Ore Oggi', de: 'Stunden Heute', fr: "Heures Aujourd'hui", sv: 'Timmar Idag' },
    currentShift: { en: 'Current Shift', es: 'Turno Actual', it: 'Turno Attuale', de: 'Aktuelle Schicht', fr: 'Quart Actuel', sv: 'Nuvarande Skift' },
    notClockedIn: { en: 'Not clocked in', es: 'Sin entrada registrada', it: 'Non timbrato', de: 'Nicht eingestempelt', fr: 'Non pointé', sv: 'Ej instämplad' },
  },
  schedule: {
    todayTitle: { en: "Today's Schedule", es: 'Horario de Hoy', it: 'Programma di Oggi', de: 'Heutiger Zeitplan', fr: "Horaire d'Aujourd'hui", sv: 'Dagens Schema' },
    weekTitle: { en: "This Week's Schedule", es: 'Horario de la Semana', it: 'Programma Settimanale', de: 'Wochenplan', fr: 'Horaire de la Semaine', sv: 'Veckans Schema' },
    noShiftToday: { en: 'No shift scheduled today', es: 'Sin turno programado hoy', it: 'Nessun turno programmato oggi', de: 'Heute keine Schicht geplant', fr: 'Pas de quart prévu aujourd\'hui', sv: 'Inget skift schemalagt idag' },
    noShifts: { en: 'No upcoming shifts', es: 'Sin turnos proximos', it: 'Nessun turno in arrivo', de: 'Keine bevorstehenden Schichten', fr: 'Pas de quarts à venir', sv: 'Inga kommande skift' },
    position: { en: 'Position', es: 'Puesto', it: 'Posizione', de: 'Position', fr: 'Poste', sv: 'Position' },
    break: { en: 'Break', es: 'Descanso', it: 'Pausa', de: 'Pause', fr: 'Pause', sv: 'Rast' },
  },
  quickActions: {
    title: { en: 'Quick Actions', es: 'Acciones Rapidas', it: 'Azioni Rapide', de: 'Schnellaktionen', fr: 'Actions Rapides', sv: 'Snabbåtgärder' },
    requestTimeOff: { en: 'Request Time Off', es: 'Solicitar Permiso', it: 'Richiedi Ferie', de: 'Urlaub Beantragen', fr: 'Demander un Congé', sv: 'Begär Ledighet' },
    viewPayStub: { en: 'View Pay Stub', es: 'Ver Recibo de Pago', it: 'Vedi Busta Paga', de: 'Gehaltsabrechnung Anzeigen', fr: 'Voir Bulletin de Paie', sv: 'Visa Lönebesked' },
    myHours: { en: 'My Hours This Week', es: 'Mis Horas Esta Semana', it: 'Le Mie Ore Questa Settimana', de: 'Meine Stunden Diese Woche', fr: 'Mes Heures Cette Semaine', sv: 'Mina Timmar Denna Vecka' },
  },
  announcements: {
    title: { en: 'Announcements', es: 'Anuncios', it: 'Annunci', de: 'Ankündigungen', fr: 'Annonces', sv: 'Meddelanden' },
    noAnnouncements: { en: 'No announcements', es: 'Sin anuncios', it: 'Nessun annuncio', de: 'Keine Ankündigungen', fr: 'Aucune annonce', sv: 'Inga meddelanden' },
    important: { en: 'Important', es: 'Importante', it: 'Importante', de: 'Wichtig', fr: 'Important', sv: 'Viktigt' },
    urgent: { en: 'Urgent', es: 'Urgente', it: 'Urgente', de: 'Dringend', fr: 'Urgent', sv: 'Brådskande' },
  },
  timeOff: {
    title: { en: 'Request Time Off', es: 'Solicitar Permiso', it: 'Richiedi Ferie', de: 'Urlaub Beantragen', fr: 'Demander un Congé', sv: 'Begär Ledighet' },
    startDate: { en: 'Start Date', es: 'Fecha de Inicio', it: 'Data Inizio', de: 'Startdatum', fr: 'Date de Début', sv: 'Startdatum' },
    endDate: { en: 'End Date', es: 'Fecha de Fin', it: 'Data Fine', de: 'Enddatum', fr: 'Date de Fin', sv: 'Slutdatum' },
    reason: { en: 'Reason', es: 'Razon', it: 'Motivo', de: 'Grund', fr: 'Raison', sv: 'Anledning' },
    notes: { en: 'Notes (optional)', es: 'Notas (opcional)', it: 'Note (opzionale)', de: 'Notizen (optional)', fr: 'Notes (optionnel)', sv: 'Anteckningar (valfritt)' },
    submit: { en: 'Submit Request', es: 'Enviar Solicitud', it: 'Invia Richiesta', de: 'Antrag Einreichen', fr: 'Envoyer la Demande', sv: 'Skicka Förfrågan' },
    cancel: { en: 'Cancel', es: 'Cancelar', it: 'Annulla', de: 'Abbrechen', fr: 'Annuler', sv: 'Avbryt' },
    vacation: { en: 'Vacation', es: 'Vacaciones', it: 'Vacanza', de: 'Urlaub', fr: 'Vacances', sv: 'Semester' },
    sick: { en: 'Sick Leave', es: 'Enfermedad', it: 'Malattia', de: 'Krankheit', fr: 'Maladie', sv: 'Sjukfrånvaro' },
    personal: { en: 'Personal', es: 'Personal', it: 'Personale', de: 'Persönlich', fr: 'Personnel', sv: 'Personligt' },
    other: { en: 'Other', es: 'Otro', it: 'Altro', de: 'Sonstiges', fr: 'Autre', sv: 'Annat' },
    success: { en: 'Request submitted successfully', es: 'Solicitud enviada exitosamente', it: 'Richiesta inviata con successo', de: 'Antrag erfolgreich eingereicht', fr: 'Demande envoyée avec succès', sv: 'Förfrågan skickad' },
  },
  logout: { en: 'Log Out', es: 'Cerrar Sesion', it: 'Esci', de: 'Abmelden', fr: 'Déconnexion', sv: 'Logga Ut' },
};

// Demo data initialization
const getDemoUser = (): StaffUser => ({
  id: 'emp-001',
  name: 'Maria Garcia',
  role: 'Barista',
  avatar: undefined,
});

const getDemoSchedule = (): Shift[] => {
  const today = new Date();
  const shifts: Shift[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();

    // Skip weekends for demo
    if (dayOfWeek === 0) continue;

    shifts.push({
      id: `shift-${i}`,
      date: date.toISOString().split('T')[0],
      startTime: dayOfWeek === 6 ? '09:00' : '08:00',
      endTime: dayOfWeek === 6 ? '14:00' : '16:00',
      position: 'Barista',
      breakStart: '12:00',
      breakEnd: '12:30',
    });
  }

  return shifts;
};

const getDemoAnnouncements = (): Announcement[] => [
  {
    id: 'ann-1',
    title: 'New Menu Items',
    titleEs: 'Nuevos Articulos del Menu',
    message: 'We are launching new seasonal drinks next week. Training session on Friday at 3 PM.',
    messageEs: 'Lanzaremos nuevas bebidas de temporada la proxima semana. Sesion de entrenamiento el viernes a las 3 PM.',
    date: new Date().toISOString(),
    priority: 'important',
  },
  {
    id: 'ann-2',
    title: 'Schedule Changes',
    titleEs: 'Cambios de Horario',
    message: 'Please check your schedules for next week. Some shifts have been adjusted.',
    messageEs: 'Por favor revisen sus horarios para la proxima semana. Algunos turnos han sido ajustados.',
    date: new Date(Date.now() - 86400000).toISOString(),
    priority: 'normal',
  },
  {
    id: 'ann-3',
    title: 'Health & Safety Reminder',
    titleEs: 'Recordatorio de Salud y Seguridad',
    message: 'Remember to wash hands frequently and follow all health protocols.',
    messageEs: 'Recuerden lavarse las manos frecuentemente y seguir todos los protocolos de salud.',
    date: new Date(Date.now() - 172800000).toISOString(),
    priority: 'normal',
  },
];

export const StaffPortal: React.FC = () => {
  const { language } = useLanguage();

  // State
  const [user, setUser] = useState<StaffUser | null>(null);
  const [clockStatus, setClockStatus] = useState<ClockStatus>({ clockedIn: false });
  const [schedule, setSchedule] = useState<Shift[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [timeOffRequest, setTimeOffRequest] = useState<TimeOffRequest>({
    startDate: '',
    endDate: '',
    reason: 'vacation',
    notes: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Locale map for date formatting
  const localeMap: Record<string, string> = {
    en: 'en-US', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR', sv: 'sv-SE'
  };

  // Helper function to get localized text
  const getText = (textObj: { en: string; es: string; it?: string; de?: string; fr?: string; sv?: string }) => {
    if (language === 'es' && textObj.es) return textObj.es;
    if (language in textObj && textObj[language as keyof typeof textObj]) {
      return textObj[language as keyof typeof textObj];
    }
    return textObj.en;
  };

  // Initialize data from localStorage or use demo data
  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem(STORAGE_KEYS.STAFF_USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const demoUser = getDemoUser();
      localStorage.setItem(STORAGE_KEYS.STAFF_USER, JSON.stringify(demoUser));
      setUser(demoUser);
    }

    // Load clock status
    const storedClock = localStorage.getItem(STORAGE_KEYS.CLOCK_STATUS);
    if (storedClock) {
      setClockStatus(JSON.parse(storedClock));
    } else {
      const defaultClock = { clockedIn: false };
      localStorage.setItem(STORAGE_KEYS.CLOCK_STATUS, JSON.stringify(defaultClock));
      setClockStatus(defaultClock);
    }

    // Load schedule
    const storedSchedule = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (storedSchedule) {
      setSchedule(JSON.parse(storedSchedule));
    } else {
      const demoSchedule = getDemoSchedule();
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(demoSchedule));
      setSchedule(demoSchedule);
    }

    // Load announcements
    const storedAnnouncements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      const demoAnnouncements = getDemoAnnouncements();
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(demoAnnouncements));
      setAnnouncements(demoAnnouncements);
    }
  }, []);

  // Get today's date formatted
  const todayFormatted = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString(localeMap[language] || 'en-US', options);
  }, [language]);

  // Get today's shift
  const todayShift = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return schedule.find(shift => shift.date === today);
  }, [schedule]);

  // Get this week's shifts (excluding today)
  const weekShifts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return schedule.filter(shift => shift.date > today).slice(0, 6);
  }, [schedule]);

  // Calculate hours worked today
  const hoursWorkedToday = useMemo(() => {
    if (!clockStatus.clockedIn || !clockStatus.clockInTime) return '0:00';

    const clockIn = new Date(clockStatus.clockInTime);
    const now = new Date();
    const diffMs = now.getTime() - clockIn.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }, [clockStatus]);

  // Handle clock in/out
  const handleClockToggle = () => {
    const newStatus: ClockStatus = clockStatus.clockedIn
      ? { clockedIn: false }
      : {
          clockedIn: true,
          clockInTime: new Date().toISOString(),
          shiftId: todayShift?.id
        };

    setClockStatus(newStatus);
    localStorage.setItem(STORAGE_KEYS.CLOCK_STATUS, JSON.stringify(newStatus));
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatShiftDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString(localeMap[language] || 'en-US', options);
  };

  // Handle time off submission
  const handleTimeOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to backend
    logger.debug('Time off request:', timeOffRequest);
    setShowTimeOffModal(false);
    setTimeOffRequest({ startDate: '', endDate: '', reason: 'vacation', notes: '' });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.STAFF_USER);
    localStorage.removeItem(STORAGE_KEYS.CLOCK_STATUS);
    // Redirect to login or home
    window.location.href = '/';
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get priority badge color
  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'important': return 'bg-amber-500 text-white';
      default: return 'bg-forest/10 text-forest';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <FloatingLanguageSelector />
        <div className="animate-pulse">
          <Coffee className="w-12 h-12 text-forest" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-8">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <span className="text-sm font-medium">{getText(content.timeOff.success)}</span>
          <button onClick={() => setShowSuccessMessage(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-forest px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-sand"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
                  <span className="text-forest font-bold text-lg">{getInitials(user.name)}</span>
                </div>
              )}
              <div>
                <p className="text-sand/80 text-sm">{getText(content.header.greeting)}</p>
                <h1 className="text-white font-bold text-lg">{user.name}</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={getText(content.logout)}
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-4 max-w-lg mx-auto space-y-4">
        {/* Clock In/Out Section */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="text-forest font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {getText(content.clock.title)}
          </h2>

          {/* Clock Button */}
          <button
            onClick={handleClockToggle}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              clockStatus.clockedIn
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {clockStatus.clockedIn ? (
              <>
                <Square className="w-6 h-6" />
                {getText(content.clock.clockOut)}
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                {getText(content.clock.clockIn)}
              </>
            )}
          </button>

          {/* Clock Status Info */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#faf8f3] rounded-xl p-3">
              <p className="text-xs text-forest/60 mb-1">
                {clockStatus.clockedIn
                  ? getText(content.clock.clockedInSince)
                  : getText(content.clock.currentShift)
                }
              </p>
              <p className="text-forest font-semibold">
                {clockStatus.clockedIn && clockStatus.clockInTime
                  ? new Date(clockStatus.clockInTime).toLocaleTimeString(localeMap[language] || 'en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : getText(content.clock.notClockedIn)
                }
              </p>
            </div>
            <div className="bg-[#faf8f3] rounded-xl p-3">
              <p className="text-xs text-forest/60 mb-1">{getText(content.clock.hoursToday)}</p>
              <p className="text-forest font-semibold text-xl">{hoursWorkedToday}</p>
            </div>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="text-forest font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {getText(content.schedule.todayTitle)}
          </h2>

          {todayShift ? (
            <div className="space-y-3">
              {/* Shift Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sand" />
                  </div>
                  <div>
                    <p className="text-forest font-bold">
                      {formatTime(todayShift.startTime)} - {formatTime(todayShift.endTime)}
                    </p>
                    <p className="text-forest/60 text-sm">{todayShift.position}</p>
                  </div>
                </div>
              </div>

              {/* Break Time */}
              {todayShift.breakStart && todayShift.breakEnd && (
                <div className="bg-sand/20 rounded-xl p-3 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-forest/60" />
                  <span className="text-sm text-forest/70">
                    {getText(content.schedule.break)}: {formatTime(todayShift.breakStart)} - {formatTime(todayShift.breakEnd)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-forest/50">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>{getText(content.schedule.noShiftToday)}</p>
            </div>
          )}
        </section>

        {/* This Week's Schedule */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="text-forest font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {getText(content.schedule.weekTitle)}
          </h2>

          {weekShifts.length > 0 ? (
            <div className="space-y-3">
              {weekShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 bg-[#faf8f3] rounded-xl"
                >
                  <div>
                    <p className="text-forest font-semibold text-sm">
                      {formatShiftDate(shift.date)}
                    </p>
                    <p className="text-forest/60 text-xs">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </p>
                  </div>
                  <span className="text-xs bg-forest/10 text-forest px-2 py-1 rounded-full">
                    {shift.position}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-forest/50">
              <p>{getText(content.schedule.noShifts)}</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="text-forest font-semibold text-lg mb-4">
            {getText(content.quickActions.title)}
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => setShowTimeOffModal(true)}
              className="w-full flex items-center justify-between p-4 bg-[#faf8f3] rounded-xl hover:bg-sand/30 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sand" />
                </div>
                <span className="text-forest font-medium">{getText(content.quickActions.requestTimeOff)}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-forest/40" />
            </button>

            <button
              className="w-full flex items-center justify-between p-4 bg-[#faf8f3] rounded-xl hover:bg-sand/30 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sand" />
                </div>
                <span className="text-forest font-medium">{getText(content.quickActions.viewPayStub)}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-forest/40" />
            </button>

            <button
              className="w-full flex items-center justify-between p-4 bg-[#faf8f3] rounded-xl hover:bg-sand/30 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sand" />
                </div>
                <span className="text-forest font-medium">{getText(content.quickActions.myHours)}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-forest/40" />
            </button>
          </div>
        </section>

        {/* Announcements */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="text-forest font-semibold text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {getText(content.announcements.title)}
          </h2>

          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 bg-[#faf8f3] rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-forest font-semibold text-sm">
                      {language === 'es' && announcement.titleEs
                        ? announcement.titleEs
                        : announcement.title}
                    </h3>
                    {announcement.priority !== 'normal' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority === 'urgent'
                          ? getText(content.announcements.urgent)
                          : getText(content.announcements.important)
                        }
                      </span>
                    )}
                  </div>
                  <p className="text-forest/70 text-sm leading-relaxed">
                    {language === 'es' && announcement.messageEs
                      ? announcement.messageEs
                      : announcement.message}
                  </p>
                  <p className="text-forest/40 text-xs mt-2">
                    {new Date(announcement.date).toLocaleDateString(
                      localeMap[language] || 'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-forest/50">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>{getText(content.announcements.noAnnouncements)}</p>
            </div>
          )}
        </section>
      </main>

      {/* Time Off Request Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
          >
            <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-sand/30">
              <div className="flex items-center justify-between">
                <h2 className="text-forest font-bold text-xl">
                  {getText(content.timeOff.title)}
                </h2>
                <button
                  onClick={() => setShowTimeOffModal(false)}
                  className="p-2 rounded-full hover:bg-[#faf8f3] transition-colors"
                >
                  <X className="w-5 h-5 text-forest" />
                </button>
              </div>
            </div>

            <form onSubmit={handleTimeOffSubmit} className="p-5 space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.timeOff.startDate)} *
                </label>
                <input
                  type="date"
                  required
                  value={timeOffRequest.startDate}
                  onChange={(e) => setTimeOffRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.timeOff.endDate)} *
                </label>
                <input
                  type="date"
                  required
                  value={timeOffRequest.endDate}
                  onChange={(e) => setTimeOffRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  min={timeOffRequest.startDate}
                  className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.timeOff.reason)} *
                </label>
                <select
                  required
                  value={timeOffRequest.reason}
                  onChange={(e) => setTimeOffRequest(prev => ({
                    ...prev,
                    reason: e.target.value as TimeOffRequest['reason']
                  }))}
                  className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="vacation">{getText(content.timeOff.vacation)}</option>
                  <option value="sick">{getText(content.timeOff.sick)}</option>
                  <option value="personal">{getText(content.timeOff.personal)}</option>
                  <option value="other">{getText(content.timeOff.other)}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  {getText(content.timeOff.notes)}
                </label>
                <textarea
                  value={timeOffRequest.notes}
                  onChange={(e) => setTimeOffRequest(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest resize-none"
                  placeholder={getText({ en: 'Add additional notes...', es: 'Agregar notas adicionales...', it: 'Aggiungi note aggiuntive...', de: 'Zusätzliche Notizen hinzufügen...', fr: 'Ajouter des notes supplémentaires...', sv: 'Lägg till ytterligare anteckningar...' })}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTimeOffModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-forest text-forest font-medium hover:bg-forest hover:text-white transition-colors"
                >
                  {getText(content.timeOff.cancel)}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-forest text-white font-medium hover:bg-forest/90 transition-colors"
                >
                  {getText(content.timeOff.submit)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StaffPortal;
