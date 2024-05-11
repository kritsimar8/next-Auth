"use client"
import { useState, useTransition } from "react"
import { CardWrapper } from "./card-wrapper"
import * as z from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "../ui/form"
import {Input} from "@/components/ui/input"
import {RegisterSchema} from "@/Schemas"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login } from "@/actions/login"
import { register } from "@/actions/register"

export const RegisterForm =()=>{

    const [error, setError] = useState<string|undefined>("")
    const [success, setSuccess] = useState<string|undefined>("")
    const [isPending,startTransition]= useTransition();


    const form = useForm<z.infer<typeof RegisterSchema>> ({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            email:"",
            password:"",
        },
    }); 
    const onSubmit = async(values:z.infer<typeof RegisterSchema>)=>{
        
        setError("");
        setSuccess("");
        startTransition(()=>{
            register(values)
                .then((data)=>{
                    setError(data.error);
                    setSuccess(data.success)
                })
        })
        
    } 
    return(
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Gautam singhania"
                                       
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="email" render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder=" ram@gmail.com"
                                        type="email"
                                       
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="password" render={({field})=>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="******"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Login
                    </Button>

                </form>

            </Form>
                        
        </CardWrapper>
    )
}

