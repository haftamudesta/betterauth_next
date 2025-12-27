import { updateProfile } from "@/app/actions/user";
import { ChangePasswordForm } from "@/components/ChangePassword";
import { ToggleOtpForm } from "@/components/ToggleOtpForm";
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
        <main className="w-full min-h-screen p-6 shadow-2xl rounded-2xl h-full flex gap-6 items-start justify-center">
            <UpdateProfile name={user.name} email={user.email} image={user.image||""} twoFactorEnabled={user.twoFactorEnabled??false}/>
            <ChangePasswordForm />
            < ToggleOtpForm twoFactorEnabled={user.twoFactorEnabled??false}/>
        </main>
    )
}