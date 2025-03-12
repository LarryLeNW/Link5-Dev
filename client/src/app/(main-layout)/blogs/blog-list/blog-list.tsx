"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blogApiRequest from '@/apiRequests/blog';
import { fakerDE as faker } from '@faker-js/faker';
import { BlogListResType } from '@/schemaValidations/blog.schema';
import moment from 'moment';
import { Chip, Tooltip } from '@nextui-org/react';

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
        <div className='flex flex-col gap-4 px-6'>
            {blogList.map((blog) => (
                <Link href={`/blogs/${blog.id}`} className='border w-full px-8 py-2 rounded gap-2 flex flex-col ' key={blog.id}>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <Image src={"/avatar-default.jpg"} width={180} height={180} alt='avatar' className='w-14 h-14 rounded-full'></Image>
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-2 items-center'>
                                    <p>{blog.postBy.name}</p>
                                    {blog.categories?.map(item => <Chip size='sm' key={item.category.id}>{item.category.name}</Chip>)}
                                </div>
                                <p className='text-sm'>{moment(blog.createdAt).format("DD/MM/YYYY hh:mm:ss")}</p>
                            </div>
                        </div>
                        <div className='flex gap-2 justify-end'>
                            <p>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </p>
                            <p>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </p>
                        </div>
                    </div>
                    <h3 className='font-bold'>{blog.title}</h3>
                    {
                        blog.image &&
                        <Image src={blog.image} width={180} height={180} alt='avatar' className='w-28 h-28 rounded'></Image>
                    }
                    <p>
                        {blog.description}
                    </p>
                    <div className='mt-2 flex justify-between'>
                        <p className='flex gap-2 items-center'>
                            <span>
                                {blog.views}
                            </span>
                            <span>
                                <Tooltip content={blog.views == 0 ? "Chưa có người xem..." : `Có ${blog.views} lượt xem`}>
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </Tooltip>
                            </span>
                        </p>
                        <div className='hover:text-blue-600'>Xem ngay</div>
                    </div>
                </Link>
            ))
            }
        </div >
    );
}
