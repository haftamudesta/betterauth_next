import { SignInForm } from "@/components/SignIn";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function SignInPage(){
    await authIsNotRequired()
    return (
        <SignInForm />
        
    )
}