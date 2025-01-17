export const dynamic = 'force-dynamic'
import blogApiRequest from '@/apiRequests/blog'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fakerDE as faker } from '@faker-js/faker';
import BlogList from '@/app/(main-layout)/blogs/blog-list/blog-list'
export const metadata: Metadata = {
    title: 'Danh sách bài viết',
    description: 'Danh sách bài viết của Share Code, được tạo bởi Larryle dev'
}

export default async function BlogListPage() {

    return (
        <div className='space-y-3 mx-2'>
            <h1 className='text-center'>Blogs List</h1>
            <div className="flex gap-2">
                <div className='flex justify-around gap-2 flex-wrap  w-4/5'>
                    <BlogList></BlogList>
                </div>
                <div className='border-2 flex flex-1 rounded-sm'>
                    <h1 className='mx-auto'>Panel</h1>
                </div>
            </div>


        </div>
    )
}
