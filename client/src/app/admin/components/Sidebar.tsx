"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
    const [collapseShow, setCollapseShow] = useState<string>("hidden");
    const pathname = usePathname();

    return (
        <nav
            className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
        >
            <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center  w-full mx-auto">
                <Link href="/">
                    Share code
                </Link>

                <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                    <li className="items-center">
                        <Link href="/admin">
                            <div
                                className={
                                    "text-xs uppercase py-3 font-bold block " +
                                    (pathname.indexOf(
                                        "/admin/dashboard"
                                    ) !== -1
                                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                                        : "text-blueGray-700 hover:text-blueGray-500")
                                }
                            >
                                <i
                                    className={
                                        "fas fa-tv mr-2 text-sm " +
                                        (pathname.indexOf(
                                            "/admin/dashboard"
                                        ) !== -1
                                            ? "opacity-75"
                                            : "text-blueGray-300")
                                    }
                                ></i>{" "}
                                Dashboard
                            </div>
                        </Link>
                    </li>

                    <li className="items-center">
                        <Link href="/admin/settings">
                            <div
                                className={
                                    "text-xs uppercase py-3 font-bold block " +
                                    (pathname.indexOf(
                                        "/admin/settings"
                                    ) !== -1
                                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                                        : "text-blueGray-700 hover:text-blueGray-500")
                                }
                            >
                                <i
                                    className={
                                        "fas fa-tools mr-2 text-sm " +
                                        (pathname.indexOf(
                                            "/admin/settings"
                                        ) !== -1
                                            ? "opacity-75"
                                            : "text-blueGray-300")
                                    }
                                ></i>{" "}
                                Settings
                            </div>
                        </Link>
                    </li>

                    <li className="items-center">
                        <Link href=
                            "/admin/blog-manager"
                        >
                            <div
                                className={
                                    "text-xs uppercase py-3 font-bold block " +
                                    (pathname.indexOf(
                                        "/admin/blog-manager"
                                    ) !== -1
                                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                                        : "text-blueGray-700 hover:text-blueGray-500")
                                }
                            >
                                <i
                                    className={
                                        "fas fa-table mr-2 text-sm " +
                                        (pathname.indexOf(
                                            "/admin/blog-manager"
                                        ) !== -1
                                            ? "opacity-75"
                                            : "text-blueGray-300")
                                    }
                                ></i>{" "}
                                Blog Manger
                            </div>
                        </Link>
                    </li>

                    <li className="items-center">
                        <Link href="/admin/maps">
                            <div
                                className={
                                    "text-xs uppercase py-3 font-bold block " +
                                    (pathname.indexOf(
                                        "/admin/maps"
                                    ) !== -1
                                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                                        : "text-blueGray-700 hover:text-blueGray-500")
                                }
                            >
                                <i
                                    className={
                                        "fas fa-map-marked mr-2 text-sm " +
                                        (pathname.indexOf(
                                            "/admin/maps"
                                        ) !== -1
                                            ? "opacity-75"
                                            : "text-blueGray-300")
                                    }
                                ></i>{" "}
                                Maps
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav >
    );
};

export default Sidebar;
