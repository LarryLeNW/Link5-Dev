import blogCommentApiRequest from "@/apiRequests/blog-comment";
import { BlogCommentListResType, BlogCommentResType } from "@/schemaValidations/blog-comment.schema";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";

interface CommentItemProps {
    data: BlogCommentResType["data"];
    onReply?: (commentId: string) => void;
}

function CommentItem({ data, onReply }: CommentItemProps) {
    const [replies, setReplies] = useState<BlogCommentListResType["data"]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showReplies, setShowReplies] = useState<boolean>(false);

    const handleFetchReplies = async () => {
        try {
            setIsLoading(true);
            const res = await blogCommentApiRequest.getList({ parentId: data.id });
            setReplies(res.payload.data || []);
            setShowReplies(true);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 py-2 px-4">
            <div className="flex gap-2">
                <Image
                    src={data.postBy.avatar || "/avatar-default.jpg"}
                    width={40}
                    height={40}
                    alt='avatar'
                    className='w-10 h-10 rounded-full object-cover'
                />
                <div className="border rounded flex flex-col w-full px-4 pb-2">
                    <p className="font-bold">{data.postBy.name}</p>
                    <p className="py-1">{data.content}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                        <p>{moment(data.createdAt).fromNow()}</p>
                        <button className="hover:text-blue-600">Thích</button>
                        <button
                            className="hover:text-blue-600"
                            onClick={() => onReply?.(data.id)}
                        >
                            Trả lời
                        </button>
                    </div>

                    {!!data._count?.replies && (
                        <button
                            className="font-bold text-sm text-blue-600 flex gap-2 items-center mt-2"
                            onClick={handleFetchReplies}
                        >
                            {showReplies ? "Ẩn trả lời" : `Xem ${data._count.replies} trả lời`}
                            {isLoading && (
                                <span className="animate-spin">⌛</span>
                            )}
                        </button>
                    )}

                    {showReplies && replies.length > 0 && (
                        <div className="mt-4 flex flex-col gap-4 pl-4">
                            {replies.map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    data={reply}
                                    onReply={onReply}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentItem;