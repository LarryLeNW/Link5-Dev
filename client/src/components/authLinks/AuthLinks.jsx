"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
    const [open, setOpen] = useState(false);

    const { data: session } = useSession();

    return (
        <>
            {session?.user ? (
                <>
                    <Link href="/write" className={styles.link}>
                        Đăng bài
                    </Link>
                    <div>Hello {session.user.email}</div>
                    <span
                        className={styles.link}
                        onClick={signOut}
                        style={{ color: "red" }}
                    >
                        Đăng xuất
                    </span>
                </>
            ) : (
                <Link
                    href="/login"
                    className={styles.link}
                    style={{ color: "blue", fontWeight: 500 }}
                >
                    Đăng nhập
                </Link>
            )}
            <div className={styles.burger} onClick={() => setOpen(!open)}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            {open && (
                <div className={styles.responsiveMenu}>
                    <Link href="/">Trang chủ</Link>
                    <Link href="/">Về chúng tôi</Link>
                    <Link href="/">Liên hệ</Link>
                    {session?.user ? (
                        <>
                            <Link href="/write">Đăng bài</Link>
                            <div>Hello {session.user.email}</div>
                            <span
                                className={styles.link}
                                onClick={signOut}
                                style={{ color: "red" }}
                            >
                                Đăng xuất
                            </span>
                        </>
                    ) : (
                        <Link href="/login">Đăng nhập</Link>
                    )}
                </div>
            )}
        </>
    );
};

export default AuthLinks;
