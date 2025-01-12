export const dynamic = 'force-dynamic'

import blogApiRequest from '@/apiRequests/blog'
import productApiRequest from '@/apiRequests/product'
import ProductEditButton from '@/app/products/_components/product-edit-button'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fakerDE as faker } from '@faker-js/faker';
export const metadata: Metadata = {
    title: 'Danh sách bài viết',
    description: 'Danh sách bài viết của Share Code, được tạo bởi Larryle dev'
}

export default async function BlogListPage() {
    const { payload } = await blogApiRequest.getList()
    console.log("🚀 ~ BlogListPage ~ payload:", payload)
    const blogList = payload.data
    return (
        <div className='space-y-3 mx-2'>
            <h1 className='text-center'>Blogs List</h1>
            <div className="flex gap-2">
                <div className='flex justify-around gap-2 flex-wrap  w-4/5'>
                    {blogList.map((blog) => (
                        <Link href={`/blogs/${blog.id}`} className='flex space-x-4 border px-2 py-2 w-[48%] rounded' key={blog.id} >
                            <Image
                                src={faker.image.avatarGitHub()}
                                alt={blog.title}
                                width={180}
                                height={180}
                                loading='lazy'
                                className='w-32 h-32 object-cover'
                            />
                            <div className="flex flex-col">
                                <h3 className='text-blue-600'>{blog.title}</h3>
                                <div>{blog.content}</div>
                                <div> {blog.views}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='border-2 flex flex-1 rounded-sm'>
                    <h1 className='mx-auto'>Panel</h1>
                </div>
            </div>


        </div>
    )
}
