'use client';
import "./globals.css";
import { usePathname } from 'next/navigation'; // Hook để lấy pathname
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/antd.registry';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserLayout from '@/components/layouts/UserLayout';
import NoLayout from '@/components/NoLayout';
import { ThemeContextProvider } from "@/context/ThemeContext";
import AuthProvider from "@/providers/AuthProvider"

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getLayout = () => {
    if (pathname.startsWith('/admin')) return <AdminLayout>
      <div className="container">
        <div className="wrapper">
          {children}
        </div>
      </div>
    </AdminLayout>;
    if (pathname.startsWith('/auth')) return <NoLayout>
      <div className="container">
        <div className="wrapper">
          {children}
        </div>
      </div>
    </NoLayout>;
    return <UserLayout>
      <div className="container">
        <div className="wrapper">
          {children}
        </div>
      </div>
    </UserLayout>;
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <StyledComponentsRegistry>
          <ThemeContextProvider>
            {getLayout()}
          </ThemeContextProvider>
        </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
