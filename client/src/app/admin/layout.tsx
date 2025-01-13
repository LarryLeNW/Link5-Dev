import Sidebar from "@/app/admin/components/Sidebar"
import Header from "@/components/layout/public/header"

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64  bg-blueGray-100 ">
                <header>header</header>
                <div className="flex flex-1 px-4 md:px-10 mx-auto w-full -ml-18 ">
                    {children}
                </div>
            </div>
        </>
    )
}
