import { Metadata } from 'next'
import { ThemeProvider } from './providers'
import Header from '../components/Header'
import './globals.css'
import { InterviewProvider } from './context/InterviewContext'

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
                <InterviewProvider>
                    <Header />
                    <div className="container mx-auto h-full">
                        {children}
                    </div>
                </InterviewProvider>
            </ThemeProvider>
            </body>
        </html>
    )
}

