import { Resend } from 'resend';
import VerificationEmail from '@/emails/verification_email';
type EmailProp={
    to:string,
    verificationUrl:string,
    userName:string
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail=async({to,verificationUrl,userName}:EmailProp)=>{
   await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'Welcome to better auth',
      react: (
      <VerificationEmail verificationUrl={verificationUrl} userName={userName} />
    ),
    });
}