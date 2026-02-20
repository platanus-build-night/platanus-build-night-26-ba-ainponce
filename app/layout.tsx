import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PronounceAI - Practice Your Pronunciation",
  description:
    "AI-powered pronunciation practice with real-time feedback. Improve your English and Portuguese pronunciation with Claude AI coaching.",
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
