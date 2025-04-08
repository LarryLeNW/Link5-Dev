'use client';
import StyledComponentsRegistry from '@/lib/antd.registry';
import { Button } from 'antd';
import { signOut } from "next-auth/react";
export default function AdminLayout({ children }: { children: React.ReactNode }) {


  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true });
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };




  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <div>
            <p>header</p>
            <Button onClick={() => handleSignOut()}>Logout</Button>
          </div>
          <main>{children}</main>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
