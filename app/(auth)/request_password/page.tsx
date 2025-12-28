import { RequestPasswordForm } from "@/components/RequestPasswordForm";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function RequestPasswordPage(){
    await authIsNotRequired()
    return (
        <RequestPasswordForm />
        
    )
}