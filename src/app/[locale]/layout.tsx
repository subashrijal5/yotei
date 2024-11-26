import type { Metadata } from "next";
import localFont from "next/font/local";
import { LiffProvider } from "@/components/LiffProvider";
import "../globals.css";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { CalendarDays } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserProfile } from "@/components/user-profile";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Youtei - Event Scheduler",
  description: "Schedule events and manage availability with LINE",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const awaitedParams = await params;
  const messages = await getMessages(awaitedParams);
  const t = await getTranslations('Homepage');
  
  return (
    <html lang={awaitedParams.locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LiffProvider>
          <main className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-8 w-8 text-[#00B900]" />
                <h1 className="text-2xl font-bold">{t('title')}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                <ThemeToggle />
                <UserProfile />
              </div>
            </nav>
     
              <NextIntlClientProvider messages={messages}>
                <div className="max-w-4xl mx-auto">
                  {children}
                </div>
              </NextIntlClientProvider>
    
          </main>
          </LiffProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
