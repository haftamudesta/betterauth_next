import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins"
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"
import { sendVerificationEmail } from "./send_verification_email";
import { sendOtpEmail } from "./send_otp_email";
import { sendResetPasswordEmail } from "./send_reset_password_emal";


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
        sendResetPassword: async ({ user, url}) => {
            const toEmail = process.env.DEVELOPMENT_MODE === "true" 
        ? process.env.TEST_EMAIL || "sample@gmail.com"
        : user.email;
            await sendResetPasswordEmail({
                to: toEmail,
                subject: 'Reset your password',
                 url,
            })
        }
    },
    rateLimit: {
        enabled:true,
        window: 60, 
        max: 3, 
    },
    emailVerification:{
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        sendVerificationEmail:async({user, url})=> {
            const toEmail = process.env.DEVELOPMENT_MODE === "true" 
        ? process.env.TEST_EMAIL || "sample@gmail.com"
        : user.email;
            await sendVerificationEmail({
                to:toEmail,
                verificationUrl:url,
                userName: user.name 
            })
        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt:"select_account",
        }, 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            prompt:"select_account",
        },
    },
    plugins:[
        admin(),
        nextCookies(),
         twoFactor({
            skipVerificationOnEnable:true,
          	otpOptions: {
				async sendOTP({ user, otp }) {
                    const toEmail = process.env.DEVELOPMENT_MODE === "true" 
                        ? process.env.TEST_EMAIL || "example@gmail.com"
                        : user.email;
                    await sendOtpEmail({to:toEmail,otp})
				},
			},
        })
    ]
});