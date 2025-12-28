import { RequestPasswordForm } from "@/components/RequestPasswordForm";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function SignInPage(){
    await authIsNotRequired()
    return (
        <RequestPasswordForm />
        
    )
}