import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { LanguageToggle } from "@/components/LanguageToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Siddhartha Colony",
  description: "Community App for Siddhartha Colony, Kisan Nagar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <DesktopNav />

            {/* Mobile Header (Hidden on Desktop) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-14 flex items-center justify-between px-4">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Siddhartha Colony</h1>
              <LanguageToggle />
            </header>

            {/* Main Content Area 
                - pt-16: Space for Mobile Header
                - lg:pt-20: Space for Desktop Header + breathing room
                - pb-20: Space for Bottom Nav (Mobile)
                - lg:pb-8: Standard padding (Desktop)
                - max-w-7xl: Constrain width on large screens
            */}
            <main className="pt-16 pb-20 lg:pt-20 lg:pb-8 px-4 max-w-7xl mx-auto transition-all duration-300">
              {children}
            </main>

            {/* Bottom Navigation (Hidden on Desktop) */}
            <BottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
