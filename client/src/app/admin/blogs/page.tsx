import BlogsTable from "@/components/admin/blogs/blogs.table";

const BlogsPage = async (props: any) => {
    const LIMIT = 5;
    const page = props?.searchParams?.page ?? 1;

    const res = await fetch(
        `http://localhost:8000/blogs?_page=${page}&_limit=${LIMIT}`,
        {
            method: "GET",
            next: { tags: ['list-blogs'] }
        }
    );
    const total_items = +(res.headers?.get("X-Total-Count") ?? 0)
    const data = await res.json();

    return (
        <div>
            <BlogsTable
                blogs={data ? data : []}
                meta={
                    {
                        current: +page,
                        pageSize: LIMIT,
                        total: total_items
                    }
                }
            />

        </div>
    )
}

export default BlogsPage;