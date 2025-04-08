'use client';
import StyledComponentsRegistry from '@/lib/antd.registry';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function UserLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <div className='container'>
            <div className='wrapper'>
               <Navbar/>
              <main>{children}</main>
              <Footer/>
            </div>
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
