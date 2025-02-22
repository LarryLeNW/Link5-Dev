import Link from "next/link";
import { ReactNode } from "react";

export default function FriendsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-[95vh]">
            <div className="border w-1/3 px-4">
                <h1 className="text-2xl font-bold">Friends</h1>
                <ul className="flex flex-col gap-2 mt-2">
                    <li className="text-2xl">
                        <Link href="/friends">Trang chủ</Link>
                    </li>
                    <li className="text-2xl">
                        <Link href="/friends/suggestions">Gợi ý</Link>
                    </li>
                    <li className="text-2xl">
                        <Link href="/friends/request">Yêu cầu</Link>
                    </li>
                    <li className="text-2xl">
                        <Link href="/friends/birthday">Sinh nhật</Link>
                    </li>
                </ul>
            </div>
            <div className="w-2/3 " >
                {children}
            </div>
        </div>
    );
}
