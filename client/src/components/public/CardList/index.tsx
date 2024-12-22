'use client';
import React from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../Card/Card";

interface Post {
  _id: string;
  title: string;
  desc: string;
  img?: string;
  createdAt: string;
  catSlug: string;
  slug: string;
  views : number;
}

interface GetDataResponse {
  posts: Post[];
  count: number;
}

interface CardListProps {
  page: number;
  cat?: string;
}

const getData = async (page: number, cat?: string): Promise<GetDataResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/posts?page=${page}&cat=${cat || ""}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const CardList: React.FC<CardListProps> = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  const POST_PER_PAGE = 8;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bài viết hiện tại</h1>
      <div className={styles.posts}>
        {posts?.map((item, index) => (
          <Card item={item} key={index} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;
