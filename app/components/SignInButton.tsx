'use client'
import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function SignInButton() {
    return (
        <div>
            <Button className='cursor-pointer duration-200 bg-secondary-background/30' onClick={() => signIn('google')} variant={'outline'}>Login</Button>
        </div>
    )
}