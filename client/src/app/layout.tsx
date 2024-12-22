'use client';
import "./globals.css";
import { usePathname } from 'next/navigation'; // Hook để lấy pathname
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/antd.registry';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserLayout from '@/components/layouts/UserLayout';
import NoLayout from '@/components/NoLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getLayout = () => {
    if (pathname.startsWith('/admin')) return <AdminLayout>{children}</AdminLayout>;
    if (pathname.startsWith('/auth')) return <NoLayout>{children}</NoLayout>;
    return <UserLayout>{children}</UserLayout>;
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{getLayout()}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
