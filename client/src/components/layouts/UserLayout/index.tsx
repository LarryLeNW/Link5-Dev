import StyledComponentsRegistry from '@/lib/antd.registry';
import Navbar from './Navbar';
import Footer from './Footer';


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
