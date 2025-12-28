import * as z from "zod"
import { Resend } from "resend"
import { RequestPasswordEmail } from "@/emails/request_password_email"

type EmailProps={
    to:string,
    subject:string,
    url:string
}

const formSchema = z.object({
  to:z.string().min(6,"Enter valid code"),
  subject:z.string().min(6,"Enter valid code"),
  url:z.string(),
})
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail({to,subject,url}:EmailProps) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      react:<RequestPasswordEmail url={url} to={to} />,
    })
}