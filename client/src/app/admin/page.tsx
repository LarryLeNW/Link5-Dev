"use client";
import dynamic from "next/dynamic";

const DynamicTable = dynamic(() => import("./components/ui/TableCustom"), { ssr: false });

export default function Dashboard() {
    return null;
}
