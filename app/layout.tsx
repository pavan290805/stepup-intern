
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StepUp Intern',
  description: 'Recruiter and internship management dashboard for StepUp Intern',
  icons: {
    icon: [
      { url: '/Product_logos/logo.svg', type: 'image/svg+xml' },
      { url: '/Product_logos/favicon.ico' },
    ],
    shortcut: '/Product_logos/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
