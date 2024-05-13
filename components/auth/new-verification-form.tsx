"use client"

import {BeatLoader} from "react-spinners"
import { useSearchParams } from "next/navigation"

import { CardWrapper } from "./card-wrapper"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormSuccess } from "../form-success"
import { FormError } from "../form-error"

export const NewVerificationForm=()=>{
    const [error, setError] = useState<string|undefined>();
    const [success,setSuccess] = useState<string|undefined>()

    const searchParams= useSearchParams();

    const token= searchParams.get("token");
    
    const onSubmit=useCallback(()=>{
       console.log("token")
        if(success||error) return
      if(!token){
        setError("missing token");
        return;
      }
      newVerification(token)
      .then((data)=>{
          setSuccess(data.success);
          setError(data.error);
      }).catch(()=>{
        setError("Something went wrong");
    })
    },[token,success,error]);

   

    useEffect(()=>{
        onSubmit();
    },[onSubmit])

    return(
        <CardWrapper headerLabel="confirming your verification"
            backButtonLabel="back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                
                {!success && !error && (
                    <BeatLoader/>
                )}
                
                <FormSuccess message={success}/>
                {!success&&(
                <FormError message={error}/>)}
            </div>
        </CardWrapper>
    )
}
