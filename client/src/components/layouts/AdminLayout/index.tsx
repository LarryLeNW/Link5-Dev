import StyledComponentsRegistry from '@/lib/antd.registry';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
            <div>header admin</div>
          <main>{children}</main>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
