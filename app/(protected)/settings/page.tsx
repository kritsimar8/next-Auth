"use client";

import * as z from "zod"
import { logout } from "@/actions/logout";
import { settings } from "@/actions/settings";
import { auth,signOut } from "@/auth"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { SettingsSchema } from "@/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const SettingsPage =()=>{

  
    
    const user = useCurrentUser();
    const [error, setError] = useState<string|undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    const {update} = useSession();
    const [isPending,startTransition] = useTransition();

   
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            name: user?.name || undefined,
            email: user?.email||undefined,
            password:undefined,
            newPassword:undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }

    })

    const onSubmit=(values:z.infer<typeof SettingsSchema>)=>{
       startTransition(()=>{
        settings(values)
            .then((data)=>{
                if(data.error){
                setError(data.error)
                }
                if (data.success){
                update();
                setSuccess(data.success)
            }
        }).catch(()=> setError("Something went wrong"))
       })
       
    }
    console.log(user?.isOAuth)
    console.log(user)

    return(
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Name:
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="gautam singh"
                                        disabled = {isPending}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {user?.isOAuth===false && (
                            
                            <>
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="happy@gmail.com"
                                        type="email"
                                        disabled = {isPending}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="********"
                                        type="password"
                                        disabled = {isPending}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="********"
                                        type="password"
                                        disabled = {isPending}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        </>
                    )}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                    disabled={isPending}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                     <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="select a role"/>
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        <SelectItem value={UserRole.ADMIN}>
                                            Admin
                                        </SelectItem>
                                        <SelectItem value={UserRole.USER}>
                                            User
                                        </SelectItem>
                                     </SelectContent>

                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {user?.isOAuth===false && (

                        
                         <FormField
                            control={form.control}
                            name='isTwoFactorEnabled'
                            render={({field})=>(
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Two factor Authentication</FormLabel>
                                        <FormDescription>Enable two factor Authentication for your account </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            disabled={isPending}
                                            checked= {field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        )}
                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button type="submit" >
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage 