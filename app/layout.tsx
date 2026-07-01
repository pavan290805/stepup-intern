import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "StepUp Intern",
  description: "Recruiter and internship management dashboard for StepUp Intern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
