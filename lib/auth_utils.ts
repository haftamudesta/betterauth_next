import { headers } from "next/headers"
import { auth } from "./auth"


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

