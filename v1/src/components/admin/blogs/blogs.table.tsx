'use client'
import { handleDeleteBlogAction } from '@/actions/blog.action';
import { IBlog } from '@/types/backend';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateBlog from './create.blog';
import UpdateBlog from './update.blog';


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

interface IProps {
    blogs: Post[] | [];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    }
}

const BlogsTable = (props: IProps) => {

    const searchParams = useSearchParams() || {};
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const { blogs, meta } = props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);


    useEffect(() => {
        if (blogs) setIsFetching(false)
    }, [blogs])

    const columns: ColumnsType<Post> = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
        },
        {
            title: 'Views',
            dataIndex: 'views',
        },
          {
            title: 'createdAt',
            dataIndex: 'Created at',
        },
        {
            title: 'Actions',
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa blog"}
                            description={"Bạn có chắc chắn muốn xóa blog này ?"}
                            onConfirm={() => handleDeleteBlog(record)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        }

    ];

    const handleDeleteBlog = async (blog: any) => {
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Blogs</span>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm mới
                </Button>
            </div>
        )
    }


    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('page', pagination.current);
            replace(`${pathname}?${params.toString()}`);
            setIsFetching(true)
        }
    };

    return (
        <div>
            <Table
                title={renderHeader}
                loading={isFetching}
                rowKey={"_id"}
                bordered
                dataSource={blogs}
                columns={columns}
                onChange={onChange}
                pagination={
                    {
                        ...meta,
                        showTotal: (total, range) => {
                            return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                        }
                    }
                }
            />

            <CreateBlog
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UpdateBlog
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

        </div>
    )
}

export default BlogsTable;