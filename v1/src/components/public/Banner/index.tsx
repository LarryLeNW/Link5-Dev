'use client';
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
                            src={`/images/dragon_${i + 1}.png`}
                            alt={`Dragon ${i + 1}`}
                            width={200}
                            height={200}
                            style={{objectFit : "contain"}}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                <h1 data-content="Larry Le">Larry Le</h1>
                <div className={styles.author}>
                    <h2>Larry Le</h2>
                    <p style={
                        {
                            filter: "drop-shadow(5px 5px 10px red)"
                        }
                    }>
                        <b>Le Ba Trinh</b>
                    </p>
                    <p>Web Developer</p>
                </div>
                <div className={styles.model}></div>
            </div>
        </div>
    );
};

export default Banner;
