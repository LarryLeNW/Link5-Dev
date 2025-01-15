"use client";
import blogApiRequest from "@/apiRequests/blog";
import { BlogListResType, BlogResType } from "@/schemaValidations/blog.schema";
import { Pagination, Spinner } from "@nextui-org/react";
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCallback, useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE_COLUMNS = ["title", "content", "views", "postBy", "category", "updatedAt", "actions"];
const columns: Array<{
    name: string;
    uid: string;
    sortable?: boolean;
}> = [
        { name: "ID", uid: "id", sortable: true },
        { name: "TITLE", uid: "title", sortable: true },
        { name: "CONTENT", uid: "content", sortable: true },
        { name: "VIEWS", uid: "views", sortable: true },
        { name: "POST BY", uid: "postBy" },
        { name: "CATEGORY", uid: "category" },
        { name: "UPDATED AT", uid: "updatedAt" },
        { name: "ACTIONS", uid: "actions" },
    ];


export default function BlogManager() {
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(22);
    const [blogs, setBlogs] = useState<BlogListResType["data"]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchBlogs = async () => {
        setIsLoading(true)
        const res = await blogApiRequest.getList({ page, pageSize });
        console.log("🚀 ~ fetchBlogs ~ res:", res)
        setBlogs(res.payload.data || []);
        setTotalPage(res.payload.totalPages)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchBlogs();
    }, [pageSize, page]);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const renderCell = useCallback(
        (blog: BlogResType["data"], columnKey: React.Key) => {
            const cellValue = blog[columnKey as keyof BlogResType["data"]];

            switch (columnKey) {
                case "title":
                    return (
                        <div>{blog.title}</div>
                    );
                case "content":
                    return (
                        <div>{blog.content}</div>
                    );
                case "views":
                    return (
                        <div>{blog.views > 0 || "Chưa có người xem"}</div>
                    );
                case "postBy":
                    return (
                        <div>{blog.postBy.name}</div>
                    );
                case "category":
                    return (
                        <div>
                            {blog.categories?.map((category) => (
                                <p key={category.id}>{category.name}</p>
                            )) || "N/A"}
                        </div>
                    );
                case "actions":
                    return (
                        <div className="relative flex justify-end items-center gap-2">
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    );
                case "updatedAt":
                    return (
                        <div>{new Date(blog.updatedAt).toLocaleDateString("vi-VN")}</div>
                    );
                default:
                    return null;
            }
        },
        []
    );

    return (
        <>
            <div className="flex-1 border flex gap-4 items-center w-full">
                <Table
                    isHeaderSticky
                    aria-label="Blog Management Table"
                    classNames={{
                        wrapper: "  w-full",
                    }}
                    selectionMode="multiple"
                    topContentPlacement="outside"
                    bottomContent={
                        totalPage > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={totalPage}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"No blogs found"} items={blogs}
                        loadingContent={<Spinner />}
                        loadingState={isLoading ? "loading" : "idle"}
                    >
                        {(blog) => (
                            <TableRow key={blog.id}>
                                {(columnKey) => (
                                    <TableCell >{renderCell(blog, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div >
        </>
    );
}
