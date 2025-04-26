import './globals.css'

export const metadata = {
  title: 'Hyperion Calculator',
  description: 'Calculate',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}