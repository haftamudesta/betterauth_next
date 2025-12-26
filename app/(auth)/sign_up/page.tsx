import { SignUpForm } from "@/components/SignUp";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function AignUpPage(){
    await authIsNotRequired()
    return(
        <SignUpForm />
    )
}