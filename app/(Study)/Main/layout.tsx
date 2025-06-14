import './globals.css'
import { ThemeProvider } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/Study/components/Header'
import { GlobalModalProvider } from '@/Study/components/GlobalModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daily English Study',
  description: "Open-source version of Daily English Study",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalModalProvider>
              <Header />
              {children}
            </GlobalModalProvider>
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </body>
    </html>
  )
}
