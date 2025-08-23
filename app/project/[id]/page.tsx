'use client'
import React from 'react'
import { useParams } from 'next/navigation'

export default function Project() {

    let { id } = useParams()

    const idAsNumber = Number(id)


    return (
        <div className='text-white'>
            <h1>Project {idAsNumber}</h1>
        </div>
    )
}
