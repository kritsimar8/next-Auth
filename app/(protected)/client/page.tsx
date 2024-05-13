"use client"

import { UserInfo } from "@/components/user-info"
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = async()=>{
    const user =await useCurrentUser();

    return(
        <UserInfo
        label ="Client component"
        user={user}
        />
    )
}

export default ClientPage;