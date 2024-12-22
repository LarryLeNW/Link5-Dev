import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

interface CardItem {
  img?: string;
  createdAt: string;
  catSlug: string;
  slug: string;
  title: string;
  desc: string;
  views : number;
}

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <Link href={`/posts/${item.slug}`} className={styles.link}>
      <div className={styles.container}>
        {item.img && (
          <div className={styles.imageContainer}>
            <Image
              src={item.img}
              alt={item.title}
              fill
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.textContainer}>
          <div className={styles.detail}>
            <span className={styles.date}>
              {item.createdAt.substring(0, 10)} -{" "}
            </span>
            <span className={styles.category}>{item.catSlug}</span>
          </div>
          <h1>{item.title}</h1>
          <div
            className={styles.desc}
            dangerouslySetInnerHTML={{
              __html: item.desc.substring(0, 60),
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <p>{item.views} lượt xem</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
