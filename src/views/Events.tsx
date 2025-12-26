/**
 * Cafe 1973 - Events & Events Page
 * Mobile-first design with bilingual support
 * Services, packages, gallery, inquiry form, testimonials, and FAQ
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  UtensilsCrossed,
  Calendar,
  Users,
  Cake,
  Coffee,
  PartyPopper,
  Building,
  Phone,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  Star,
  Quote,
  Image,
} from 'lucide-react';

// Content translations
const content = {
  hero: {
    title: { en: 'Events & Events', es: 'Events y Eventos', it: 'Eventi e Catering', de: 'Events & Veranstaltungen', fr: 'Events & Événements', sv: 'Event & Catering' },
    subtitle: {
      en: 'Let us make your special occasion unforgettable with our artisan pastries and exceptional service',
      es: 'Hagamos de tu ocasion especial algo inolvidable con nuestras pastelerias artesanales y servicio excepcional',
      it: 'Rendiamo la tua occasione speciale indimenticabile con le nostre pasticcerie artigianali e un servizio eccezionale',
      de: 'Lassen Sie uns Ihren besonderen Anlass mit unseren handwerklichen Backwaren und außergewöhnlichem Service unvergesslich machen',
      fr: 'Rendons votre occasion spéciale inoubliable avec nos pâtisseries artisanales et un service exceptionnel',
      sv: 'Låt oss göra ditt speciella tillfälle oförglömligt med våra hantverksbagerier och exceptionell service',
    },
  },
  services: {
    title: { en: 'Our Services', es: 'Nuestros Servicios', it: 'I Nostri Servizi', de: 'Unsere Dienstleistungen', fr: 'Nos Services', sv: 'Våra Tjänster' },
    subtitle: {
      en: 'From intimate gatherings to large celebrations, we have you covered',
      es: 'Desde reuniones intimas hasta grandes celebraciones, te tenemos cubierto',
      it: 'Da incontri intimi a grandi celebrazioni, siamo qui per te',
      de: 'Von intimen Zusammenkünften bis zu großen Feiern, wir haben alles für Sie',
      fr: 'Des réunions intimes aux grandes célébrations, nous avons ce qu\'il vous faut',
      sv: 'Från intima sammankomster till stora firanden, vi har allt du behöver',
    },
    items: [
      {
        icon: Building,
        title: { en: 'Corporate Events', es: 'Eventos Corporativos', it: 'Eventi Aziendali', de: 'Firmenveranstaltungen', fr: 'Événements d\'Entreprise', sv: 'Företagsevent' },
        description: {
          en: 'Meetings, conferences, and corporate celebrations. Professional service with premium quality.',
          es: 'Reuniones, conferencias y celebraciones corporativas. Servicio profesional con calidad premium.',
          it: 'Riunioni, conferenze e celebrazioni aziendali. Servizio professionale con qualità premium.',
          de: 'Besprechungen, Konferenzen und Firmenfeiern. Professioneller Service mit Premium-Qualität.',
          fr: 'Réunions, conférences et célébrations d\'entreprise. Service professionnel avec qualité premium.',
          sv: 'Möten, konferenser och företagsfiranden. Professionell service med premiumkvalitet.',
        },
      },
      {
        icon: PartyPopper,
        title: { en: 'Social Events', es: 'Eventos Sociales', it: 'Eventi Sociali', de: 'Soziale Veranstaltungen', fr: 'Événements Sociaux', sv: 'Sociala Evenemang' },
        description: {
          en: 'Birthdays, anniversaries, baby showers, and family gatherings. Make every moment special.',
          es: 'Cumpleanos, aniversarios, baby showers y reuniones familiares. Haz cada momento especial.',
          it: 'Compleanni, anniversari, baby shower e riunioni di famiglia. Rendi ogni momento speciale.',
          de: 'Geburtstage, Jubiläen, Babypartys und Familientreffen. Machen Sie jeden Moment besonders.',
          fr: 'Anniversaires, célébrations, baby showers et réunions de famille. Rendez chaque moment spécial.',
          sv: 'Födelsedagar, jubileum, babyshower och familjesammankomster. Gör varje stund speciell.',
        },
      },
      {
        icon: Cake,
        title: { en: 'Weddings', es: 'Bodas', it: 'Matrimoni', de: 'Hochzeiten', fr: 'Mariages', sv: 'Bröllop' },
        description: {
          en: 'Elegant dessert tables, custom wedding cakes, and sweet stations for your perfect day.',
          es: 'Mesas de postres elegantes, pasteles de boda personalizados y estaciones de dulces para tu dia perfecto.',
          it: 'Tavoli di dolci eleganti, torte nuziali personalizzate e stazioni di dolci per il tuo giorno perfetto.',
          de: 'Elegante Desserttische, maßgeschneiderte Hochzeitstorten und Süßigkeitenstationen für Ihren perfekten Tag.',
          fr: 'Tables de desserts élégantes, gâteaux de mariage personnalisés et stands de douceurs pour votre journée parfaite.',
          sv: 'Eleganta dessertbord, anpassade bröllopstårtor och godissrationer för din perfekta dag.',
        },
      },
      {
        icon: UtensilsCrossed,
        title: { en: 'Custom Orders', es: 'Pedidos Personalizados', it: 'Ordini Personalizzati', de: 'Individuelle Bestellungen', fr: 'Commandes Personnalisées', sv: 'Anpassade Beställningar' },
        description: {
          en: 'Special occasion cakes, themed desserts, and personalized creations for any event.',
          es: 'Pasteles para ocasiones especiales, postres tematicos y creaciones personalizadas para cualquier evento.',
          it: 'Torte per occasioni speciali, dolci tematici e creazioni personalizzate per ogni evento.',
          de: 'Kuchen für besondere Anlässe, thematische Desserts und personalisierte Kreationen für jede Veranstaltung.',
          fr: 'Gâteaux pour occasions spéciales, desserts thématiques et créations personnalisées pour tout événement.',
          sv: 'Kakor för speciella tillfällen, tematiska desserter och personliga skapelser för alla evenemang.',
        },
      },
    ],
  },
  packages: {
    title: { en: 'Popular Packages', es: 'Paquetes Populares', it: 'Pacchetti Popolari', de: 'Beliebte Pakete', fr: 'Forfaits Populaires', sv: 'Populära Paket' },
    subtitle: {
      en: 'Choose from our carefully curated packages or customize your own',
      es: 'Elige entre nuestros paquetes cuidadosamente curados o personaliza el tuyo',
      it: 'Scegli tra i nostri pacchetti accuratamente curati o personalizza il tuo',
      de: 'Wählen Sie aus unseren sorgfältig zusammengestellten Paketen oder erstellen Sie Ihr eigenes',
      fr: 'Choisissez parmi nos forfaits soigneusement sélectionnés ou personnalisez le vôtre',
      sv: 'Välj bland våra noggrant utvalda paket eller anpassa ditt eget',
    },
    items: [
      {
        icon: Coffee,
        title: { en: 'Coffee Break', es: 'Coffee Break', it: 'Coffee Break', de: 'Kaffeepause', fr: 'Pause Café', sv: 'Kafferast' },
        price: '15,000',
        priceNote: { en: '/person', es: '/persona', it: '/persona', de: '/Person', fr: '/personne', sv: '/person' },
        description: {
          en: 'Perfect for meetings and workshops',
          es: 'Perfecto para reuniones y talleres',
          it: 'Perfetto per riunioni e workshop',
          de: 'Perfekt für Meetings und Workshops',
          fr: 'Parfait pour les réunions et ateliers',
          sv: 'Perfekt för möten och workshops',
        },
        includes: {
          en: ['Premium coffee & tea service', 'Assorted pastries', 'Fresh fruit', 'Juice selection'],
          es: ['Servicio de cafe y te premium', 'Pasteleria surtida', 'Frutas frescas', 'Seleccion de jugos'],
          it: ['Servizio di caffè e tè premium', 'Assortimento di pasticcini', 'Frutta fresca', 'Selezione di succhi'],
          de: ['Premium Kaffee- & Teeservice', 'Verschiedene Gebäcksorten', 'Frisches Obst', 'Saftauswahl'],
          fr: ['Service café et thé premium', 'Assortiment de pâtisseries', 'Fruits frais', 'Sélection de jus'],
          sv: ['Premium kaffe- och teservice', 'Blandade bakverk', 'Färsk frukt', 'Juiceutbud'],
        },
      },
      {
        icon: UtensilsCrossed,
        title: { en: 'Brunch Package', es: 'Paquete Brunch', it: 'Pacchetto Brunch', de: 'Brunch-Paket', fr: 'Forfait Brunch', sv: 'Brunchpaket' },
        price: '25,000',
        priceNote: { en: '/person', es: '/persona', it: '/persona', de: '/Person', fr: '/personne', sv: '/person' },
        description: {
          en: 'Complete brunch experience',
          es: 'Experiencia completa de brunch',
          it: 'Esperienza completa di brunch',
          de: 'Komplettes Brunch-Erlebnis',
          fr: 'Expérience brunch complète',
          sv: 'Komplett brunchupplevelse',
        },
        includes: {
          en: ['Full breakfast selection', 'Hot dishes', 'Pastry assortment', 'Beverages included', 'Setup & service'],
          es: ['Seleccion completa de desayuno', 'Platos calientes', 'Surtido de pasteleria', 'Bebidas incluidas', 'Montaje y servicio'],
          it: ['Selezione completa di colazione', 'Piatti caldi', 'Assortimento di pasticceria', 'Bevande incluse', 'Allestimento e servizio'],
          de: ['Vollständige Frühstücksauswahl', 'Warme Gerichte', 'Gebäcksortiment', 'Getränke inklusive', 'Aufbau & Service'],
          fr: ['Sélection complète de petit-déjeuner', 'Plats chauds', 'Assortiment de pâtisseries', 'Boissons incluses', 'Installation et service'],
          sv: ['Komplett frukostutbud', 'Varma rätter', 'Bakverkssortiment', 'Drycker inkluderade', 'Uppställning & service'],
        },
        popular: true,
      },
      {
        icon: Cake,
        title: { en: 'Dessert Table', es: 'Mesa de Postres', it: 'Tavolo dei Dolci', de: 'Desserttisch', fr: 'Table de Desserts', sv: 'Dessertbord' },
        price: '75,000',
        priceNote: { en: 'base price', es: 'precio base', it: 'prezzo base', de: 'Grundpreis', fr: 'prix de base', sv: 'grundpris' },
        description: {
          en: 'Customizable dessert display',
          es: 'Display de postres personalizable',
          it: 'Esposizione di dolci personalizzabile',
          de: 'Anpassbare Dessertpräsentation',
          fr: 'Présentation de desserts personnalisable',
          sv: 'Anpassningsbar dessertdisplay',
        },
        includes: {
          en: ['5+ dessert varieties', 'Elegant presentation', 'Custom decorations', 'Serving staff option', 'Themed options available'],
          es: ['5+ variedades de postres', 'Presentacion elegante', 'Decoraciones personalizadas', 'Opcion de personal de servicio', 'Opciones tematicas disponibles'],
          it: ['5+ varietà di dolci', 'Presentazione elegante', 'Decorazioni personalizzate', 'Opzione personale di servizio', 'Opzioni tematiche disponibili'],
          de: ['5+ Dessertsorten', 'Elegante Präsentation', 'Individuelle Dekorationen', 'Servicepersonal-Option', 'Themenoptionen verfügbar'],
          fr: ['5+ variétés de desserts', 'Présentation élégante', 'Décorations personnalisées', 'Option personnel de service', 'Options thématiques disponibles'],
          sv: ['5+ dessertvarianter', 'Elegant presentation', 'Anpassade dekorationer', 'Serveringspersonalval', 'Tematiska alternativ tillgängliga'],
        },
      },
    ],
  },
  gallery: {
    title: { en: 'Our Work', es: 'Nuestro Trabajo', it: 'Il Nostro Lavoro', de: 'Unsere Arbeit', fr: 'Notre Travail', sv: 'Vårt Arbete' },
    subtitle: {
      en: 'A glimpse of our past events and creations',
      es: 'Un vistazo a nuestros eventos y creaciones pasadas',
      it: 'Uno sguardo ai nostri eventi e creazioni passate',
      de: 'Ein Einblick in unsere vergangenen Veranstaltungen und Kreationen',
      fr: 'Un aperçu de nos événements et créations passés',
      sv: 'En glimt av våra tidigare evenemang och skapelser',
    },
  },
  form: {
    title: { en: 'Request a Quote', es: 'Solicitar Cotizacion', it: 'Richiedi un Preventivo', de: 'Angebot Anfordern', fr: 'Demander un Devis', sv: 'Begär Offert' },
    subtitle: {
      en: 'Tell us about your event and we will get back to you within 24 hours',
      es: 'Cuentanos sobre tu evento y te responderemos en 24 horas',
      it: 'Raccontaci del tuo evento e ti risponderemo entro 24 ore',
      de: 'Erzählen Sie uns von Ihrer Veranstaltung und wir melden uns innerhalb von 24 Stunden bei Ihnen',
      fr: 'Parlez-nous de votre événement et nous vous répondrons dans les 24 heures',
      sv: 'Berätta om ditt evenemang så återkommer vi inom 24 timmar',
    },
    fields: {
      eventType: { en: 'Event Type', es: 'Tipo de Evento', it: 'Tipo di Evento', de: 'Veranstaltungstyp', fr: 'Type d\'Événement', sv: 'Eventtyp' },
      eventTypeOptions: [
        { value: '', label: { en: 'Select event type', es: 'Selecciona tipo de evento', it: 'Seleziona tipo di evento', de: 'Veranstaltungstyp wählen', fr: 'Sélectionner le type d\'événement', sv: 'Välj eventtyp' } },
        { value: 'corporate', label: { en: 'Corporate Event', es: 'Evento Corporativo', it: 'Evento Aziendale', de: 'Firmenveranstaltung', fr: 'Événement d\'Entreprise', sv: 'Företagsevent' } },
        { value: 'birthday', label: { en: 'Birthday', es: 'Cumpleanos', it: 'Compleanno', de: 'Geburtstag', fr: 'Anniversaire', sv: 'Födelsedag' } },
        { value: 'wedding', label: { en: 'Wedding', es: 'Boda', it: 'Matrimonio', de: 'Hochzeit', fr: 'Mariage', sv: 'Bröllop' } },
        { value: 'anniversary', label: { en: 'Anniversary', es: 'Aniversario', it: 'Anniversario', de: 'Jubiläum', fr: 'Anniversaire', sv: 'Jubileum' } },
        { value: 'babyshower', label: { en: 'Baby Shower', es: 'Baby Shower', it: 'Baby Shower', de: 'Babyparty', fr: 'Baby Shower', sv: 'Babyshower' } },
        { value: 'graduation', label: { en: 'Graduation', es: 'Graduacion', it: 'Laurea', de: 'Abschlussfeier', fr: 'Remise de Diplôme', sv: 'Examen' } },
        { value: 'other', label: { en: 'Other', es: 'Otro', it: 'Altro', de: 'Sonstiges', fr: 'Autre', sv: 'Annat' } },
      ],
      date: { en: 'Event Date', es: 'Fecha del Evento', it: 'Data dell\'Evento', de: 'Veranstaltungsdatum', fr: 'Date de l\'Événement', sv: 'Eventdatum' },
      guests: { en: 'Number of Guests', es: 'Numero de Invitados', it: 'Numero di Ospiti', de: 'Anzahl der Gäste', fr: 'Nombre d\'Invités', sv: 'Antal Gäster' },
      budget: { en: 'Budget Range', es: 'Rango de Presupuesto', it: 'Fascia di Budget', de: 'Budgetbereich', fr: 'Fourchette Budgétaire', sv: 'Budgetintervall' },
      budgetOptions: [
        { value: '', label: { en: 'Select budget range', es: 'Selecciona rango de presupuesto', it: 'Seleziona fascia di budget', de: 'Budgetbereich wählen', fr: 'Sélectionner la fourchette budgétaire', sv: 'Välj budgetintervall' } },
        { value: 'under100k', label: { en: 'Under 100,000', es: 'Menos de 100,000', it: 'Meno di 100.000', de: 'Unter 100.000', fr: 'Moins de 100 000', sv: 'Under 100 000' } },
        { value: '100k-250k', label: { en: '100,000 - 250,000', es: '100,000 - 250,000', it: '100.000 - 250.000', de: '100.000 - 250.000', fr: '100 000 - 250 000', sv: '100 000 - 250 000' } },
        { value: '250k-500k', label: { en: '250,000 - 500,000', es: '250,000 - 500,000', it: '250.000 - 500.000', de: '250.000 - 500.000', fr: '250 000 - 500 000', sv: '250 000 - 500 000' } },
        { value: 'over500k', label: { en: 'Over 500,000', es: 'Mas de 500,000', it: 'Oltre 500.000', de: 'Über 500.000', fr: 'Plus de 500 000', sv: 'Över 500 000' } },
      ],
      notes: { en: 'Additional Notes', es: 'Notas Adicionales', it: 'Note Aggiuntive', de: 'Zusätzliche Anmerkungen', fr: 'Notes Supplémentaires', sv: 'Ytterligare Anteckningar' },
      notesPlaceholder: {
        en: 'Tell us more about your event, preferences, dietary requirements...',
        es: 'Cuentanos mas sobre tu evento, preferencias, requisitos dieteticos...',
        it: 'Raccontaci di più sul tuo evento, preferenze, requisiti dietetici...',
        de: 'Erzählen Sie uns mehr über Ihre Veranstaltung, Vorlieben, Ernährungsanforderungen...',
        fr: 'Parlez-nous de votre événement, préférences, exigences alimentaires...',
        sv: 'Berätta mer om ditt evenemang, preferenser, kostrestriktioner...',
      },
      name: { en: 'Your Name', es: 'Tu Nombre', it: 'Il Tuo Nome', de: 'Ihr Name', fr: 'Votre Nom', sv: 'Ditt Namn' },
      email: { en: 'Email', es: 'Correo Electronico', it: 'Email', de: 'E-Mail', fr: 'Email', sv: 'E-post' },
      phone: { en: 'Phone Number', es: 'Numero de Telefono', it: 'Numero di Telefono', de: 'Telefonnummer', fr: 'Numéro de Téléphone', sv: 'Telefonnummer' },
      submit: { en: 'Send Inquiry', es: 'Enviar Consulta', it: 'Invia Richiesta', de: 'Anfrage Senden', fr: 'Envoyer la Demande', sv: 'Skicka Förfrågan' },
      submitting: { en: 'Sending...', es: 'Enviando...', it: 'Invio...', de: 'Wird gesendet...', fr: 'Envoi...', sv: 'Skickar...' },
    },
    success: {
      title: { en: 'Inquiry Sent!', es: 'Consulta Enviada!', it: 'Richiesta Inviata!', de: 'Anfrage Gesendet!', fr: 'Demande Envoyée!', sv: 'Förfrågan Skickad!' },
      message: {
        en: 'Thank you for your interest. Our events team will contact you within 24 hours.',
        es: 'Gracias por tu interes. Nuestro equipo de events te contactara en 24 horas.',
        it: 'Grazie per il tuo interesse. Il nostro team eventi ti contatterà entro 24 ore.',
        de: 'Vielen Dank für Ihr Interesse. Unser Events-Team wird sich innerhalb von 24 Stunden bei Ihnen melden.',
        fr: 'Merci pour votre intérêt. Notre équipe événements vous contactera dans les 24 heures.',
        sv: 'Tack för ditt intresse. Vårt eventteam kommer att kontakta dig inom 24 timmar.',
      },
      another: { en: 'Send Another Inquiry', es: 'Enviar Otra Consulta', it: 'Invia Altra Richiesta', de: 'Weitere Anfrage Senden', fr: 'Envoyer une Autre Demande', sv: 'Skicka Ytterligare Förfrågan' },
    },
  },
  testimonials: {
    title: { en: 'What Our Clients Say', es: 'Lo que Dicen Nuestros Clientes', it: 'Cosa Dicono i Nostri Clienti', de: 'Was Unsere Kunden Sagen', fr: 'Ce Que Disent Nos Clients', sv: 'Vad Våra Kunder Säger' },
    items: [
      {
        name: 'Maria Elena Jimenez',
        event: { en: 'Wedding Reception', es: 'Recepcion de Boda', it: 'Ricevimento di Nozze', de: 'Hochzeitsempfang', fr: 'Réception de Mariage', sv: 'Bröllopsmottagning' },
        quote: {
          en: 'The dessert table was absolutely stunning! Our guests couldnt stop raving about the quality and presentation. Cafe 1973 made our special day even more memorable.',
          es: 'La mesa de postres fue absolutamente impresionante! Nuestros invitados no podian dejar de hablar de la calidad y presentacion. Cafe 1973 hizo nuestro dia especial aun mas memorable.',
          it: 'Il tavolo dei dolci era assolutamente splendido! I nostri ospiti non smettevano di elogiare la qualità e la presentazione. Cafe 1973 ha reso il nostro giorno speciale ancora più memorabile.',
          de: 'Der Desserttisch war absolut atemberaubend! Unsere Gäste schwärmten ständig von der Qualität und Präsentation. Cafe 1973 hat unseren besonderen Tag noch unvergesslicher gemacht.',
          fr: 'La table de desserts était absolument magnifique! Nos invités n\'arrêtaient pas de vanter la qualité et la présentation. Cafe 1973 a rendu notre journée spéciale encore plus mémorable.',
          sv: 'Dessertbordet var helt fantastiskt! Våra gäster kunde inte sluta prata om kvaliteten och presentationen. Cafe 1973 gjorde vår speciella dag ännu mer minnesvärd.',
        },
        rating: 5,
      },
      {
        name: 'Carlos Mendez',
        event: { en: 'Corporate Conference', es: 'Conferencia Corporativa', it: 'Conferenza Aziendale', de: 'Firmenkonferenz', fr: 'Conférence d\'Entreprise', sv: 'Företagskonferens' },
        quote: {
          en: 'Professional service from start to finish. The coffee break packages were a hit with our clients. Will definitely use their services again.',
          es: 'Servicio profesional de principio a fin. Los paquetes de coffee break fueron un exito con nuestros clientes. Definitivamente usaremos sus servicios de nuevo.',
          it: 'Servizio professionale dall\'inizio alla fine. I pacchetti coffee break hanno avuto un grande successo con i nostri clienti. Utilizzeremo sicuramente i loro servizi di nuovo.',
          de: 'Professioneller Service von Anfang bis Ende. Die Kaffeepausen-Pakete waren ein Hit bei unseren Kunden. Werden ihre Dienste definitiv wieder nutzen.',
          fr: 'Service professionnel du début à la fin. Les forfaits pause café ont été un succès auprès de nos clients. Nous utiliserons certainement leurs services à nouveau.',
          sv: 'Professionell service från start till mål. Kafferastpaketen var en succé hos våra kunder. Kommer definitivt att använda deras tjänster igen.',
        },
        rating: 5,
      },
      {
        name: 'Ana Patricia Solis',
        event: { en: "Daughter's Quinceañera", es: 'Quinceanera de mi Hija', it: 'Quinceañera di Mia Figlia', de: 'Quinceañera Meiner Tochter', fr: 'Quinceañera de Ma Fille', sv: 'Min Dotters Quinceañera' },
        quote: {
          en: 'They created the most beautiful custom cake for my daughters quinceañera. The attention to detail was incredible and it tasted even better than it looked!',
          es: 'Crearon el pastel personalizado mas hermoso para la quinceanera de mi hija. La atencion al detalle fue increible y sabia aun mejor de lo que se veia!',
          it: 'Hanno creato la torta personalizzata più bella per la quinceañera di mia figlia. L\'attenzione ai dettagli era incredibile e il sapore era ancora migliore dell\'aspetto!',
          de: 'Sie haben die schönste individuelle Torte für die Quinceañera meiner Tochter kreiert. Die Liebe zum Detail war unglaublich und sie schmeckte noch besser als sie aussah!',
          fr: 'Ils ont créé le plus beau gâteau personnalisé pour la quinceañera de ma fille. L\'attention aux détails était incroyable et le goût était encore meilleur que l\'apparence!',
          sv: 'De skapade den vackraste anpassade tårtan för min dotters quinceañera. Detaljerna var otroliga och den smakade ännu bättre än den såg ut!',
        },
        rating: 5,
      },
    ],
  },
  faq: {
    title: { en: 'Frequently Asked Questions', es: 'Preguntas Frecuentes', it: 'Domande Frequenti', de: 'Häufig Gestellte Fragen', fr: 'Questions Fréquentes', sv: 'Vanliga Frågor' },
    items: [
      {
        question: {
          en: 'How far in advance should I book?',
          es: 'Con cuanta anticipacion debo reservar?',
          it: 'Con quanto anticipo dovrei prenotare?',
          de: 'Wie weit im Voraus sollte ich buchen?',
          fr: 'Combien de temps à l\'avance dois-je réserver?',
          sv: 'Hur långt i förväg bör jag boka?',
        },
        answer: {
          en: 'We recommend booking at least 2-3 weeks in advance for small events and 4-6 weeks for larger events or weddings. During peak season (November-January), earlier booking is recommended.',
          es: 'Recomendamos reservar con al menos 2-3 semanas de anticipacion para eventos pequenos y 4-6 semanas para eventos grandes o bodas. Durante temporada alta (Noviembre-Enero), se recomienda reservar con mas anticipacion.',
          it: 'Consigliamo di prenotare con almeno 2-3 settimane di anticipo per eventi piccoli e 4-6 settimane per eventi più grandi o matrimoni. Durante l\'alta stagione (novembre-gennaio), si raccomanda di prenotare con maggiore anticipo.',
          de: 'Wir empfehlen eine Buchung mindestens 2-3 Wochen im Voraus für kleinere Veranstaltungen und 4-6 Wochen für größere Veranstaltungen oder Hochzeiten. Während der Hochsaison (November-Januar) wird eine frühere Buchung empfohlen.',
          fr: 'Nous recommandons de réserver au moins 2-3 semaines à l\'avance pour les petits événements et 4-6 semaines pour les grands événements ou mariages. Pendant la haute saison (novembre-janvier), une réservation plus précoce est recommandée.',
          sv: 'Vi rekommenderar att boka minst 2-3 veckor i förväg för små evenemang och 4-6 veckor för större evenemang eller bröllop. Under högsäsong (november-januari) rekommenderas tidigare bokning.',
        },
      },
      {
        question: {
          en: 'Do you accommodate dietary restrictions?',
          es: 'Acomodan restricciones dieteticas?',
          it: 'Accettate restrizioni dietetiche?',
          de: 'Berücksichtigen Sie Ernährungseinschränkungen?',
          fr: 'Accommodez-vous les restrictions alimentaires?',
          sv: 'Tillgodoser ni kostrestriktioner?',
        },
        answer: {
          en: 'Yes! We can accommodate gluten-free, vegan, sugar-free, and other dietary requirements. Please let us know your needs when making your inquiry.',
          es: 'Si! Podemos acomodar opciones sin gluten, veganas, sin azucar y otros requisitos dieteticos. Por favor indicanos tus necesidades al hacer tu consulta.',
          it: 'Sì! Possiamo soddisfare esigenze senza glutine, vegane, senza zucchero e altri requisiti dietetici. Si prega di comunicarci le vostre esigenze quando fate la vostra richiesta.',
          de: 'Ja! Wir können glutenfreie, vegane, zuckerfreie und andere Ernährungsanforderungen berücksichtigen. Bitte teilen Sie uns Ihre Bedürfnisse bei Ihrer Anfrage mit.',
          fr: 'Oui! Nous pouvons accommoder les options sans gluten, véganes, sans sucre et autres exigences alimentaires. Veuillez nous faire part de vos besoins lors de votre demande.',
          sv: 'Ja! Vi kan tillgodose glutenfria, veganska, sockerfria och andra kostrestriktioner. Vänligen meddela oss dina behov när du gör din förfrågan.',
        },
      },
      {
        question: {
          en: 'What is included in the setup?',
          es: 'Que incluye el montaje?',
          it: 'Cosa è incluso nell\'allestimento?',
          de: 'Was ist im Aufbau enthalten?',
          fr: 'Qu\'est-ce qui est inclus dans l\'installation?',
          sv: 'Vad ingår i uppställningen?',
        },
        answer: {
          en: 'Our packages include delivery, setup, and presentation. For dessert tables and larger events, we provide elegant displays and can coordinate with your event planner for seamless integration.',
          es: 'Nuestros paquetes incluyen entrega, montaje y presentacion. Para mesas de postres y eventos grandes, proporcionamos displays elegantes y podemos coordinar con tu organizador de eventos para una integracion perfecta.',
          it: 'I nostri pacchetti includono consegna, allestimento e presentazione. Per tavoli di dolci ed eventi più grandi, forniamo display eleganti e possiamo coordinarci con il vostro organizzatore di eventi per un\'integrazione perfetta.',
          de: 'Unsere Pakete beinhalten Lieferung, Aufbau und Präsentation. Für Desserttische und größere Veranstaltungen bieten wir elegante Displays und können mit Ihrem Eventplaner für eine nahtlose Integration koordinieren.',
          fr: 'Nos forfaits incluent la livraison, l\'installation et la présentation. Pour les tables de desserts et les grands événements, nous fournissons des présentoirs élégants et pouvons nous coordonner avec votre organisateur d\'événements pour une intégration transparente.',
          sv: 'Våra paket inkluderar leverans, uppställning och presentation. För dessertbord och större evenemang tillhandahåller vi eleganta displayer och kan samordna med din eventplanerare för sömlös integration.',
        },
      },
      {
        question: {
          en: 'Do you offer tastings?',
          es: 'Ofrecen degustaciones?',
          it: 'Offrite degustazioni?',
          de: 'Bieten Sie Verkostungen an?',
          fr: 'Proposez-vous des dégustations?',
          sv: 'Erbjuder ni provsmakningar?',
        },
        answer: {
          en: 'Yes, we offer complimentary tastings for weddings and large events (50+ guests). For smaller events, tastings can be arranged for a nominal fee that is credited to your final order.',
          es: 'Si, ofrecemos degustaciones de cortesia para bodas y eventos grandes (50+ invitados). Para eventos mas pequenos, las degustaciones se pueden coordinar por una tarifa nominal que se acredita a tu pedido final.',
          it: 'Sì, offriamo degustazioni gratuite per matrimoni ed eventi grandi (50+ ospiti). Per eventi più piccoli, le degustazioni possono essere organizzate con una tariffa nominale che viene accreditata al vostro ordine finale.',
          de: 'Ja, wir bieten kostenlose Verkostungen für Hochzeiten und große Veranstaltungen (50+ Gäste) an. Für kleinere Veranstaltungen können Verkostungen gegen eine geringe Gebühr vereinbart werden, die Ihrer Endbestellung gutgeschrieben wird.',
          fr: 'Oui, nous offrons des dégustations gratuites pour les mariages et grands événements (50+ invités). Pour les petits événements, les dégustations peuvent être organisées moyennant des frais nominaux qui sont crédités à votre commande finale.',
          sv: 'Ja, vi erbjuder gratis provsmakningar för bröllop och stora evenemang (50+ gäster). För mindre evenemang kan provsmakningar arrangeras mot en nominell avgift som krediteras till din slutliga beställning.',
        },
      },
      {
        question: {
          en: 'What areas do you serve?',
          es: 'Que areas cubren?',
          it: 'Quali aree servite?',
          de: 'Welche Gebiete bedienen Sie?',
          fr: 'Quelles zones desservez-vous?',
          sv: 'Vilka områden betjänar ni?',
        },
        answer: {
          en: 'We serve the entire Greater Metropolitan Area (GAM) of San Jose. For locations outside the GAM, please contact us to discuss delivery options and potential additional fees.',
          es: 'Cubrimos toda el Area Metropolitana (GAM) de San Jose. Para ubicaciones fuera del GAM, contactanos para discutir opciones de entrega y posibles tarifas adicionales.',
          it: 'Serviamo l\'intera Area Metropolitana (GAM) di San Jose. Per località al di fuori del GAM, contattateci per discutere le opzioni di consegna e possibili costi aggiuntivi.',
          de: 'Wir bedienen das gesamte Großraum-Metropolgebiet (GAM) von San Jose. Für Standorte außerhalb des GAM kontaktieren Sie uns bitte, um Lieferoptionen und mögliche Zusatzgebühren zu besprechen.',
          fr: 'Nous desservons toute la Grande Zone Métropolitaine (GAM) de San Jose. Pour les emplacements en dehors du GAM, veuillez nous contacter pour discuter des options de livraison et des frais supplémentaires potentiels.',
          sv: 'Vi betjänar hela storstadsområdet (GAM) i San Jose. För platser utanför GAM, vänligen kontakta oss för att diskutera leveransalternativ och eventuella tilläggskostnader.',
        },
      },
      {
        question: {
          en: 'What is your cancellation policy?',
          es: 'Cual es su politica de cancelacion?',
          it: 'Qual è la vostra politica di cancellazione?',
          de: 'Was ist Ihre Stornierungsbedingung?',
          fr: 'Quelle est votre politique d\'annulation?',
          sv: 'Vad är er avbokningspolicy?',
        },
        answer: {
          en: 'Cancellations made 7+ days before the event receive a full refund minus a 10% administrative fee. Cancellations within 7 days receive 50% refund. Less than 48 hours notice are non-refundable.',
          es: 'Cancelaciones realizadas 7+ dias antes del evento reciben reembolso completo menos 10% de tarifa administrativa. Cancelaciones dentro de 7 dias reciben 50% de reembolso. Menos de 48 horas no son reembolsables.',
          it: 'Le cancellazioni effettuate 7+ giorni prima dell\'evento ricevono un rimborso completo meno una tariffa amministrativa del 10%. Le cancellazioni entro 7 giorni ricevono un rimborso del 50%. Meno di 48 ore di preavviso non sono rimborsabili.',
          de: 'Stornierungen, die 7+ Tage vor der Veranstaltung vorgenommen werden, erhalten eine vollständige Rückerstattung abzüglich einer Verwaltungsgebühr von 10%. Stornierungen innerhalb von 7 Tagen erhalten 50% Rückerstattung. Weniger als 48 Stunden Vorankündigung sind nicht erstattungsfähig.',
          fr: 'Les annulations effectuées 7+ jours avant l\'événement reçoivent un remboursement complet moins des frais administratifs de 10%. Les annulations dans les 7 jours reçoivent un remboursement de 50%. Moins de 48 heures de préavis ne sont pas remboursables.',
          sv: 'Avbokningar gjorda 7+ dagar före evenemanget får full återbetalning minus 10% administrativ avgift. Avbokningar inom 7 dagar får 50% återbetalning. Mindre än 48 timmars varsel är inte återbetalningsbart.',
        },
      },
    ],
  },
};

// Gallery placeholder images
const galleryPlaceholders = [
  { id: 1, type: { en: 'Wedding', es: 'Boda', it: 'Matrimonio', de: 'Hochzeit', fr: 'Mariage', sv: 'Bröllop' } },
  { id: 2, type: { en: 'Corporate', es: 'Corporativo', it: 'Aziendale', de: 'Firma', fr: 'Entreprise', sv: 'Företag' } },
  { id: 3, type: { en: 'Birthday', es: 'Cumpleanos', it: 'Compleanno', de: 'Geburtstag', fr: 'Anniversaire', sv: 'Födelsedag' } },
  { id: 4, type: { en: 'Dessert Table', es: 'Mesa de Postres', it: 'Tavolo dei Dolci', de: 'Desserttisch', fr: 'Table de Desserts', sv: 'Dessertbord' } },
  { id: 5, type: { en: 'Brunch', es: 'Brunch', it: 'Brunch', de: 'Brunch', fr: 'Brunch', sv: 'Brunch' } },
  { id: 6, type: { en: 'Custom Cake', es: 'Pastel Personalizado', it: 'Torta Personalizzata', de: 'Individuelle Torte', fr: 'Gâteau Personnalisé', sv: 'Anpassad Tårta' } },
];

// UI translations for hardcoded strings
const uiTranslations = {
  en: {
    requestQuote: 'Request Quote',
    callNow: 'Call Now',
    mostPopular: 'Most Popular',
    priceDisclaimer: '* Prices are in Costa Rican colones. Customize any package to fit your needs.',
    guestsPlaceholder: 'e.g. 50',
    contactInformation: 'Contact Information',
    namePlaceholder: 'Your full name',
    emailPlaceholder: 'your@email.com',
    readyToPlanner: 'Ready to Plan Your Event?',
    readyDescription: 'Our team is ready to make your special occasion unforgettable. Contact us today!',
    getStarted: 'Get Started',
    allRightsReserved: 'All rights reserved.',
  },
  es: {
    requestQuote: 'Solicitar Cotización',
    callNow: 'Llamar Ahora',
    mostPopular: 'Mas Popular',
    priceDisclaimer: '* Los precios estan en colones costarricenses. Personaliza cualquier paquete segun tus necesidades.',
    guestsPlaceholder: 'Ej: 50',
    contactInformation: 'Informacion de Contacto',
    namePlaceholder: 'Tu nombre completo',
    emailPlaceholder: 'tu@correo.com',
    readyToPlanner: 'Listo para Planificar tu Evento?',
    readyDescription: 'Nuestro equipo esta listo para hacer de tu ocasion especial algo inolvidable. Contactanos hoy!',
    getStarted: 'Comenzar Ahora',
    allRightsReserved: 'Todos los derechos reservados.',
  },
  it: {
    requestQuote: 'Richiedi Preventivo',
    callNow: 'Chiama Ora',
    mostPopular: 'Piu Popolare',
    priceDisclaimer: '* I prezzi sono in colones costaricani. Personalizza qualsiasi pacchetto per adattarlo alle tue esigenze.',
    guestsPlaceholder: 'es: 50',
    contactInformation: 'Informazioni di Contatto',
    namePlaceholder: 'Il tuo nome completo',
    emailPlaceholder: 'tua@email.com',
    readyToPlanner: 'Pronto per Pianificare il Tuo Evento?',
    readyDescription: 'Il nostro team è pronto a rendere la tua occasione speciale indimenticabile. Contattaci oggi!',
    getStarted: 'Inizia Ora',
    allRightsReserved: 'Tutti i diritti riservati.',
  },
  de: {
    requestQuote: 'Angebot Anfordern',
    callNow: 'Jetzt Anrufen',
    mostPopular: 'Am Beliebtesten',
    priceDisclaimer: '* Die Preise sind in costa-ricanischen Colones. Passen Sie jedes Paket an Ihre Bedürfnisse an.',
    guestsPlaceholder: 'z.B. 50',
    contactInformation: 'Kontaktinformationen',
    namePlaceholder: 'Ihr vollständiger Name',
    emailPlaceholder: 'ihre@email.de',
    readyToPlanner: 'Bereit, Ihre Veranstaltung zu Planen?',
    readyDescription: 'Unser Team ist bereit, Ihren besonderen Anlass unvergesslich zu machen. Kontaktieren Sie uns heute!',
    getStarted: 'Jetzt Starten',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
  fr: {
    requestQuote: 'Demander un Devis',
    callNow: 'Appeler',
    mostPopular: 'Plus Populaire',
    priceDisclaimer: '* Les prix sont en colones costaricains. Personnalisez n\'importe quel forfait selon vos besoins.',
    guestsPlaceholder: 'ex: 50',
    contactInformation: 'Informations de Contact',
    namePlaceholder: 'Votre nom complet',
    emailPlaceholder: 'votre@email.fr',
    readyToPlanner: 'Prêt à Planifier Votre Événement?',
    readyDescription: 'Notre équipe est prête à rendre votre occasion spéciale inoubliable. Contactez-nous aujourd\'hui!',
    getStarted: 'Commencer',
    allRightsReserved: 'Tous droits réservés.',
  },
  sv: {
    requestQuote: 'Begär Offert',
    callNow: 'Ring Nu',
    mostPopular: 'Mest Populär',
    priceDisclaimer: '* Priserna är i costa-ricanska colones. Anpassa vilket paket som helst efter dina behov.',
    guestsPlaceholder: 't.ex. 50',
    contactInformation: 'Kontaktinformation',
    namePlaceholder: 'Ditt fullständiga namn',
    emailPlaceholder: 'din@email.se',
    readyToPlanner: 'Redo att Planera Ditt Evenemang?',
    readyDescription: 'Vårt team är redo att göra ditt speciella tillfälle oförglömligt. Kontakta oss idag!',
    getStarted: 'Kom Igång',
    allRightsReserved: 'Alla rättigheter förbehållna.',
  },
};

export const Events: React.FC = () => {
  const { language } = useLanguage();

  // Get UI translations for current language with fallback to English
  const ui = uiTranslations[language as keyof typeof uiTranslations] || uiTranslations.en;

  // Form state
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    guests: '',
    budget: '',
    notes: '',
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper for multilingual text with fallback to English
  const getText = (textObj: { en: string; es: string; it?: string; de?: string; fr?: string; sv?: string }) => {
    // Check if the language exists in the object, otherwise fall back to English
    if (language in textObj && textObj[language as keyof typeof textObj]) {
      return textObj[language as keyof typeof textObj];
    }
    return textObj.en;
  };

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      eventType: '',
      date: '',
      guests: '',
      budget: '',
      notes: '',
      name: '',
      email: '',
      phone: '',
    });
  };

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border-2 border-sand rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full mb-6">
            <UtensilsCrossed className="w-10 h-10 text-sand" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {getText(content.hero.title)}
          </h1>
          <p className="text-lg text-sand/90 tracking-wide leading-relaxed">
            {getText(content.hero.subtitle)}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#inquiry-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sand text-forest rounded-full font-medium hover:bg-sand/90 transition-all active:scale-[0.98]"
            >
              <Calendar className="w-5 h-5" />
              {ui.requestQuote}
            </a>
            <a
              href="tel:+50622356789"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-sand text-sand rounded-full font-medium hover:bg-sand/10 transition-all active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              {ui.callNow}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.services.title)}
            </h2>
            <p className="text-forest/60 max-w-xl mx-auto">
              {getText(content.services.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.services.items.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-[#faf8f3] rounded-2xl p-6 shadow-soft animate-fade-in hover:shadow-card transition-shadow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-forest rounded-full flex items-center justify-center">
                      <IconComponent className="w-7 h-7 text-sand" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest mb-2">
                        {getText(service.title)}
                      </h3>
                      <p className="text-sm text-forest/70 leading-relaxed">
                        {getText(service.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="px-6 py-16 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.packages.title)}
            </h2>
            <p className="text-forest/60 max-w-xl mx-auto">
              {getText(content.packages.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.packages.items.map((pkg, index) => {
              const IconComponent = pkg.icon;
              const includes = pkg.includes[language as keyof typeof pkg.includes] || pkg.includes.en;
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl p-6 shadow-soft animate-fade-in hover:shadow-card transition-shadow ${
                    pkg.popular ? 'ring-2 ring-forest' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-forest text-white text-xs font-medium rounded-full">
                      {ui.mostPopular}
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/30 rounded-full mb-4">
                      <IconComponent className="w-7 h-7 text-forest" />
                    </div>
                    <h3 className="text-lg font-semibold text-forest mb-1">
                      {getText(pkg.title)}
                    </h3>
                    <p className="text-sm text-forest/60 mb-4">
                      {getText(pkg.description)}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-forest/60">CRC</span>
                      <span className="text-3xl font-bold text-forest">{pkg.price}</span>
                      <span className="text-sm text-forest/60">{getText(pkg.priceNote)}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-forest/80">
                        <CheckCircle className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 text-forest/60 text-sm">
            {ui.priceDisclaimer}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.gallery.title)}
            </h2>
            <p className="text-forest/60 max-w-xl mx-auto">
              {getText(content.gallery.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPlaceholders.map((item, index) => (
              <div
                key={item.id}
                className="aspect-square bg-[#faf8f3] rounded-2xl overflow-hidden animate-fade-in hover:shadow-card transition-shadow group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-forest/40 group-hover:text-forest/60 transition-colors">
                  <Image className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">{getText(item.type)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="px-6 py-16 bg-forest">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {getText(content.form.title)}
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              {getText(content.form.subtitle)}
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-2xl p-8 shadow-soft text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-2">
                {getText(content.form.success.title)}
              </h3>
              <p className="text-forest/60 mb-6">
                {getText(content.form.success.message)}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-forest text-white rounded-full font-medium hover:bg-forest/90 transition-all"
              >
                {getText(content.form.success.another)}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft animate-fade-in"
            >
              <div className="space-y-5">
                {/* Event Type */}
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-forest mb-2">
                    {getText(content.form.fields.eventType)} *
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  >
                    {content.form.fields.eventTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {getText(option.label)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Guests Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-forest mb-2">
                      {getText(content.form.fields.date)} *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                    />
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-forest mb-2">
                      {getText(content.form.fields.guests)} *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder={ui.guestsPlaceholder}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-forest mb-2">
                    {getText(content.form.fields.budget)} *
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                  >
                    {content.form.fields.budgetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {getText(option.label)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-forest mb-2">
                    {getText(content.form.fields.notes)}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder={getText(content.form.fields.notesPlaceholder)}
                    className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all resize-none"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-sand/30 pt-5">
                  <p className="text-sm font-medium text-forest mb-4">
                    {ui.contactInformation}
                  </p>

                  {/* Name */}
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-sm font-medium text-forest mb-2">
                      {getText(content.form.fields.name)} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={ui.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                    />
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-forest mb-2">
                        {getText(content.form.fields.email)} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={ui.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-forest mb-2">
                        {getText(content.form.fields.phone)} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+506 8888-8888"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand/50 bg-[#faf8f3] text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
                        />
                      </div>
                    </div>
                  </div>
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
                      {getText(content.form.fields.submitting)}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {getText(content.form.fields.submit)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-16 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.testimonials.title)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-sand/60 mb-2" />
                <p className="text-sm text-forest/80 leading-relaxed mb-4">
                  {getText(testimonial.quote)}
                </p>
                <div className="pt-4 border-t border-sand/30">
                  <p className="font-semibold text-forest">{testimonial.name}</p>
                  <p className="text-sm text-forest/60">{getText(testimonial.event)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
              {getText(content.faq.title)}
            </h2>
          </div>

          <div className="space-y-4">
            {content.faq.items.map((faq, index) => (
              <div
                key={index}
                className="bg-[#faf8f3] rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-sand/20 transition-colors"
                >
                  <span className="font-medium text-forest pr-4">
                    {getText(faq.question)}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-forest flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-forest flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-forest/70 leading-relaxed">
                      {getText(faq.answer)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-forest">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {ui.readyToPlanner}
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            {ui.readyDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#inquiry-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sand text-forest rounded-full font-medium hover:bg-sand/90 transition-all active:scale-[0.98]"
            >
              <Calendar className="w-5 h-5" />
              {ui.getStarted}
            </a>
            <a
              href="tel:+50622356789"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-sand text-sand rounded-full font-medium hover:bg-sand/10 transition-all active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              +506 2235-6789
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30 bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-forest/60">
            &copy; {new Date().getFullYear()} Cafe 1973.{' '}
            {ui.allRightsReserved}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

export default Events;
