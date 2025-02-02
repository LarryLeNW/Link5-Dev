"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import blogCommentApiRequest from "@/apiRequests/blog-comment";
import CommentItem from "@/app/(main-layout)/blogs/[id]/CommentBlog/CommentItem";
import { useAppContext } from "@/app/app-provider";
import { useToast } from "@/components/ui/use-toast";
import { BlogCommentListResType } from "@/schemaValidations/blog-comment.schema";
import Image from "next/image";

interface CommentBlogProps {
    blogId: string;
}

const CommentBlog: React.FC<CommentBlogProps> = ({ blogId }) => {
    const { toast } = useToast();
    const { user } = useAppContext();
    const [data, setData] = useState<BlogCommentListResType["data"]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [commentText, setCommentText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const commentsRef = useRef<HTMLDivElement | null>(null);

    const fetchComments = useCallback(async (pageNumber: number) => {
        try {
            setIsLoading(true);
            const res = await blogCommentApiRequest.getList({ blogId, page: pageNumber });
            if (pageNumber === 1) {
                setData(res.payload.data || []);
            } else {
                setData(prev => [...prev, ...(res.payload.data || [])]);
            }
            setTotalComments(res.payload.totalCount || 0);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "Lỗi khi tải bình luận",
                duration: 2000,
            });
        }
    }, [blogId, toast]);

    useEffect(() => {
        fetchComments(1);
    }, [fetchComments]);

    useEffect(() => {
        const container = commentsRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (
                container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
                !isLoading &&
                data.length < totalComments
            ) {
                const nextPage = page + 1;
                fetchComments(nextPage);
                setPage(nextPage);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [data, totalComments, page, fetchComments, isLoading]);

    const handleSendComment = async () => {
        if (!commentText) {
            toast({
                title: "Vui lòng nhập nội dung bình luận",
                description: "Bạn cần nhập nội dung bình luận",
                duration: 2000,
            });
            return;
        }
        try {
            const res = await blogCommentApiRequest.create({
                content: commentText,
                blogId,
            });

            setData(prev => [res.payload.data, ...prev]);
            setCommentText("");

            setTimeout(() => {
                if (commentsRef.current) {
                    commentsRef.current.scrollTop = 0;
                }
            }, 100);
        } catch (error) {
            toast({
                title: "Lỗi",
                duration: 2000,
            });
        }
    };


    return (
        <div className="flex flex-col mt-2">
            <h1 className="text-gray-600">Bình luận</h1>
            {
                (data.length > 0 || isLoading) && (
                    <div
                        ref={commentsRef}
                        className="mt-4 flex flex-col gap-4 max-h-[50vh] overflow-auto border p-2"
                    >
                        {data.map(comment => (
                            <CommentItem data={comment} key={comment.id} />
                        ))}
                        {isLoading && (
                            <div className="space-y-4 py-2">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="flex space-x-4 animate-pulse">
                                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            }

            <div className="border-t border-blue-300 py-2 mx-4 mt-2"></div>
            <div className="flex gap-2">
                <Image
                    src={user?.avatar || "/avatar-default.jpg"}
                    width={180}
                    height={180}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                />
                <div className="border rounded flex flex-col w-full px-4 bg-gray-200">
                    <input
                        className="bg-transparent outline-none p-2"
                        placeholder="Góp ý của bạn ..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-between">
                        <div>control</div>
                        <div
                            className="cursor-pointer text-blue-500"
                            onClick={handleSendComment}
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentBlog;
