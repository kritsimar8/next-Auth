"use server"

import { LoginSchema } from "@/Schemas"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import * as z from "zod"
import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";


export const login = async (values:z.infer<typeof LoginSchema>)=>{
    const validatedFields= LoginSchema.safeParse(values);
    
    if(!validatedFields.success){
        return {error:"Invalid fields"};
    }
    const {email,password,code}= validatedFields.data;

    const existingUser= await getUserByEmail(email);

    if(!existingUser || !existingUser.email|| !existingUser.password){
        return {error:"Email doest not exist"}
    }
    if(!existingUser.emailVerified){
        const verificationToken= await generateVerificationToken(
            existingUser.email
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )
        return {success:"Confirmation email sent"}
    }


    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );
            if (!twoFactorToken){
                return {error:"Invalid code!"};
            }
            if (twoFactorToken.token!==code){
                return {error:"Inavlid code"};
            }
            const hasExpired = new Date(twoFactorToken.expires)<new Date();

            if(hasExpired){
                return {error:"code expired!"};
            }
            await db.twoFactorToken.delete({
                where:{id:twoFactorToken.id}
            })
            const existingConfirmation= await getTwoFactorConfirmationByUserId(
                existingUser.id
            );
            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where:{id: existingConfirmation.id}
                })
            }
            await db.twoFactorConfirmation.create({
                data:{
                    userId:existingUser.id,
                }
            })
            
        }else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
        );
        return {twoFactor:true};
        }
        
    }


    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo:DEFAULT_LOGIN_REDIRECT
        })
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return{error:"Invalid credentials"}
                default:
                    return{error:"Something went wrong!"}
            }
        }
        throw error;
    }
}