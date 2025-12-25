import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "./send_verification_email";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
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
    plugins:[nextCookies()]
});