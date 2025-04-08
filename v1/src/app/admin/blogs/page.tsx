'use client';
import BlogsTable from "@/components/admin/blogs/blogs.table";
import { useEffect, useState } from "react";

interface Post {
    _id: string;
    title: string;
    desc: string;
    img?: string;
    createdAt: string;
    catSlug: string;
    slug: string;
    views: number;
}

interface GetDataResponse {
    posts: Post[];
    count: number;
}

const BlogsPage = () => {
    const [limit, setLimit] = useState(8);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<GetDataResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const getData = async (page: number, cat?: string) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/posts?page=${page}&cat=${cat || ""}`,
                {
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData(page);
    }, [page, limit]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <BlogsTable
                    blogs={data?.posts || []}
                    meta={{
                        current: page,
                        pageSize: limit,
                        total: data?.count || 0,
                    }}
                />
            )}
        </div>
    );
};

export default BlogsPage;
