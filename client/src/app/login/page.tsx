"use client";

import { signIn, useSession } from "next-auth/react";
import styles from "./loginPage.module.css";
import { useRouter } from "next/navigation";
import { Button, Input } from "antd";
import { useState, useEffect } from "react";
import { handleDefaultLogin, handleRegister } from "@/actions/auth.action";
import { sendEmail } from "@/services/sendMail";

interface EmailPayload {
    to: string;
    subject: string;
    text: string;
    html: string;
}

interface EmailTemplateProps {
    firstName: string;
}


const LoginPage = () => {
    const { status } = useSession();
    const [email, setEmail] = useState<string>("larrylenw@gmail.com");
    const [password, setPassword] = useState<string>("34983249273");
    const [signInMode, setSignInMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleLogin = async (): Promise<void> => {
        try {
            const result = await handleDefaultLogin(email, password);

            if (result?.error) {
                alert(`Login failed: ${result.error}`);
                return;
            }

            if (result?.user?.role === "admin") {
                router.push("/admin/users");
                return;
            }

            router.push("/");
        } catch (error: unknown) {
            console.error("Login error:", error);
        }
    };

    const handleSignup = async (): Promise<void> => {
        if (!email || !password) {
            alert("Please provide a valid email and password.");
            return;
        }

        try {
            const result = await handleRegister({ email, password })
            console.log("🚀 ~ handleSignup ~ response:", result)

            if (result.ok) {
                alert("Signup successful! You can now log in.");
                setSignInMode(false);
            } else {
                alert(`Signup failed: ${result.message}`);
            }
            // const response = await fetch('/api/sendEmail', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         to: [process.env.NEXT_PUBLIC_EMAIL_TO],
            //         cc: [''],
            //         bcc: [process.env.NEXT_PUBLIC_EMAIL_BCC],
            //         message: {
            //             subject: `YOUR SUBJECT`,
            //             text: 'YOUR TEXT',
            //             html: `
            //          <html>
            //             <head></head>
            //             <body>
            //                <p>Hello user</p>
            //                <p><b>Full Name:</b> demo name</p>
            //                <p><b>Email:</b> demo email</p>
            //                <p><b>Phone number: </b> demo phone </p>
            //                <p><b>Message:</b> demo massage</p>
            //                <br>
            //                <p>Thank you & Regards,<br><b>Team</b></p>
            //             </body>
            //          </html>`,
            //         },
            //     }),
            // });

            // const result = await response.json();
            // alert(result.message); // You can also add route instead of alert  route.push() add you own page.
        } catch (error: unknown) {
            console.error("🚀 ~ handleSignup ~ error:", error);
            alert("Failed to send the email. Please try again.");
        }
    };

    const handleAuthAction = async (): Promise<void> => {
        setLoading(true);
        try {
            if (signInMode) {
                await handleSignup();
            } else {
                await handleLogin();
            }
        } catch (error: unknown) {
            console.error("Auth action failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={signInMode ? styles.titleSignup : styles.titleSignin}>
                    {signInMode ? "Đăng kí " : "Đăng nhập"}
                </h1>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                    <Button
                        onClick={handleAuthAction}
                        disabled={loading}
                        className={signInMode ? styles.bgSignup : styles.bgSignin}
                        style={{
                            width: "100%",
                            color: "white",
                        }}
                    >
                        {loading
                            ? "Loading..."
                            : signInMode
                                ? "Đăng kí "
                                : "Đăng nhập"}
                    </Button>
                    <span>
                        <span style={{ fontSize: "12px" }}>
                            {signInMode
                                ? "Đã có tài khoản ?"
                                : "Chưa có tài khoản ? "}
                        </span>
                        <span
                            style={{ cursor: "pointer" }}
                            className={!signInMode ? styles.titleSignup : styles.titleSignin}
                            onClick={() => setSignInMode((prev) => !prev)}
                        >
                            {signInMode ? " Đăng nhập " : " Đăng kí "}
                        </span>
                    </span>
                </div>
                <div className={styles.socialButton} onClick={() => signIn("google")}>
                    Đăng nhập bằng Google
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
