"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
    const [open, setOpen] = useState(false);
    const { data: session, status } = useSession();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <>
            <nav className={styles.nav} style={{ gap: 2, display: "flex" }}>
                {status === "unauthenticated" ? (
                    <Link
                        href="/login"
                        className={`${styles.link} ${styles.login}`}
                    >
                        Đăng nhập
                    </Link>
                ) : (
                    <div style={{ display: "flex", gap: 2 }}>
                        <Link href="/write" className={styles.link}>
                            Đăng bài
                        </Link>
                        <div>{session?.user?.email}</div>
                        <div
                            className={`${styles.link} ${styles.logout}`}
                            onClick={handleSignOut}
                        >
                            Đăng xuất
                        </div>
                    </div>
                )}
                <div className={styles.burger} onClick={() => setOpen(!open)}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </div>
            </nav>

            {open && (
                <div className={styles.responsiveMenu}>
                    <Link href="/" className={styles.menuLink}>
                        Trang chủ
                    </Link>
                    <Link href="/about" className={styles.menuLink}>
                        Về chúng tôi
                    </Link>
                    <Link href="/contact" className={styles.menuLink}>
                        Liên hệ
                    </Link>
                    {status === "unauthenticated" ? (
                        <Link href="/login" className={styles.menuLink}>
                            Đăng nhập
                        </Link>
                    ) : (
                        <>
                            <Link href="/write" className={styles.menuLink}>
                                Đăng bài
                            </Link>
                            <span
                                className={`${styles.menuLink} ${styles.logout}`}
                                onClick={handleSignOut}
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
