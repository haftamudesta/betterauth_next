import { updateProfile } from "@/app/actions/user";
import { ChangePasswordForm } from "@/components/ChangePassword";
import { UpdateProfile } from "@/components/UpdateProfile";
import { authIsRequired } from "@/lib/auth_utils";
import { redirect } from "next/navigation";

export default async function updateProfilePage(){
    await authIsRequired();
    const user=await updateProfile()
    if(!user){
        return redirect("/sign_in")
    }
    return(
        <main className="w-full p-6 shadow-2xl rounded-2xl h-full flex gap-6">
            <UpdateProfile name={user.name} email={user.email} image={user.image||""} twoFactorEnabled={user.twoFactorEnabled??false}/>
            <ChangePasswordForm />
        </main>
    )
}