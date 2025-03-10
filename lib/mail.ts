import email from "next-auth/providers/email";
import {Resend} from "resend"

const resend = new Resend (process.env.RESEND_API_KEY);



export const sendTwoFactorTokenEmail=async(
    email:string,
    token:string,
)=>{
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"2FA code",
        html:`<p>Your 2FA code: ${token}</p>`
    })
}





export const sendPasswordResetEmail= async (
    email:string,
    token:string,
)=>{
    const resetLink= `http://localhost:3001/auth/new-password?token=${token}`

    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Reset your password",
        html:`<p>click <a href="${resetLink}">here</a> to confirm email.</p>`
    })
}





export const sendVerificationEmail= async(
    email:string ,
    token:string
)=>{
    const confirmLink = `http://localhost:3001/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email ,
        subject:"confirm your email",
        html:`<p>click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })
}