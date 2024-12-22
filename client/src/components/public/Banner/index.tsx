import Image from "next/image";
import styles from "./banner.module.css";
import { FC } from "react";

const Banner: FC = () => {
    return (
        <div className={styles.banner}>
            <div
                className={styles.slider}
                style={{ "--quantity": 10 } as React.CSSProperties}
            >
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        className={styles.item}
                        style={{ "--position": i + 1 } as React.CSSProperties}
                        key={i + 1}
                    >
                        <Image
                            src={`/images/dragon_${i + 1}.jpg`}
                            alt={`Dragon ${i + 1}`}
                            width={500}
                            height={500}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                <h1 data-content="CSS ONLY">CSS ONLY</h1>
                <div className={styles.author}>
                    <h2>LUN DEV</h2>
                    <p>
                        <b>Web Design</b>
                    </p>
                    <p>Subscribe to the channel to watch many interesting videos</p>
                </div>
                <div className={styles.model}></div>
            </div>
        </div>
    );
};

export default Banner;
