"use client"

import { authClient } from "@/lib/auth-client";
import React from "react"

export default function DashBoardLayout({children,}:Readonly<{children:React.ReactNode;}>){
    return (
        <main className="w-full min-h-dvh min-w-dvw overflow-hidden ">
            <nav className="w-full flex justify-end items-center pr-6 h-16 shadow-lg mx-auto max-w-7xl mb-6 overflow-hidden">
                <button onClick={async()=>{await authClient.signOut()}} className="cursor-pointer">
                    Sign Out
                </button>
            </nav>
            {children}
        </main>
    )
}