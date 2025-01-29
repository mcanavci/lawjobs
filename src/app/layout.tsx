'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from 'react'
import { Providers } from './providers'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'
import { Search, Menu, X } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Providers>
          <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
              <div className="flex lg:flex-1">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-xl md:text-2xl font-bold text-navy-600">
                    Avukat İş İlanları
                  </span>
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                <Link
                  href="/"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-navy-600"
                >
                  İş İlanları
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-navy-600"
                >
                  Giriş Yap
                </Link>
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <Link
                  href="/jobs/post"
                  className="rounded-md bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
                >
                  İş İlanı Ver
                </Link>
              </div>
            </nav>

            {/* Mobile menu */}
            <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
              {/* Background backdrop */}
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
              
              <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <Link href="/" className="-m-1.5 p-1.5">
                    <span className="text-xl font-bold text-navy-600">
                      Avukat İş İlanları
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      <Link
                        href="/"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        İş İlanları
                      </Link>
                      <Link
                        href="/auth/login"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Giriş Yap
                      </Link>
                    </div>
                    <div className="py-6">
                      <Link
                        href="/jobs/post"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-navy-600 hover:bg-navy-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        İş İlanı Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
