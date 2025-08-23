'use client'
import React from 'react'
import { signIn } from 'next-auth/react'

export default function Login() {
    return (
        <div>
            <button className='bg-blue-500' onClick={() => signIn('google')}>Login</button>
        </div>
    )
}

