"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blogApiRequest from '@/apiRequests/blog';
import { fakerDE as faker } from '@faker-js/faker';
import { BlogListResType } from '@/schemaValidations/blog.schema';

export default function BlogList() {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [blogList, setBlogList] = useState<BlogListResType["data"]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const res = await blogApiRequest.getList({ page, limit })
            setBlogList(res.payload.data || []);
        };

        fetchBlogs();
    }, [page, limit]);

    return (
        <div className='flex gap-2 flex-wrap'>
            {blogList.map((blog) => (
                <Link href={`/blogs/${blog.id}`} key={blog.id}>
                    <Image
                        src={faker.image.avatarGitHub()}
                        alt={blog.title}
                        width={180}
                        height={180}
                    />
                    <h3>{blog.title}</h3>
                </Link>
            ))}
        </div>
    );
}
