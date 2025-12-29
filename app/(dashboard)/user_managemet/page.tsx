import { updateProfile } from "@/app/actions/user";
import { authIsRequired } from "@/lib/auth_utils";
import { redirect } from "next/navigation";

export default async function updateProfilePage(){
    await authIsRequired();
    const user=await updateProfile()
    if(!user){
        return redirect("/sign_in")
    }
    return(
        <main className="w-full min-h-screen p-6 shadow-2xl rounded-2xl h-full flex gap-6 items-start justify-center mx-auto max-w-7xl">
        </main>
    )
}