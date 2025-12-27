import React from "react"

export default function DashBoardLayout({children,}:Readonly<{children:React.ReactNode;}>){
    return (
        <main className="w-full min-h-dvh min-w-dvw bg-white">
            {children}
        </main>
    )
}