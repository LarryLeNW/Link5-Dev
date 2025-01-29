import React from "react";

interface CommentBlogProps {
    blogId: string;
}

const CommentBlog: React.FC<CommentBlogProps> = ({ blogId }) => {
    console.log("🚀 ~ CommentBlog ~ blogId:", blogId);

    return (
        <div className="flex flex-col mt-2">
            <h1 className="text-gray-600">Bình luận</h1>
        </div>
    );
};

export default CommentBlog;
