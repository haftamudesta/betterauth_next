import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins"
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "./send_verification_email";
import { sendOtpEmail } from "./send_otp_email";


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
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
            await sendVerificationEmail({
                to:user.email,
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
    plugins:[nextCookies(),
         twoFactor({
          	otpOptions: {
				async sendOTP({ user, otp }) {
                    sendOtpEmail({to:"",otp})
				},
			},
        })
    ]
});