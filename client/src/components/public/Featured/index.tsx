import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const Featured = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <b>Chào mừng bạn đến với <span style={{ color : "orange"}}>Share Code</span> hãy </b> 
                <em>
                     khám phá những tài nguyên chất lượng
                </em>
            </h1>
          
        </div>
    );
};

export default Featured;
