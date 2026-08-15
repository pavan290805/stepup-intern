
import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { AdminProvider } from '@/context/AdminContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { Toaster } from "@/lib/toast";

export const metadata: Metadata = {
  title: "StepUp Intern",
  description: "Recruiter and internship management dashboard for StepUp Intern",
  icons: {
    icon: [
      { url: "/Product_logos/logo.svg", type: "image/svg+xml" },
      { url: "/Product_logos/favicon.ico" },
    ],
    shortcut: "/Product_logos/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AdminProvider>
            <LayoutProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
              />
            </LayoutProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
