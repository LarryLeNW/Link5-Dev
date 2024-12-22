import Link from "next/link";
import styles from "./homepage.module.css";
import Featured from "@/components/public/Featured";
import CategoryList from "@/components/public/CategoryList";
import CardList from "@/components/public/CardList";
import Menu from "@/components/public/Menu";
import Banner from "@/components/public/Banner";

interface HomeProps {
  searchParams: {
    page?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <div className={styles.container}>
      <Featured />
      <CategoryList />
      <Banner/>
      <div className={styles.content}>
        <CardList page={page} />
        <Menu />
      </div>
    </div>
  );
}
