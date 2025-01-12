import Header from "@/components/layout/public/header"

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <div>
            <header>admin header</header>
            {children}
        </div>
    )
}
