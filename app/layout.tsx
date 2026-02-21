import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PronounceAI - Asistente de Práctica Fonoaudiológica",
  description:
    "Práctica fonoaudiológica con IA. Feedback palabra por palabra en tiempo real para niños con trastornos del habla.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-screen overflow-hidden bg-[#0a0b14]">
        {children}
      </body>
    </html>
  );
}
