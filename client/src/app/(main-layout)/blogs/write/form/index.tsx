"use client"
// import { useAuth, useUser } from "@clerk/clerk-react";
// import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill-new";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { useEffect, useState } from "react";
import Upload from "@/components/Upload";
import Image from "next/image";
import { Alert, Chip, Input, Select, Selection, SelectItem, Textarea, Tooltip } from "@nextui-org/react";
import { BlogCategoryResType, BlogCateListResType } from "@/schemaValidations/blog-category.schema";
import blogCategoryApiRequest from "@/apiRequests/blog-cate";
import productApiRequest from "@/apiRequests/product";
import { useToast } from "@/components/ui/use-toast";
import blogApiRequest from "@/apiRequests/blog";
import { useForm } from "react-hook-form";
import { CreateBlogBody, CreateBlogBodyType } from "@/schemaValidations/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

function BlogFormWrite() {
    // const { isLoaded, isSignedIn } = useUser();
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [cover, setCover] = useState("");
    const [img, setImg] = useState<String>("");
    const [video, setVideo] = useState<String>("");
    const [progress, setProgress] = useState(0);

    const [blogCategories, setBlogCategories] = useState<BlogCateListResType["data"]>([])
    const form = useForm<CreateBlogBodyType>({
        resolver: zodResolver(CreateBlogBody),
        defaultValues: {
            title: "Đây là blog mới của tôi hehehee..e..",
            description: "đây là mô tả blog mới của tôi heheheheh . .."
            // content: "",
            // image: "",
        }
    })

    useEffect(() => {
        img && form.setValue("content", form.getValues("content") + `<p class="inline-block"><image src="${img}"/></p>`);
    }, [img]);

    useEffect(() => {
        video && form.setValue("content", form.getValues("content") + `<p class="inline-block"><image src="${video}"/></p>`);
    }, [video]);


    useEffect(() => {
        const fetchCategory = async () => {
            const res = await blogCategoryApiRequest.getList()
            setBlogCategories(res.payload.data)
        };

        fetchCategory()
    }, []);

    // if (!isLoaded) {
    //   return <div className="">Loading...</div>;
    // }

    // if (isLoaded && !isSignedIn) {
    //   return <div className="">You should login!</div>;
    // }

    const onSubmit = async (values: CreateBlogBodyType) => {
        setIsLoading(true)
        try {
            const result = await blogApiRequest.create({ ...values, image: cover });

            toast({
                description: result.payload.message,
                color: "success"
            })
        } catch (error) {
            console.log("🚀 ~ handleSubmit ~ error:", error?.toString())
            toast({
                description: "Lỗi tạo blog, vui lòng thử lại...",
                color: "success"
            })
        }
        setIsLoading(false)
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-cl font-light">Tạo bài viết</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1 mb-6" >
                    <Upload type="image" setProgress={setProgress} setData={setCover}>
                        {
                            cover ? <Image width={180}
                                height={180} src={cover} alt="thumb nail" ></Image>
                                : <button type="button" className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
                                    Thêm ảnh bìa
                                </button>
                        }
                    </Upload>

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
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả :</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='viết mô tả ngắn ...' type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại bài viết:</FormLabel>
                                <FormControl>
                                    <Select
                                        className="max-w-xs"
                                        label="Chọn ít nhất 1 loại bài viết của bạn"
                                        placeholder="Chọn loại..."
                                        selectionMode="multiple"
                                        selectedKeys={new Set(field.value || [])}
                                        onSelectionChange={(keys) => {
                                            const arrayKeys = Array.from(keys);
                                            field.onChange(arrayKeys);
                                        }}

                                    >
                                        {blogCategories.map((cate) => (
                                            <SelectItem key={cate.id}>{cate.name}</SelectItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-1 flex-col gap-2 px-4 py-2 border rounded">
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
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel>Nội dung bài viết : </FormLabel>
                                        <FormControl>
                                            <ReactQuill
                                                placeholder="
                     Nội dung..."
                                                theme="snow"
                                                className="flex-1  bg-white shadow-md border-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <button
                            disabled={(0 < progress && progress < 100)}
                            className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-40 disabled:bg-blue-400 disabled:cursor-not-allowed ml-auto"
                        >
                            {false ? "Đang tải..." : "Đăng ngay"}
                        </button>
                    </div>


                </form>
            </Form>
        </div>
    );
}

export default BlogFormWrite;