import './globals.css'

export const metadata = {
  title: 'Calculator',
  description: 'Calculate',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}