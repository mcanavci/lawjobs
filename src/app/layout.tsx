import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from './providers'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'
import { Search, Menu } from 'lucide-react'

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
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Providers>
          <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
              <div className="flex lg:flex-1">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold text-navy-600">
                    Avukat İş İlanları
                  </span>
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                <Link
                  href="/jobs"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-navy-600"
                >
                  İş İlanları
                </Link>
                <Link
                  href="/companies"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-navy-600"
                >
                  Şirketler
                </Link>
              </div>
              <div className="hidden lg:flex lg:items-center lg:gap-x-4">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:text-navy-600"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/jobs/post"
                  className="rounded-md bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
                >
                  İlan Ver
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex min-h-screen flex-col pt-16">
            {children}
          </main>
        </Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
