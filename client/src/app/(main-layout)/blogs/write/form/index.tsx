"use client"
// import { useAuth, useUser } from "@clerk/clerk-react";
// import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill-new";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { useEffect, useState } from "react";
import Upload from "@/components/Upload";
import Image from "next/image";
import { Alert, Input, Tooltip } from "@nextui-org/react";
import { BlogCategoryResType, BlogCateListResType } from "@/schemaValidations/blog-category.schema";
import blogCategoryApiRequest from "@/apiRequests/blog-cate";
import productApiRequest from "@/apiRequests/product";
import { useToast } from "@/components/ui/use-toast";
import blogApiRequest from "@/apiRequests/blog";
import { useForm } from "react-hook-form";
import { CreateBlogBody, CreateBlogBodyType, DemoBody, DemoBodyType } from "@/schemaValidations/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function BlogFormWrite() {
    // const { isLoaded, isSignedIn } = useUser();
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [content, setContent] = useState("");
    const [cover, setCover] = useState("");
    const [img, setImg] = useState<String>("");
    const [video, setVideo] = useState<String>("");
    const [progress, setProgress] = useState(0);
    const [blogCategories, setBlogCategories] = useState<BlogCateListResType["data"]>([])

    const form = useForm<DemoBodyType>({
        resolver: zodResolver(DemoBody),
        defaultValues: {
            title: "",
            // content: "",
            // categoryIds: [],
            // image: "",
            // description: ""
        }
    })

    useEffect(() => {
        img && setContent((prev) => prev + `<p class="inline-block"><image src="${img}"/></p>`);
    }, [img]);

    useEffect(() => {
        video &&
            setContent(
                (prev) => prev + `<p class="inline-block"><iframe class="ql-video" src="${video}"/></p>`
            );
    }, [video]);


    // useEffect(() => {
    //     const fetchCategory = async () => {
    //         const res = await blogCategoryApiRequest.getList()
    //         setBlogCategories(res.payload.data)
    //     };

    //     fetchCategory()
    // }, []);




    // if (!isLoaded) {
    //   return <div className="">Loading...</div>;
    // }

    // if (isLoaded && !isSignedIn) {
    //   return <div className="">You should login!</div>;
    // }

    const onSubmit = async (values: CreateBlogBodyType) => {
        console.log("🚀 ~ onSubmit ~ values:", values.title)
        // setIsLoading(true)
        // e.preventDefault();
        // try {
        //     const formData = new FormData(e.target);
        //     const data = {
        //         title: (formData.get("title") as string) || "",
        //         content,
        //         categoryIds: [(formData.get("category") as string) || ""],
        //         image: cover,
        //         description: (formData.get("desc") as string) || "",
        //     };
        //     const result = await blogApiRequest.create(data);

        //     toast({
        //         description: result.payload.message,
        //         color: "success"
        //     })
        // } catch (error) {
        //     console.log("🚀 ~ handleSubmit ~ error:", error?.toString())
        //     toast({
        //         description: "Lỗi tạo blog, vui lòng thử lại...",
        //         color: "success"
        //     })
        // }
        // setIsLoading(false)
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-cl font-light">Tạo bài viết</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1 mb-6" >
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề :</FormLabel>
                                <FormControl>
                                    <Input placeholder='nhập tiêu đề...' type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <Upload type="image" setProgress={setProgress} setData={setCover}>

                        {
                            cover ? <Image width={180}
                                height={180} src={cover} alt="thumb nail" ></Image>
                                : <button type="button" className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
                                    Thêm ảnh bìa
                                </button>
                        }
                    </Upload>
                    <input
                        className="text-4xl font-semibold bg-transparent outline-none"
                        type="text"
                        placeholder="Title bài viết..."
                        name="title"
                    />
                    <div className="flex items-center gap-4">
                        <label htmlFor="" className="text-sm">
                            Chọn loại bài viết:
                        </label>
                        <select
                            name="category"
                            id=""
                            defaultValue={blogCategories[0]?.id}
                            className="p-2 rounded-xl  shadow-md"
                        >
                            {blogCategories.map((cate) => (
                                <option key={cate.id} value={cate.id}>
                                    {cate.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        className="p-4 rounded-xl bg-white shadow-md"
                        name="desc"
                        placeholder="Mô tả ngắn bài viết"
                    />
                    <div className="flex flex-1 border-none">
                        <div className="flex flex-col gap-2 mr-2">
                            <Tooltip title="Thêm ảnh">
                                <Upload type="image" setProgress={setProgress} setData={setImg}>
                                    🌆
                                </Upload>
                            </Tooltip>
                            <Tooltip title="Thêm video">
                                <Upload type="video" setProgress={setProgress} setData={setVideo}>
                                    ▶️
                                </Upload>
                            </Tooltip>

                        </div>
                        <ReactQuill
                            placeholder="
                     Nội dung..."
                            theme="snow"
                            className="flex-1  bg-white shadow-md border-none"
                            value={content}
                            onChange={setContent}
                            readOnly={0 < progress && progress < 100}
                        />
                    </div>
                    <button
                        disabled={(0 < progress && progress < 100)}
                        className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {false ? "Đang tải..." : "Đăng"}
                    </button> */}
                    {/* {mutation.isError && <span>{mutation.error.message}</span>} */}

                    <Button type='submit' className='!mt-8 w-full'>
                        Thêm bài viết
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default BlogFormWrite;