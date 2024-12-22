'use client';
import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";

interface Category {
    _id: string;
    slug: string;
    title: string;
    img?: string;
}

const getData = async (): Promise<Category[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/api/categories`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

const CategoryList: React.FC = async () => {
    const data: Category[] = (await getData()) || [];

    return (
        <div className={styles.container}>
            <div className={styles.categories}>
                {data?.map((item) => (
                    <Link
                        href={`/blog?cat=${item.slug}`}
                        className={`${styles.category} ${styles[item.slug]}`}
                        key={item._id}
                    >
                        {item.img && (
                            <Image
                                src={item.img}
                                alt={item.title}
                                width={32}
                                height={32}
                                className={styles.image}
                            />
                        )}
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
