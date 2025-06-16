import { Metadata } from 'next'
import { ThemeProvider } from './providers'
import Header from '../components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meeting',
  description: 'Meeting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
            <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <Header />
            <div className="container mx-auto h-screen">
                {children}
            </div>
            </ThemeProvider>
            </body>
        </html>
        
    )
}

