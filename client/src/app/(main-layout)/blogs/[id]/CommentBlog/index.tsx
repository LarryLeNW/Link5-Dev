"use client";
import blogCommentApiRequest from "@/apiRequests/blog-comment";
import blogEmotionApiRequest from "@/apiRequests/blog-emotion";
import CommentItem from "@/app/(main-layout)/blogs/[id]/CommentBlog/CommentItem";
import { useAppContext } from "@/app/app-provider";
import { useToast } from "@/components/ui/use-toast";
import { convertTypeEmotionToUI } from "@/lib/utils";
import { BlogCommentListResType } from "@/schemaValidations/blog-comment.schema";
import { BlogEmotionResType } from "@/schemaValidations/blog-emotion.schema";
import Tooltip from "@/ui/Tooltip";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
interface CommentBlogProps {
    blogId: string;
}

const CommentBlog: React.FC<CommentBlogProps> = ({ blogId }) => {
    const commentsRef = useRef<HTMLDivElement | null>(null);
    const { toast } = useToast();
    const { user } = useAppContext();
    const [data, setData] = useState<BlogCommentListResType["data"]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [commentText, setCommentText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emotionCurrent, setEmotionCurrent] = useState<BlogEmotionResType["data"] | null>()
    console.log("🚀 ~ emotionCurrent:", emotionCurrent)

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

    }, [blogId]);

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

    const handleReaction = async (type: string) => {
        await blogEmotionApiRequest.create({ blogId, type });
        getSelectedComment()
    }

    const getSelectedComment = useCallback(async () => {
        try {
            const res = await blogEmotionApiRequest.getSelected({ blogId });
            setEmotionCurrent(res.payload.data);
        } catch (error) {
            console.error("Error fetching selected comment:", error);
        }
    }, [blogId]);

    const handleRemoveEmotion = async () => {
        if (emotionCurrent)
            await blogEmotionApiRequest.delete(emotionCurrent.id);

        getSelectedComment()
    }

    useEffect(() => {
        getSelectedComment();
    }, [getSelectedComment]);

    return (<>
        <div className='bg-slate-100 flex items-center justify-between  px-12 py-2'>
            <Tooltip content={
                <div className='flex gap-1 items-center'>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("love")}>❤️</div>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("like")}>👍</div>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("dislike")}>👎</div>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("sad")}>😢</div>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("agree")}>😠</div>
                    <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("wow")}>😯</div>
                </div>
            }>
                <div className='flex items-center gap-2 cursor-pointer'>
                    {emotionCurrent ? (
                        <div onClick={() => handleRemoveEmotion()}>
                            <span>
                                {convertTypeEmotionToUI(emotionCurrent.type)}
                            </span>
                            <span>Bạn</span>
                        </div>
                    ) : (
                        <div >
                            <AiOutlineLike />
                            <span>
                                Thích
                            </span></div>
                    )}
                </div>
            </Tooltip >
            <div className='flex gap-2 items-center'>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                <span>Bình luận</span>
            </div>
            <div className='flex gap-2 items-center'>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                <span>Chia sẻ</span>
            </div>
        </div >
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
    </>
    );
};

export default CommentBlog;
