export const dynamic = 'force-dynamic'

import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import ProductEditButton from '@/app/(main-layout)/products/_components/product-edit-button'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm',
  description: 'Danh sách sản phẩm của Productic, được tạo bởi Larryle dev'
}

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList()
  const productList = payload.data
  return (
    <div className='space-y-3'>
      <h1>Product List</h1>
      {/* <ProductAddButton /> */}

      <div className='space-y-5'>
        {productList.map((product) => (
          <div key={product.id} className='flex space-x-4'>
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={180}
                loading='lazy'
                className='w-32 h-32 object-cover'
              />

            </Link>

            <h3>{product.name}</h3>
            <h3>{product.image}</h3>
            <div>{product.price}</div>
            <ProductEditButton product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
