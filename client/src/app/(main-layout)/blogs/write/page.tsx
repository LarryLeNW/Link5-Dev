
import BlogFormWrite from "@/app/(main-layout)/blogs/write/form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đăng bài viết trên Larry Social Networking'
}

const BlogWrite = () => {
  return <div className="px-8 py-2">
    <BlogFormWrite />
  </div>
};

export default BlogWrite;
