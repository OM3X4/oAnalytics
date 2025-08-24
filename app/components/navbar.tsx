import { TbDeviceAnalytics } from "react-icons/tb";
import React from 'react'
import { Avatar , AvatarImage , AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/auth";
import SignInButton from "./SignInButton";


export default async function Navbar() {

    const session = await auth()

    return (
        <div className="flex items-center justify-between gap-5 p-6 text-white bg-secondary-background border-b border-border">
            <TbDeviceAnalytics className="text-3xl"/>
            {
                session && session.user && session.user.id ? (
                    <div className="flex items-center gap-5">
                        <Avatar>
                            <AvatarImage src={session?.user.image ?? ""} />
                            <AvatarFallback className="text-black">CN</AvatarFallback>
                        </Avatar>
                        <h1 className="text-lg font-bold">{session?.user.name}</h1>
                    </div>
                )
                :
                <SignInButton />
            }
        </div>
    )
}
