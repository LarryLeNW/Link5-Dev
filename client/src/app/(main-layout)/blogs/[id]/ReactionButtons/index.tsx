"use client";

import blogEmotionApiRequest from "@/apiRequests/blog-emotion";

interface CommentBlogProps {
    blogId: string;
}
export default function ReactionButtons({ blogId }: CommentBlogProps) {

    const handleReaction = async (type: string) => {
        const res = await blogEmotionApiRequest.create({ blogId, type });
        console.log("🚀 ~ handleReaction ~ res:", res);
        alert("reacted ...");
    }

    return (
        <div className='flex gap-1 items-center'>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("love")}>❤️</div>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("like")}>👍</div>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("dislike")}>👎</div>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("sad")}>😢</div>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("agree")}>😠</div>
            <div className='text-xl cursor-pointer hover:animate-pulse' onClick={() => handleReaction("wow")}>😯</div>
        </div>
    );
}
