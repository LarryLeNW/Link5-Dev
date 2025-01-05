import Banner from '@/components/Banner/page'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Trang chủ của Share Code, được tạo bởi Larry Le'
}

export default function Home() {
  return <main className='flex '>
    <Banner />
  </main>
}
