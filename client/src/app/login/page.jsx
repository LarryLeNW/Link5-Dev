"use client";
import { getSession, signIn, useSession } from "next-auth/react";
import styles from "./loginPage.module.css";
import { useRouter } from "next/navigation";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const { status, ...data } = useSession();
    const [email, setEmail] = useState("dlfkjsdl@gmail.com");
    const [password, setPassword] = useState("34983249273");
    const router = useRouter();

    if (status === "loading") {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (status === "authenticated") {
        router.push("/");
    }

    const signDefault = () => {
        console.log("Signing default");
        let result = signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        console.log("🚀 ~ signDefault ~ result:", result);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div>
                    <Input
                        placeholder="username"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={() => signDefault()}>Login...</Button>
                </div>

                <div
                    className={styles.socialButton}
                    onClick={() => signIn("google")}
                >
                    Sign in with Google
                </div>
                {/* <div className={styles.socialButton}>Sign in with Github</div> */}
                {/* <div className={styles.socialButton}>Sign in with Facebook</div> */}
            </div>
        </div>
    );
};

export default LoginPage;
