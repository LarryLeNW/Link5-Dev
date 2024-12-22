import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../../ThemeToggle";
import AuthLinks from "../../../authLinks/AuthLinks";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </div>
      <div className={styles.logo}>Share Code</div>
      <div className={styles.links}>
        <ThemeToggle/>
        <Link href="/" className={styles.link}>Trang chủ</Link>
        <Link href="/blog" className={styles.link}>Danh sách bài</Link>
        <Link href="/contact" className={styles.link}>Liên hệ</Link>
        <AuthLinks/>
      </div>
    </div>
  );
};

export default Navbar;
