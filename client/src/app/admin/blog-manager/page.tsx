"use client";
import blogApiRequest from "@/apiRequests/blog";
import { capitalize, ChevronDownIcon, PlusIcon, SearchIcon } from "@/app/admin/components/ui/TableCustom";
import useDebounce from "@/hooks/useDebounce";
import { BlogListResType, BlogResType } from "@/schemaValidations/blog.schema";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Spinner, useDisclosure } from "@nextui-org/react";
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCallback, useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE_COLUMNS = ["title", "content", "views", "postBy", "category", "updatedAt", "actions"];

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

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
    const [pageSize, setPageSize] = useState<number>(12);
    const [blogs, setBlogs] = useState<BlogListResType["data"]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [keywords, setKeywords] = useState<string>("");
    const searchDebounce = useDebounce(keywords, 600)

    const fetchBlogs = async () => {
        setIsLoading(true)
        const params = {
            page,
            pageSize,
            keywords: searchDebounce,
        }
        const res = await blogApiRequest.getList(params);
        setBlogs(res.payload.data || []);
        setTotalPage(res.payload.totalPages)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchBlogs();
    }, [pageSize, page]);

    useEffect(() => {
        setPage(1)
        fetchBlogs();
    }, [pageSize, searchDebounce]);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const renderCell = useCallback(
        (blog: BlogResType["data"], columnKey: React.Key) => {
            const cellValue = blog[columnKey as keyof BlogResType["data"]]

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
                            {blog.categories?.length ? (
                                blog.categories.map((category) => (
                                    <p key={category.id}>{category.name}</p>
                                ))
                            ) : (
                                "N/A"
                            )}
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
                    return <div>{String(cellValue ?? "N/A")}</div>;
            }
        },
        []
    );

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">

                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by keyword..."
                        startContent={<SearchIcon />}
                        value={keywords}
                        onClear={() => setKeywords
                            ("")
                        }
                        onValueChange={(value) => {
                            setKeywords(value)
                        }}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                // selectedKeys={statusFilter}
                                selectionMode="multiple"
                            // onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />} onClick={() => onOpen()}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {blogs.length} blogs</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={e => setPageSize(+e.target.value)}
                        >
                            <option value="12">12</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        keywords,
        // statusFilter,
        visibleColumns,
        // onSearchChange,
        // onRowsPerPageChange,
        blogs.length,
        // hasSearchFilter,
    ]);

    return (
        <>
            <Modal isOpen={isOpen} size={"4xl"} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                                    risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                                    quam.
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                                    risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                                    quam.
                                </p>
                                <p>
                                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                                    adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                                    officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex-1 w-full">
                <Table
                    isHeaderSticky
                    aria-label="Blog Management Table"
                    classNames={{
                        wrapper: "  w-full",
                    }}
                    topContent={topContent}
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
                                    <TableCell>{renderCell(blog, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div >
        </>
    );
}
