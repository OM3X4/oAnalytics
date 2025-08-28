'use client'
import { MdContentCopy } from "react-icons/md";
import React from 'react'
import { toast } from "sonner";

interface props {
    text: string
    className?: string
}


export default function CopyButton({ text , className = "" , ...props }: props) {
    return (
        <MdContentCopy
            {...props}
            className={className}
            onClick={() => {
                navigator.clipboard.writeText(text)
                toast.success("Copied to clipboard")
            }}/>
    )
}
