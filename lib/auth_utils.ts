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
        if (error instanceof Error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }
    throw new Error("Authentication failed")
    }
}

export const authIsRequired=async()=>{
    try {
        const session=await authSession();
        if(!session){
            redirect("/sign_in")
        }
        return session;
        
    } catch (error) {
        redirect("/sign_in")
    }
    
}

export const authIsNotRequired=async()=>{
    try {
        const session=await authSession();
        if(session){
            redirect("/")
        }
    } catch (error) {
        return
    }
}