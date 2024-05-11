import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import {PrismaAdapter} from "@auth/prisma-adapter"

import { db } from "./lib/db"
import authConfig from "./auth.config"

export const{
    handlers:{GET,POST},
    auth,
    signIn,
    signOut 
}=NextAuth({
    // callbacks:{
    //     async jwt({token}){
    //         console.log({token})
    //         return token; 
    //     }
    // },
    adapter :PrismaAdapter(db),
    session:{strategy:"jwt"},
    ...authConfig,
})