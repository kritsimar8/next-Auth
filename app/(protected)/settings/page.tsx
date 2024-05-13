"use client"

import { logout } from "@/actions/logout";
import { auth,signOut } from "@/auth"
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

const SettingsPage =()=>{
    const user = useCurrentUser();

    const onClick=()=>{
        logout();
    }

    return(
        <div className="bg-white p-10 rounded-xl">
            <button onClick={onClick} type="submit">
                sign Out
            </button>
        </div>
    )
}

export default SettingsPage 