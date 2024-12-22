"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";

const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

interface Comment {
  _id: string;
  user: {
    name: string;
    image?: string;
  };
  desc: string;
  createdAt: string;
}

interface CommentProps {
  postSlug?: string;
}

const Comments: React.FC<CommentProps> = ({ postSlug }) => {
  const { status } = useSession();

  const { data, mutate, isLoading } = useSWR<Comment[]>(
    postSlug ? `http://localhost:3000/api/comments?postSlug=${postSlug}` : null,
    fetcher
  );

  const [desc, setDesc] = useState<string>("");

  const handleSubmit = async () => {
    if (!desc) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ desc, postSlug }),
    });
    setDesc("");
    mutate();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea
            placeholder="Write a comment..."
            className={styles.input}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">Đăng nhập để bình luận</Link>
      )}
      <div className={styles.comments}>
        {isLoading ? (
          "Loading"
        ) : (
          data?.map((item) => (
            <div className={styles.comment} key={item._id}>
              <div className={styles.user}>
                {item?.user?.image && (
                  <Image
                    src={item.user.image}
                    alt="User Avatar"
                    width={50}
                    height={50}
                    className={styles.image}
                  />
                )}
                <div className={styles.userInfo}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
