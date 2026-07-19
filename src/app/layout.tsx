import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiPeticion — Derechos de petición a la DIAN",
  description:
    "Redacta, descarga y haz seguimiento de tu derecho de petición a la DIAN. Sin abogado, guiado paso a paso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900 antialiased">
        <SiteHeader />
        <DisclaimerBanner />
        <main className="w-full flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
