"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
    const [open, setOpen] = useState(false);

    const { status } = useSession();

    return (
        <>
            {status === "unauthenticated" ? (
                <Link
                    href="/login"
                    className={styles.link}
                    style={{ color: "blue", fontWeight: 500 }}
                >
                    Đăng nhập
                </Link>
            ) : (
                <>
                    <Link href="/write" className={styles.link}>
                        Đăng bài
                    </Link>
                    <span
                        className={styles.link}
                        onClick={signOut}
                        style={{ color: "red" }}
                    >
                        Đăng xuất
                    </span>
                </>
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
                    {status === "notauthenticated" ? (
                        <Link href="/login">Đăng nhập</Link>
                    ) : (
                        <>
                            <Link href="/write">Đăng bài</Link>
                            <span
                                className={styles.link}
                                style={{ color: "red" }}
                            >
                                Đăng xuất
                            </span>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AuthLinks;
