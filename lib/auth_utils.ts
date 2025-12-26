import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"


export const authSession=async()=>{
    try {
        const session=await auth.api.getSession({headers:await headers()})
        if(!session){
            throw new Error("Unauthorized:User not found")
        }
        return session

    } catch (error) {
        throw new Error("Authenticated failed")
    }
}

export const authIsRequired=async()=>{
    const session=await authSession();
    if(!session){
        redirect("/sign_in")
    }
    return session;
}

export const authIsNotRequired=async()=>{
    const session=await authSession();
    if(session){
        redirect("/")
    }
}