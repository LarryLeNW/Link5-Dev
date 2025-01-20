'use client'
import { useAppContext } from '@/app/app-provider'
import ButtonLogout from '@/components/button-logout'
import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const { user } = useAppContext()
  return (
    <div className='flex justify-between py-2 px-8'>
      <div className='flex gap-4'>
        <div className="flex gap-3">
          <Image src="/facebook.png" alt="facebook" width={20} height={10} className='object-contain' />
          <Image src="/instagram.png" alt="instagram" width={20} height={10} className='object-contain' />
          <Image src="/youtube.png" alt="youtube" width={20} height={10} className='object-contain' />
        </div>

        <Link className='text-2xl' href='/products'>Share Code
        </Link>
      </div>

      <ul className='flex space-x-4 items-center'>
        <li>
          <Link href='/'>Trang chủ</Link>
        </li>
        <li>
          <Link href='/products'>Sản phẩm</Link>
        </li>
        <li>
          <Link href='/blogs'>Blogs</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href={'/me'}>
                Xin chào <strong>{user.name}</strong>
              </Link>
            </li>
            <li>
              <Link href='/blogs/write'>Đăng bài</Link>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href='/login'>Đăng nhập</Link>
            </li>
            <li>
              <Link href='/register'>Đăng ký</Link>
            </li>
          </>
        )}
        <ModeToggle />

      </ul>
    </div>
  )
}
