import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from './providers'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Avukat İş İlanları',
    template: '%s | Avukat İş İlanları',
  },
  description: "Türkiye'nin en güncel avukat iş ilanları platformu. Stajyer avukat, kıdemli avukat ve hukuk müşaviri pozisyonları.",
  keywords: 'avukat iş ilanları, stajyer avukat iş ilanları, kıdemli avukat iş ilanları, hukuk müşaviri iş ilanları',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-2xl font-bold text-navy-600">
                      Avukat İş İlanları
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link href="/jobs" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                      İş İlanları
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-700"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-700"
                  >
                    Kayıt Ol
                  </Link>
                  <Link
                    href="/jobs/post"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-navy-600 hover:bg-navy-700"
                  >
                    İlan Ver
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
