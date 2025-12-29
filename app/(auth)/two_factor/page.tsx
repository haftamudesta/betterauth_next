import { OtpCOdeForm } from "@/components/OtpCodeForm";
import { authIsNotRequired } from "@/lib/auth_utils";

export default async function AignUpPage(){
    await authIsNotRequired()
    return(
        <OtpCOdeForm />
    )
}