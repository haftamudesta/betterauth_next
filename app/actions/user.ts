import { authSession } from "@/lib/auth_utils";
import { db } from "@/lib/db";


export async function updateProfile(){
    const session=await authSession()
    if(!session){
        throw new Error("Unauthorized...")
    }
    const user=await db.user.findUnique({
        where:{id:session.user.id},
        select:{
            name:true,
            email:true,
            image:true,
            twoFactorEnabled:true
        }
    })
    return user;
}