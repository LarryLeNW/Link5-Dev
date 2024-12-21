'use server'
import { revalidateTag } from 'next/cache'

export const handleCreateBlogAction = async (data: any) => {
    const res = await fetch(`http://localhost:8000/blogs`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    revalidateTag("list-blogs")
    return await res.json()
}

export const handleUpdateBlogAction = async (data: any) => {
    const res = await fetch(`http://localhost:8000/blogs/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    revalidateTag("list-blogs")
    return await res.json()
}

export const handleDeleteBlogAction = async (data: any) => {
    const res = await fetch(`http://localhost:8000/blogs/${data.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    revalidateTag("list-blogs")
    return await res.json()
}