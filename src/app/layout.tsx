'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

// Metadata export is not supported in Client Components, so we remove it here.
// In a real app we'd split this, but for now strict layout fix is priority.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className} style={isAdmin ? { overflow: 'hidden', height: '100vh', width: '100vw', margin: 0, padding: 0 } : {}}>
        <LanguageProvider>
          {isAdmin ? (
            // Admin Layout: Zero constraints, let the AdminLayout handle everything
            <div className="h-full w-full p-0 m-0 overflow-hidden">
              {children}
            </div>
          ) : (
            // Public Layout: Standard container and padding
            // Hide navigation on Login page for professional look
            pathname === '/login' ? (
              <div className="min-h-screen bg-white flex flex-col">
                {children}
              </div>
            ) : (
              <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <DesktopNav />

                {/* Mobile Header (Hidden on Desktop) */}
                <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-14 flex items-center justify-between px-4">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">Siddhartha Colony</h1>
                  <LanguageToggle />
                </header>

                {/* Main Content Area */}
                <main className="pt-16 pb-20 lg:pt-20 lg:pb-8 px-4 max-w-7xl mx-auto transition-all duration-300">
                  {children}
                </main>

                {/* Bottom Navigation (Hidden on Desktop) */}
                <BottomNav />
              </div>
            )
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}
