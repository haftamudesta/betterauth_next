import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function ResetPasswordPage(){
    await authIsNotRequired()
    return (
        <ResetPasswordForm />
        
    )
}