import CardList from "@/components/public/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/public/Menu";

const BlogPage = ({ searchParams }) => {
    const page = parseInt(searchParams.page) || 1;
    const { cat } = searchParams;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{cat} Danh sách bài viết</h1>
            <div className={styles.content}>
                <CardList page={page} cat={cat} />
                <Menu />
            </div>
        </div>
    );
};

export default BlogPage;
