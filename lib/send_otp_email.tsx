import { Resend } from 'resend';
import OtpEmail from '@/emails/otp_email';

type EmailProp={
    to:string,
    otp:string,
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail=async({to,otp}:EmailProp)=>{
   await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'your otp code',
      react:<OtpEmail otp={otp} />,
    })
}