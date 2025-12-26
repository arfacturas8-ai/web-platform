/**
 * Cafe 1973 - FAQ Page
 * Frequently Asked Questions with multilingual support (en, es, it, de, fr, sv)
 * Mobile-first design with accordion-style expandable items
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
} from 'lucide-react';

// FAQ Category type
type FAQCategory = 'general' | 'orders' | 'reservations' | 'loyalty' | 'catering';

// FAQ Item type
interface FAQItem {
  id: string;
  question: { en: string; es: string; it: string; de: string; fr: string; sv: string };
  answer: { en: string; es: string; it: string; de: string; fr: string; sv: string };
  category: FAQCategory;
}

// Category labels
const categoryLabels: Record<FAQCategory, { en: string; es: string; it: string; de: string; fr: string; sv: string }> = {
  general: { en: 'General', es: 'General', it: 'Generale', de: 'Allgemein', fr: 'Général', sv: 'Allmänt' },
  orders: { en: 'Orders', es: 'Pedidos', it: 'Ordini', de: 'Bestellungen', fr: 'Commandes', sv: 'Beställningar' },
  reservations: { en: 'Reservations', es: 'Reservaciones', it: 'Prenotazioni', de: 'Reservierungen', fr: 'Réservations', sv: 'Reservationer' },
  loyalty: { en: 'Loyalty', es: 'Lealtad', it: 'Fedeltà', de: 'Treue', fr: 'Fidélité', sv: 'Lojalitet' },
  catering: { en: 'Catering', es: 'Catering', it: 'Catering', de: 'Catering', fr: 'Traiteur', sv: 'Catering' },
};

// FAQ Data
const faqData: FAQItem[] = [
  // General
  {
    id: 'general-1',
    category: 'general',
    question: {
      en: 'What are your hours?',
      es: '¿Cual es su horario?',
      it: 'Quali sono i vostri orari?',
      de: 'Was sind Ihre Öffnungszeiten?',
      fr: 'Quelles sont vos heures d\'ouverture?',
      sv: 'Vilka är era öppettider?',
    },
    answer: {
      en: 'We are open Monday through Friday from 6:00 AM to 8:00 PM, Saturday from 7:00 AM to 9:00 PM, and Sunday from 8:00 AM to 6:00 PM. Holiday hours may vary, so please check our website or call ahead for special dates.',
      es: 'Estamos abiertos de lunes a viernes de 6:00 AM a 8:00 PM, sabados de 7:00 AM a 9:00 PM, y domingos de 8:00 AM a 6:00 PM. Los horarios de dias festivos pueden variar, asi que por favor consulte nuestro sitio web o llame antes para fechas especiales.',
      it: 'Siamo aperti dal lunedì al venerdì dalle 6:00 alle 20:00, sabato dalle 7:00 alle 21:00 e domenica dalle 8:00 alle 18:00. Gli orari festivi possono variare, quindi controlla il nostro sito web o chiama in anticipo per date speciali.',
      de: 'Wir sind Montag bis Freitag von 6:00 bis 20:00 Uhr, Samstag von 7:00 bis 21:00 Uhr und Sonntag von 8:00 bis 18:00 Uhr geöffnet. Die Öffnungszeiten an Feiertagen können variieren, bitte überprüfen Sie unsere Website oder rufen Sie im Voraus an.',
      fr: 'Nous sommes ouverts du lundi au vendredi de 6h00 à 20h00, le samedi de 7h00 à 21h00 et le dimanche de 8h00 à 18h00. Les horaires des jours fériés peuvent varier, veuillez consulter notre site web ou appeler à l\'avance.',
      sv: 'Vi är öppna måndag till fredag från 06:00 till 20:00, lördag från 07:00 till 21:00 och söndag från 08:00 till 18:00. Öppettider på helgdagar kan variera, så kontrollera vår webbplats eller ring i förväg.',
    },
  },
  {
    id: 'general-2',
    category: 'general',
    question: {
      en: 'Where are you located?',
      es: '¿Donde estan ubicados?',
      it: 'Dove vi trovate?',
      de: 'Wo befinden Sie sich?',
      fr: 'Où êtes-vous situé?',
      sv: 'Var ligger ni?',
    },
    answer: {
      en: 'We are located in the heart of Moravia, Costa Rica. Our exact address is Calle Principal, Moravia Centro, San Jose. You can find us easily using Google Maps or Waze by searching for "Cafe 1973".',
      es: 'Estamos ubicados en el corazon de Moravia, Costa Rica. Nuestra direccion exacta es Calle Principal, Moravia Centro, San Jose. Puede encontrarnos facilmente usando Google Maps o Waze buscando "Cafe 1973".',
      it: 'Siamo situati nel cuore di Moravia, Costa Rica. Il nostro indirizzo esatto è Calle Principal, Moravia Centro, San Jose. Puoi trovarci facilmente usando Google Maps o Waze cercando "Cafe 1973".',
      de: 'Wir befinden uns im Herzen von Moravia, Costa Rica. Unsere genaue Adresse ist Calle Principal, Moravia Centro, San Jose. Sie können uns leicht über Google Maps oder Waze finden, indem Sie nach "Cafe 1973" suchen.',
      fr: 'Nous sommes situés au cœur de Moravia, Costa Rica. Notre adresse exacte est Calle Principal, Moravia Centro, San Jose. Vous pouvez nous trouver facilement en utilisant Google Maps ou Waze en recherchant "Cafe 1973".',
      sv: 'Vi ligger i hjärtat av Moravia, Costa Rica. Vår exakta adress är Calle Principal, Moravia Centro, San Jose. Du kan hitta oss enkelt med Google Maps eller Waze genom att söka efter "Cafe 1973".',
    },
  },
  {
    id: 'general-3',
    category: 'general',
    question: {
      en: 'Do you have parking?',
      es: '¿Tienen estacionamiento?',
      it: 'Avete un parcheggio?',
      de: 'Haben Sie Parkplätze?',
      fr: 'Avez-vous un parking?',
      sv: 'Har ni parkering?',
    },
    answer: {
      en: 'Yes, we have free parking available for our customers. There are approximately 15 parking spaces in our private lot located behind the cafe. Street parking is also available in the surrounding area.',
      es: 'Si, tenemos estacionamiento gratuito disponible para nuestros clientes. Hay aproximadamente 15 espacios de estacionamiento en nuestro lote privado ubicado detras del cafe. Tambien hay estacionamiento en la calle en el area circundante.',
      it: 'Sì, abbiamo un parcheggio gratuito disponibile per i nostri clienti. Ci sono circa 15 posti auto nel nostro parcheggio privato situato dietro il caffè. È disponibile anche il parcheggio in strada nella zona circostante.',
      de: 'Ja, wir haben kostenlose Parkplätze für unsere Kunden. Es gibt etwa 15 Parkplätze auf unserem Privatgelände hinter dem Café. Straßenparkplätze sind auch in der Umgebung verfügbar.',
      fr: 'Oui, nous avons un parking gratuit disponible pour nos clients. Il y a environ 15 places de parking dans notre parking privé situé derrière le café. Le stationnement dans la rue est également disponible dans les environs.',
      sv: 'Ja, vi har gratis parkering tillgänglig för våra kunder. Det finns cirka 15 parkeringsplatser på vår privata parkering belägen bakom caféet. Gatuparkering finns också i området.',
    },
  },
  {
    id: 'general-4',
    category: 'general',
    question: {
      en: 'Is the cafe wheelchair accessible?',
      es: '¿El cafe es accesible?',
      it: 'Il caffè è accessibile in sedia a rotelle?',
      de: 'Ist das Café rollstuhlgerecht?',
      fr: 'Le café est-il accessible en fauteuil roulant?',
      sv: 'Är caféet rullstolsanpassat?',
    },
    answer: {
      en: 'Yes, our cafe is fully wheelchair accessible. We have a ramp at the main entrance, accessible restrooms, and spacious aisles between tables. If you need any assistance, please let our staff know and we will be happy to help.',
      es: 'Si, nuestro cafe es completamente accesible para sillas de ruedas. Tenemos una rampa en la entrada principal, banos accesibles y pasillos espaciosos entre las mesas. Si necesita alguna asistencia, por favor hagaselo saber a nuestro personal y estaremos encantados de ayudar.',
      it: 'Sì, il nostro caffè è completamente accessibile in sedia a rotelle. Abbiamo una rampa all\'ingresso principale, bagni accessibili e corridoi spaziosi tra i tavoli. Se hai bisogno di assistenza, fallo sapere al nostro personale e saremo felici di aiutarti.',
      de: 'Ja, unser Café ist vollständig rollstuhlgerecht. Wir haben eine Rampe am Haupteingang, barrierefreie Toiletten und breite Gänge zwischen den Tischen. Wenn Sie Hilfe benötigen, lassen Sie es unser Personal wissen und wir helfen Ihnen gerne.',
      fr: 'Oui, notre café est entièrement accessible en fauteuil roulant. Nous avons une rampe à l\'entrée principale, des toilettes accessibles et des allées spacieuses entre les tables. Si vous avez besoin d\'aide, veuillez en informer notre personnel et nous serons heureux de vous aider.',
      sv: 'Ja, vårt café är helt rullstolsanpassat. Vi har en ramp vid huvudentrén, tillgängliga toaletter och rymliga gångar mellan borden. Om du behöver hjälp, vänligen meddela vår personal så hjälper vi gärna till.',
    },
  },
  // Orders
  {
    id: 'orders-1',
    category: 'orders',
    question: {
      en: 'How do I place an online order?',
      es: '¿Como hago un pedido en linea?',
      it: 'Come faccio un ordine online?',
      de: 'Wie gebe ich eine Online-Bestellung auf?',
      fr: 'Comment passer une commande en ligne?',
      sv: 'Hur gör jag en onlinebeställning?',
    },
    answer: {
      en: 'You can place an online order through our website or mobile app. Simply browse our menu, add items to your cart, select pickup or delivery, choose your preferred time, and complete payment. You will receive an order confirmation via email and SMS.',
      es: 'Puede hacer un pedido en linea a traves de nuestro sitio web o aplicacion movil. Simplemente navegue por nuestro menu, agregue articulos a su carrito, seleccione recoger o entrega, elija su hora preferida y complete el pago. Recibira una confirmacion de pedido por correo electronico y SMS.',
      it: 'Puoi effettuare un ordine online tramite il nostro sito web o app mobile. Basta sfogliare il nostro menu, aggiungere articoli al carrello, selezionare ritiro o consegna, scegliere l\'orario preferito e completare il pagamento. Riceverai una conferma dell\'ordine via email e SMS.',
      de: 'Sie können online über unsere Website oder mobile App bestellen. Durchsuchen Sie einfach unser Menü, fügen Sie Artikel zu Ihrem Warenkorb hinzu, wählen Sie Abholung oder Lieferung, wählen Sie Ihre bevorzugte Zeit und schließen Sie die Zahlung ab. Sie erhalten eine Bestellbestätigung per E-Mail und SMS.',
      fr: 'Vous pouvez passer une commande en ligne via notre site web ou application mobile. Parcourez simplement notre menu, ajoutez des articles à votre panier, sélectionnez retrait ou livraison, choisissez votre heure préférée et complétez le paiement. Vous recevrez une confirmation de commande par email et SMS.',
      sv: 'Du kan göra en onlinebeställning via vår webbplats eller mobilapp. Bläddra helt enkelt i vår meny, lägg till artiklar i din varukorg, välj upphämtning eller leverans, välj din önskade tid och slutför betalningen. Du kommer att få en orderbekräftelse via e-post och SMS.',
    },
  },
  {
    id: 'orders-2',
    category: 'orders',
    question: {
      en: 'What payment methods do you accept?',
      es: '¿Que metodos de pago aceptan?',
      it: 'Quali metodi di pagamento accettate?',
      de: 'Welche Zahlungsmethoden akzeptieren Sie?',
      fr: 'Quels modes de paiement acceptez-vous?',
      sv: 'Vilka betalningsmetoder accepterar ni?',
    },
    answer: {
      en: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, SINPE Movil, cash, and digital wallets including Apple Pay and Google Pay. For online orders, all card payments are processed securely.',
      es: 'Aceptamos todas las principales tarjetas de credito (Visa, MasterCard, American Express), tarjetas de debito, SINPE Movil, efectivo y billeteras digitales incluyendo Apple Pay y Google Pay. Para pedidos en linea, todos los pagos con tarjeta se procesan de forma segura.',
      it: 'Accettiamo tutte le principali carte di credito (Visa, MasterCard, American Express), carte di debito, SINPE Movil, contanti e portafogli digitali inclusi Apple Pay e Google Pay. Per gli ordini online, tutti i pagamenti con carta sono elaborati in modo sicuro.',
      de: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, MasterCard, American Express), Debitkarten, SINPE Movil, Bargeld und digitale Geldbörsen einschließlich Apple Pay und Google Pay. Für Online-Bestellungen werden alle Kartenzahlungen sicher verarbeitet.',
      fr: 'Nous acceptons toutes les principales cartes de crédit (Visa, MasterCard, American Express), cartes de débit, SINPE Movil, espèces et portefeuilles numériques incluant Apple Pay et Google Pay. Pour les commandes en ligne, tous les paiements par carte sont traités en toute sécurité.',
      sv: 'Vi accepterar alla större kreditkort (Visa, MasterCard, American Express), betalkort, SINPE Movil, kontanter och digitala plånböcker inklusive Apple Pay och Google Pay. För onlinebeställningar behandlas alla kortbetalningar säkert.',
    },
  },
  {
    id: 'orders-3',
    category: 'orders',
    question: {
      en: 'Do you offer delivery?',
      es: '¿Ofrecen delivery?',
      it: 'Offrite la consegna?',
      de: 'Bieten Sie Lieferung an?',
      fr: 'Proposez-vous la livraison?',
      sv: 'Erbjuder ni hemleverans?',
    },
    answer: {
      en: 'Yes, we offer delivery within a 5km radius of our location. Delivery is available through our website, app, and also via Uber Eats and Rappi. Delivery fees vary based on distance. Orders over $25 qualify for free delivery within our direct delivery zone.',
      es: 'Si, ofrecemos entrega dentro de un radio de 5km de nuestra ubicacion. La entrega esta disponible a traves de nuestro sitio web, aplicacion, y tambien via Uber Eats y Rappi. Las tarifas de entrega varian segun la distancia. Pedidos mayores a $25 califican para entrega gratuita dentro de nuestra zona de entrega directa.',
      it: 'Sì, offriamo la consegna entro un raggio di 5 km dalla nostra posizione. La consegna è disponibile tramite il nostro sito web, app e anche tramite Uber Eats e Rappi. Le tariffe di consegna variano in base alla distanza. Gli ordini superiori a $25 si qualificano per la consegna gratuita nella nostra zona di consegna diretta.',
      de: 'Ja, wir bieten Lieferung innerhalb eines 5 km Radius von unserem Standort an. Die Lieferung ist über unsere Website, App und auch über Uber Eats und Rappi verfügbar. Die Liefergebühren variieren je nach Entfernung. Bestellungen über $25 qualifizieren sich für kostenlose Lieferung in unserer direkten Lieferzone.',
      fr: 'Oui, nous proposons la livraison dans un rayon de 5 km de notre emplacement. La livraison est disponible via notre site web, application et également via Uber Eats et Rappi. Les frais de livraison varient en fonction de la distance. Les commandes de plus de 25 $ bénéficient de la livraison gratuite dans notre zone de livraison directe.',
      sv: 'Ja, vi erbjuder leverans inom en radie på 5 km från vår plats. Leverans är tillgänglig via vår webbplats, app och även via Uber Eats och Rappi. Leveransavgifterna varierar beroende på avstånd. Beställningar över $25 kvalificerar för gratis leverans inom vår direkta leveranszon.',
    },
  },
  {
    id: 'orders-4',
    category: 'orders',
    question: {
      en: 'Can I modify my order after placing it?',
      es: '¿Puedo modificar mi pedido?',
      it: 'Posso modificare il mio ordine dopo averlo effettuato?',
      de: 'Kann ich meine Bestellung nach der Aufgabe ändern?',
      fr: 'Puis-je modifier ma commande après l\'avoir passée?',
      sv: 'Kan jag ändra min beställning efter att ha gjort den?',
    },
    answer: {
      en: 'You can modify or cancel your order within 5 minutes of placing it. After that, our kitchen begins preparation and changes may not be possible. Please contact us immediately at our phone number if you need to make urgent changes.',
      es: 'Puede modificar o cancelar su pedido dentro de los 5 minutos de haberlo realizado. Despues de eso, nuestra cocina comienza la preparacion y los cambios pueden no ser posibles. Por favor contactenos inmediatamente a nuestro telefono si necesita hacer cambios urgentes.',
      it: 'Puoi modificare o annullare il tuo ordine entro 5 minuti dall\'effettuazione. Dopo di che, la nostra cucina inizia la preparazione e le modifiche potrebbero non essere possibili. Contattaci immediatamente al nostro numero di telefono se hai bisogno di apportare modifiche urgenti.',
      de: 'Sie können Ihre Bestellung innerhalb von 5 Minuten nach der Aufgabe ändern oder stornieren. Danach beginnt unsere Küche mit der Zubereitung und Änderungen sind möglicherweise nicht mehr möglich. Bitte kontaktieren Sie uns sofort unter unserer Telefonnummer, wenn Sie dringende Änderungen vornehmen müssen.',
      fr: 'Vous pouvez modifier ou annuler votre commande dans les 5 minutes suivant sa passation. Après cela, notre cuisine commence la préparation et les modifications peuvent ne pas être possibles. Veuillez nous contacter immédiatement à notre numéro de téléphone si vous devez apporter des modifications urgentes.',
      sv: 'Du kan ändra eller avboka din beställning inom 5 minuter efter att ha gjort den. Efter det börjar vårt kök med förberedelserna och ändringar kanske inte är möjliga. Vänligen kontakta oss omedelbart på vårt telefonnummer om du behöver göra brådskande ändringar.',
    },
  },
  // Reservations
  {
    id: 'reservations-1',
    category: 'reservations',
    question: {
      en: 'How do I make a reservation?',
      es: '¿Como hago una reservacion?',
      it: 'Come faccio una prenotazione?',
      de: 'Wie mache ich eine Reservierung?',
      fr: 'Comment faire une réservation?',
      sv: 'Hur gör jag en reservation?',
    },
    answer: {
      en: 'You can make a reservation through our website by visiting the Reservations page, calling us directly, or using the OpenTable integration. We recommend booking at least 24 hours in advance for guaranteed seating, especially on weekends.',
      es: 'Puede hacer una reservacion a traves de nuestro sitio web visitando la pagina de Reservaciones, llamandonos directamente, o usando la integracion de OpenTable. Recomendamos reservar con al menos 24 horas de anticipacion para asegurar mesa, especialmente los fines de semana.',
      it: 'Puoi fare una prenotazione tramite il nostro sito web visitando la pagina Prenotazioni, chiamandoci direttamente o usando l\'integrazione OpenTable. Consigliamo di prenotare con almeno 24 ore di anticipo per garantire un posto, specialmente nei fine settimana.',
      de: 'Sie können eine Reservierung über unsere Website vornehmen, indem Sie die Reservierungsseite besuchen, uns direkt anrufen oder die OpenTable-Integration verwenden. Wir empfehlen, mindestens 24 Stunden im Voraus zu buchen, um einen garantierten Sitzplatz zu haben, besonders an Wochenenden.',
      fr: 'Vous pouvez faire une réservation via notre site web en visitant la page Réservations, en nous appelant directement ou en utilisant l\'intégration OpenTable. Nous recommandons de réserver au moins 24 heures à l\'avance pour garantir une place, surtout le week-end.',
      sv: 'Du kan göra en reservation via vår webbplats genom att besöka Reservationssidan, ringa oss direkt eller använda OpenTable-integrationen. Vi rekommenderar att boka minst 24 timmar i förväg för garanterad plats, särskilt på helger.',
    },
  },
  {
    id: 'reservations-2',
    category: 'reservations',
    question: {
      en: 'What is your cancellation policy?',
      es: '¿Cual es su politica de cancelacion?',
      it: 'Qual è la vostra politica di cancellazione?',
      de: 'Was ist Ihre Stornierungspolitik?',
      fr: 'Quelle est votre politique d\'annulation?',
      sv: 'Vad är er avbokningspolicy?',
    },
    answer: {
      en: 'We kindly ask that you cancel or modify your reservation at least 2 hours before your scheduled time. For groups of 6 or more, we require 24 hours notice. No-shows may affect future reservation privileges.',
      es: 'Le pedimos amablemente que cancele o modifique su reservacion al menos 2 horas antes de su hora programada. Para grupos de 6 o mas personas, requerimos 24 horas de aviso. Las ausencias sin aviso pueden afectar los privilegios de reservacion futuros.',
      it: 'Ti chiediamo gentilmente di cancellare o modificare la tua prenotazione almeno 2 ore prima dell\'orario programmato. Per gruppi di 6 o più persone, richiediamo un preavviso di 24 ore. Le mancate presentazioni potrebbero influire sui privilegi di prenotazione futuri.',
      de: 'Wir bitten Sie höflich, Ihre Reservierung mindestens 2 Stunden vor Ihrer geplanten Zeit zu stornieren oder zu ändern. Für Gruppen von 6 oder mehr Personen benötigen wir 24 Stunden Vorlaufzeit. Nichterscheinen kann zukünftige Reservierungsprivilegien beeinträchtigen.',
      fr: 'Nous vous demandons gentiment d\'annuler ou de modifier votre réservation au moins 2 heures avant l\'heure prévue. Pour les groupes de 6 personnes ou plus, nous exigeons un préavis de 24 heures. Les absences sans prévenir peuvent affecter les privilèges de réservation futurs.',
      sv: 'Vi ber dig vänligt att avboka eller ändra din reservation minst 2 timmar före din schemalagda tid. För grupper på 6 eller fler kräver vi 24 timmars varsel. Uteblivna gäster kan påverka framtida reservationsprivilegier.',
    },
  },
  {
    id: 'reservations-3',
    category: 'reservations',
    question: {
      en: 'Do you take large group reservations?',
      es: '¿Aceptan reservaciones para grupos grandes?',
      it: 'Accettate prenotazioni per gruppi numerosi?',
      de: 'Nehmen Sie Reservierungen für große Gruppen an?',
      fr: 'Acceptez-vous les réservations pour grands groupes?',
      sv: 'Tar ni emot reservationer för stora grupper?',
    },
    answer: {
      en: 'Yes, we accommodate groups of up to 25 people. For groups larger than 8, please call us directly to discuss your needs. We also offer private event space for special occasions such as birthdays, corporate events, and celebrations.',
      es: 'Si, acomodamos grupos de hasta 25 personas. Para grupos de mas de 8 personas, por favor llamenos directamente para discutir sus necesidades. Tambien ofrecemos espacio para eventos privados para ocasiones especiales como cumpleanos, eventos corporativos y celebraciones.',
      it: 'Sì, accogliamo gruppi fino a 25 persone. Per gruppi superiori a 8 persone, ti preghiamo di chiamarci direttamente per discutere le tue esigenze. Offriamo anche spazi per eventi privati per occasioni speciali come compleanni, eventi aziendali e celebrazioni.',
      de: 'Ja, wir beherbergen Gruppen von bis zu 25 Personen. Für Gruppen größer als 8 Personen rufen Sie uns bitte direkt an, um Ihre Bedürfnisse zu besprechen. Wir bieten auch private Veranstaltungsräume für besondere Anlässe wie Geburtstage, Firmenveranstaltungen und Feiern.',
      fr: 'Oui, nous accueillons des groupes jusqu\'à 25 personnes. Pour les groupes de plus de 8 personnes, veuillez nous appeler directement pour discuter de vos besoins. Nous offrons également un espace événementiel privé pour des occasions spéciales telles que les anniversaires, les événements d\'entreprise et les célébrations.',
      sv: 'Ja, vi tar emot grupper på upp till 25 personer. För grupper större än 8 personer, vänligen ring oss direkt för att diskutera dina behov. Vi erbjuder också privata evenemangsutrymmen för speciella tillfällen som födelsedagar, företagsevent och firanden.',
    },
  },
  // Loyalty
  {
    id: 'loyalty-1',
    category: 'loyalty',
    question: {
      en: 'How does the rewards program work?',
      es: '¿Como funciona el programa de recompensas?',
      it: 'Come funziona il programma fedeltà?',
      de: 'Wie funktioniert das Treueprogramm?',
      fr: 'Comment fonctionne le programme de fidélité?',
      sv: 'Hur fungerar lojalitetsprogrammet?',
    },
    answer: {
      en: 'Our rewards program allows you to earn points with every purchase. Sign up for free and earn 1 point for every $1 spent. Accumulate points to unlock exclusive benefits and redeem them for free items, discounts, and special experiences. There are three tiers: Bronze, Silver, and Gold, each with increasing benefits.',
      es: 'Nuestro programa de recompensas le permite ganar puntos con cada compra. Registrese gratis y gane 1 punto por cada $1 gastado. Acumule puntos para desbloquear beneficios exclusivos y canjearlos por articulos gratis, descuentos y experiencias especiales. Hay tres niveles: Bronce, Plata y Oro, cada uno con beneficios crecientes.',
      it: 'Il nostro programma fedeltà ti permette di guadagnare punti con ogni acquisto. Iscriviti gratuitamente e guadagna 1 punto per ogni $1 speso. Accumula punti per sbloccare vantaggi esclusivi e riscattarli per articoli gratuiti, sconti ed esperienze speciali. Ci sono tre livelli: Bronzo, Argento e Oro, ciascuno con benefici crescenti.',
      de: 'Unser Treueprogramm ermöglicht es Ihnen, bei jedem Einkauf Punkte zu sammeln. Melden Sie sich kostenlos an und verdienen Sie 1 Punkt für jeden ausgegebenen $1. Sammeln Sie Punkte, um exklusive Vorteile freizuschalten und sie für kostenlose Artikel, Rabatte und besondere Erlebnisse einzulösen. Es gibt drei Stufen: Bronze, Silber und Gold, jede mit zunehmenden Vorteilen.',
      fr: 'Notre programme de fidélité vous permet de gagner des points à chaque achat. Inscrivez-vous gratuitement et gagnez 1 point pour chaque $1 dépensé. Accumulez des points pour débloquer des avantages exclusifs et les échanger contre des articles gratuits, des réductions et des expériences spéciales. Il y a trois niveaux : Bronze, Argent et Or, chacun avec des avantages croissants.',
      sv: 'Vårt lojalitetsprogram låter dig tjäna poäng med varje köp. Registrera dig gratis och tjäna 1 poäng för varje $1 du spenderar. Samla poäng för att låsa upp exklusiva fördelar och lösa in dem för gratis artiklar, rabatter och speciella upplevelser. Det finns tre nivåer: Brons, Silver och Guld, var och en med ökande fördelar.',
    },
  },
  {
    id: 'loyalty-2',
    category: 'loyalty',
    question: {
      en: 'How do I earn points?',
      es: '¿Como gano puntos?',
      it: 'Come guadagno punti?',
      de: 'Wie verdiene ich Punkte?',
      fr: 'Comment gagner des points?',
      sv: 'Hur tjänar jag poäng?',
    },
    answer: {
      en: 'You earn 1 point for every $1 spent at Bronze level, 1.5 points at Silver level, and 2 points at Gold level. Points are automatically added to your account when you provide your phone number or scan your member QR code at checkout. Bonus point opportunities are available through special promotions.',
      es: 'Gana 1 punto por cada $1 gastado en nivel Bronce, 1.5 puntos en nivel Plata, y 2 puntos en nivel Oro. Los puntos se agregan automaticamente a su cuenta cuando proporciona su numero de telefono o escanea su codigo QR de miembro al pagar. Oportunidades de puntos extra estan disponibles a traves de promociones especiales.',
      it: 'Guadagni 1 punto per ogni $1 speso a livello Bronzo, 1,5 punti a livello Argento e 2 punti a livello Oro. I punti vengono aggiunti automaticamente al tuo account quando fornisci il tuo numero di telefono o scansioni il tuo codice QR membro alla cassa. Opportunità di punti bonus sono disponibili attraverso promozioni speciali.',
      de: 'Sie verdienen 1 Punkt für jeden $1, der auf Bronze-Niveau ausgegeben wird, 1,5 Punkte auf Silber-Niveau und 2 Punkte auf Gold-Niveau. Punkte werden automatisch Ihrem Konto hinzugefügt, wenn Sie Ihre Telefonnummer angeben oder Ihren Mitglieds-QR-Code an der Kasse scannen. Bonuspunkt-Möglichkeiten sind durch spezielle Aktionen verfügbar.',
      fr: 'Vous gagnez 1 point pour chaque $1 dépensé au niveau Bronze, 1,5 point au niveau Argent et 2 points au niveau Or. Les points sont automatiquement ajoutés à votre compte lorsque vous fournissez votre numéro de téléphone ou scannez votre code QR membre à la caisse. Des opportunités de points bonus sont disponibles via des promotions spéciales.',
      sv: 'Du tjänar 1 poäng för varje $1 som spenderas på Brons-nivå, 1,5 poäng på Silver-nivå och 2 poäng på Guld-nivå. Poäng läggs automatiskt till ditt konto när du anger ditt telefonnummer eller skannar din medlems-QR-kod vid kassan. Bonuspoängmöjligheter finns tillgängliga genom specialerbjudanden.',
    },
  },
  {
    id: 'loyalty-3',
    category: 'loyalty',
    question: {
      en: 'Do points expire?',
      es: '¿Los puntos expiran?',
      it: 'I punti scadono?',
      de: 'Verfallen Punkte?',
      fr: 'Les points expirent-ils?',
      sv: 'Går poängen ut?',
    },
    answer: {
      en: 'Points expire 12 months after your last activity. Any purchase or point redemption resets the expiration timer. We send reminder emails before your points are about to expire so you have time to use them.',
      es: 'Los puntos expiran 12 meses despues de su ultima actividad. Cualquier compra o canje de puntos reinicia el temporizador de expiracion. Enviamos correos electronicos de recordatorio antes de que sus puntos esten por expirar para que tenga tiempo de usarlos.',
      it: 'I punti scadono 12 mesi dopo la tua ultima attività. Qualsiasi acquisto o riscatto di punti ripristina il timer di scadenza. Inviamo email di promemoria prima che i tuoi punti stiano per scadere così hai tempo di usarli.',
      de: 'Punkte verfallen 12 Monate nach Ihrer letzten Aktivität. Jeder Kauf oder jede Punkteeinlösung setzt den Ablauftimer zurück. Wir senden Erinnerungs-E-Mails, bevor Ihre Punkte ablaufen, damit Sie Zeit haben, sie zu verwenden.',
      fr: 'Les points expirent 12 mois après votre dernière activité. Tout achat ou échange de points réinitialise le compteur d\'expiration. Nous envoyons des emails de rappel avant que vos points n\'expirent pour que vous ayez le temps de les utiliser.',
      sv: 'Poäng går ut 12 månader efter din senaste aktivitet. Varje köp eller poänginlösen återställer utgångstimern. Vi skickar påminnelse-e-post innan dina poäng är på väg att gå ut så att du har tid att använda dem.',
    },
  },
  // Catering
  {
    id: 'catering-1',
    category: 'catering',
    question: {
      en: 'Do you offer catering services?',
      es: '¿Ofrecen servicios de catering?',
      it: 'Offrite servizi di catering?',
      de: 'Bieten Sie Catering-Dienstleistungen an?',
      fr: 'Proposez-vous des services de traiteur?',
      sv: 'Erbjuder ni cateringtjänster?',
    },
    answer: {
      en: 'Yes, we offer full catering services for events of all sizes. Our catering menu includes our signature pastries, fresh-baked breads, coffee service, breakfast platters, lunch options, and custom cake orders. We can accommodate dietary restrictions and special requests.',
      es: 'Si, ofrecemos servicios completos de catering para eventos de todos los tamanos. Nuestro menu de catering incluye nuestras pasteleria insignia, panes recien horneados, servicio de cafe, bandejas de desayuno, opciones de almuerzo y pedidos de pasteles personalizados. Podemos acomodar restricciones dieteticas y solicitudes especiales.',
      it: 'Sì, offriamo servizi di catering completi per eventi di tutte le dimensioni. Il nostro menu di catering include le nostre paste caratteristiche, pane appena sfornato, servizio caffè, vassoi per colazione, opzioni per il pranzo e ordini di torte personalizzate. Possiamo soddisfare restrizioni dietetiche e richieste speciali.',
      de: 'Ja, wir bieten vollständige Catering-Dienstleistungen für Veranstaltungen aller Größen an. Unser Catering-Menü umfasst unsere charakteristischen Gebäcke, frisch gebackenes Brot, Kaffeeservice, Frühstücksplatten, Mittagsoptionen und individuelle Kuchenbestellungen. Wir können diätetische Einschränkungen und spezielle Wünsche berücksichtigen.',
      fr: 'Oui, nous proposons des services de traiteur complets pour des événements de toutes tailles. Notre menu traiteur comprend nos pâtisseries signature, du pain fraîchement cuit, un service café, des plateaux petit-déjeuner, des options déjeuner et des commandes de gâteaux personnalisés. Nous pouvons accommoder les restrictions alimentaires et les demandes spéciales.',
      sv: 'Ja, vi erbjuder fullständiga cateringtjänster för evenemang av alla storlekar. Vår cateringmeny inkluderar våra signaturbagerier, nybakat bröd, kaffeservice, frukostfat, lunchalternativ och anpassade tårtbeställningar. Vi kan tillgodose kostbegränsningar och specialförfrågningar.',
    },
  },
  {
    id: 'catering-2',
    category: 'catering',
    question: {
      en: 'How far in advance should I book?',
      es: '¿Con cuanta anticipacion debo reservar?',
      it: 'Con quanto anticipo devo prenotare?',
      de: 'Wie weit im Voraus sollte ich buchen?',
      fr: 'Combien de temps à l\'avance dois-je réserver?',
      sv: 'Hur långt i förväg bör jag boka?',
    },
    answer: {
      en: 'For catering orders, we recommend booking at least 1 week in advance for small events (under 20 people) and 2-3 weeks for larger events. During peak seasons (holidays, graduation season), we suggest booking even earlier to ensure availability.',
      es: 'Para pedidos de catering, recomendamos reservar con al menos 1 semana de anticipacion para eventos pequenos (menos de 20 personas) y 2-3 semanas para eventos mas grandes. Durante temporadas altas (dias festivos, temporada de graduaciones), sugerimos reservar aun antes para asegurar disponibilidad.',
      it: 'Per ordini di catering, consigliamo di prenotare con almeno 1 settimana di anticipo per eventi piccoli (meno di 20 persone) e 2-3 settimane per eventi più grandi. Durante le stagioni di punta (festività, stagione delle lauree), suggeriamo di prenotare ancora prima per garantire la disponibilità.',
      de: 'Für Catering-Bestellungen empfehlen wir, mindestens 1 Woche im Voraus für kleine Veranstaltungen (unter 20 Personen) und 2-3 Wochen für größere Veranstaltungen zu buchen. Während der Hochsaison (Feiertage, Abschlusssaison) empfehlen wir, noch früher zu buchen, um die Verfügbarkeit zu gewährleisten.',
      fr: 'Pour les commandes de traiteur, nous recommandons de réserver au moins 1 semaine à l\'avance pour les petits événements (moins de 20 personnes) et 2-3 semaines pour les événements plus importants. Pendant les hautes saisons (vacances, saison de remise des diplômes), nous suggérons de réserver encore plus tôt pour garantir la disponibilité.',
      sv: 'För cateringbeställningar rekommenderar vi att boka minst 1 vecka i förväg för små evenemang (under 20 personer) och 2-3 veckor för större evenemang. Under högsäsong (helgdagar, examensperiod) föreslår vi att boka ännu tidigare för att säkerställa tillgänglighet.',
    },
  },
];

// Content translations
const translations = {
  en: {
    hero: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our cafe',
    },
    search: {
      placeholder: 'Search questions...',
    },
    noResults: {
      title: 'No results found',
      description: 'Try adjusting your search or browse by category',
    },
    contact: {
      title: 'Still have questions?',
      description: 'We are here to help! Reach out to our team and we will get back to you as soon as possible.',
      cta: 'Contact Us',
    },
    categories: {
      all: 'All',
    },
    footer: {
      rights: 'All rights reserved.',
    },
  },
  es: {
    hero: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Encuentre respuestas a preguntas comunes sobre nuestro cafe',
    },
    search: {
      placeholder: 'Buscar preguntas...',
    },
    noResults: {
      title: 'No se encontraron resultados',
      description: 'Intente ajustar su busqueda o navegue por categoria',
    },
    contact: {
      title: '¿Todavia tiene preguntas?',
      description: 'Estamos aqui para ayudar! Contacte a nuestro equipo y le responderemos lo antes posible.',
      cta: 'Contactenos',
    },
    categories: {
      all: 'Todos',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
    },
  },
  it: {
    hero: {
      title: 'Domande Frequenti',
      subtitle: 'Trova risposte alle domande comuni sul nostro caffè',
    },
    search: {
      placeholder: 'Cerca domande...',
    },
    noResults: {
      title: 'Nessun risultato trovato',
      description: 'Prova a modificare la tua ricerca o sfoglia per categoria',
    },
    contact: {
      title: 'Hai ancora domande?',
      description: 'Siamo qui per aiutarti! Contatta il nostro team e ti risponderemo il prima possibile.',
      cta: 'Contattaci',
    },
    categories: {
      all: 'Tutti',
    },
    footer: {
      rights: 'Tutti i diritti riservati.',
    },
  },
  de: {
    hero: {
      title: 'Häufig gestellte Fragen',
      subtitle: 'Finden Sie Antworten auf häufige Fragen zu unserem Café',
    },
    search: {
      placeholder: 'Fragen suchen...',
    },
    noResults: {
      title: 'Keine Ergebnisse gefunden',
      description: 'Versuchen Sie, Ihre Suche anzupassen oder nach Kategorie zu durchsuchen',
    },
    contact: {
      title: 'Haben Sie noch Fragen?',
      description: 'Wir sind hier um zu helfen! Kontaktieren Sie unser Team und wir melden uns so schnell wie möglich bei Ihnen.',
      cta: 'Kontaktieren Sie uns',
    },
    categories: {
      all: 'Alle',
    },
    footer: {
      rights: 'Alle Rechte vorbehalten.',
    },
  },
  fr: {
    hero: {
      title: 'Questions Fréquemment Posées',
      subtitle: 'Trouvez des réponses aux questions courantes sur notre café',
    },
    search: {
      placeholder: 'Rechercher des questions...',
    },
    noResults: {
      title: 'Aucun résultat trouvé',
      description: 'Essayez d\'ajuster votre recherche ou de parcourir par catégorie',
    },
    contact: {
      title: 'Vous avez encore des questions?',
      description: 'Nous sommes là pour vous aider! Contactez notre équipe et nous vous répondrons dès que possible.',
      cta: 'Contactez-nous',
    },
    categories: {
      all: 'Tous',
    },
    footer: {
      rights: 'Tous droits réservés.',
    },
  },
  sv: {
    hero: {
      title: 'Vanliga Frågor',
      subtitle: 'Hitta svar på vanliga frågor om vårt café',
    },
    search: {
      placeholder: 'Sök frågor...',
    },
    noResults: {
      title: 'Inga resultat hittades',
      description: 'Försök justera din sökning eller bläddra efter kategori',
    },
    contact: {
      title: 'Har du fortfarande frågor?',
      description: 'Vi är här för att hjälpa! Kontakta vårt team så återkommer vi till dig så snart som möjligt.',
      cta: 'Kontakta oss',
    },
    categories: {
      all: 'Alla',
    },
    footer: {
      rights: 'Alla rättigheter förbehållna.',
    },
  },
};

export const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'all'>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get translations for current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Helper function to get localized text
  const getText = (textObj: { en: string; es: string; it: string; de: string; fr: string; sv: string }) => {
    return textObj[language as keyof typeof textObj] || textObj.en;
  };

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      // Category filter
      if (activeCategory !== 'all' && faq.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const questionText = getText(faq.question).toLowerCase();
        const answerText = getText(faq.answer).toLowerCase();
        return questionText.includes(query) || answerText.includes(query);
      }

      return true;
    });
  }, [searchQuery, activeCategory, language]);

  // Group filtered FAQs by category
  const groupedFAQs = useMemo(() => {
    const groups: Record<FAQCategory, FAQItem[]> = {
      general: [],
      orders: [],
      reservations: [],
      loyalty: [],
      catering: [],
    };

    filteredFAQs.forEach((faq) => {
      groups[faq.category].push(faq);
    });

    return groups;
  }, [filteredFAQs]);

  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Category tabs
  const categories: (FAQCategory | 'all')[] = ['all', 'general', 'orders', 'reservations', 'loyalty', 'catering'];

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
            <HelpCircle className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {t.hero.title}
          </h1>
          <p className="text-white/80 text-lg">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-6 -mt-6 relative z-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full pl-12 pr-4 py-4 bg-[#faf8f3] rounded-xl text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-6 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-forest text-white'
                    : 'bg-white text-forest/70 hover:bg-sand/30'
                }`}
              >
                {cat === 'all'
                  ? t.categories.all
                  : getText(categoryLabels[cat])}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-6 pb-12">
        <div className="max-w-lg mx-auto">
          {filteredFAQs.length === 0 ? (
            // No results state
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sand/30 rounded-full mb-4">
                <Search className="w-8 h-8 text-forest/40" />
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">
                {t.noResults.title}
              </h3>
              <p className="text-forest/60">
                {t.noResults.description}
              </p>
            </div>
          ) : activeCategory === 'all' ? (
            // Grouped view when "All" is selected
            <div className="space-y-8">
              {(Object.keys(groupedFAQs) as FAQCategory[]).map((category) => {
                const items = groupedFAQs[category];
                if (items.length === 0) return null;

                return (
                  <div key={category}>
                    <h2 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                      {getText(categoryLabels[category])}
                      <span className="text-xs font-normal text-forest/50 bg-sand/30 px-2 py-1 rounded-full">
                        {items.length}
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {items.map((faq) => (
                        <FAQAccordionItem
                          key={faq.id}
                          faq={faq}
                          isOpen={openItems.has(faq.id)}
                          onToggle={() => toggleItem(faq.id)}
                          getText={getText}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Single category view
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <FAQAccordionItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openItems.has(faq.id)}
                  onToggle={() => toggleItem(faq.id)}
                  getText={getText}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="bg-forest rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-sand/20 rounded-full mb-4">
              <MessageCircle className="w-7 h-7 text-sand" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t.contact.title}
            </h2>
            <p className="text-white/80 mb-6">
              {t.contact.description}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sand text-forest rounded-full font-semibold hover:bg-sand/90 transition-all active:scale-[0.98]"
            >
              {t.contact.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand/30">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-forest/60">
            &copy; {new Date().getFullYear()} Cafe 1973.{' '}
            {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </div>
  );
};

// Accordion Item Component
interface FAQAccordionItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  getText: (textObj: { en: string; es: string; it: string; de: string; fr: string; sv: string }) => string;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({
  faq,
  isOpen,
  onToggle,
  getText,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left hover:bg-sand/10 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-forest">{getText(faq.question)}</span>
        <span className="flex-shrink-0 mt-0.5">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-forest/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-forest/60" />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-5 pb-4 pt-0">
          <p className="text-forest/70 text-sm leading-relaxed">
            {getText(faq.answer)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
