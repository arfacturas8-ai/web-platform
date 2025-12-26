import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Cafe 1973 | Bakery - Moravia, Costa Rica",
    template: "%s | Cafe 1973"
  },
  description: "Cafe 1973 | Bakery - Donde cada taza cuenta una historia y cada bocado es una tradicion. Moravia, Costa Rica. Reservaciones, menu, pedidos en linea.",
  keywords: ["cafe", "bakery", "moravia", "costa rica", "reservaciones", "cafe 1973", "pasteleria", "restaurante"],
  authors: [{ name: "Cafe 1973" }],
  creator: "Cafe 1973",
  metadataBase: new URL("https://cafe1973.com"),
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "https://cafe1973.com",
    siteName: "Cafe 1973 | Bakery",
    title: "Cafe 1973 | Bakery - Moravia, Costa Rica",
    description: "Donde cada taza cuenta una historia y cada bocado es una tradicion. Reserva tu mesa hoy.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cafe 1973 | Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cafe 1973 | Bakery - Moravia, Costa Rica",
    description: "Donde cada taza cuenta una historia y cada bocado es una tradicion.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/coffee.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#223833",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
