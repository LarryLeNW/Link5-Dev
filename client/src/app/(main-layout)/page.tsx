import Banner from '@/components/Banner/page'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Trang chủ của Share Code, được tạo bởi Larry Le'
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Banner section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.jpg"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Share Code</h1>
          <p className="text-xl mb-8">Nền tảng chia sẻ code và kiến thức lập trình</p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-semibold">
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Chia sẻ code</h3>
              <p className="text-gray-600">Dễ dàng chia sẻ code với cộng đồng, nhận feedback và góp ý</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Học hỏi</h3>
              <p className="text-gray-600">Học hỏi từ cộng đồng qua các bài viết và đoạn code chất lượng</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Kết nối</h3>
              <p className="text-gray-600">Kết nối với các lập trình viên khác, mở rộng network</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-yellow-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Bắt đầu chia sẻ code ngay hôm nay</h2>
          <p className="text-lg mb-8">Tham gia cộng đồng của chúng tôi và bắt đầu hành trình chia sẻ kiến thức</p>
          <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800">
            Đăng ký miễn phí
          </button>
        </div>
      </section>
    </main>
  )
}
