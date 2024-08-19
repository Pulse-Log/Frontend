"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ConfirmToken(){
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(()=>{
        const token = searchParams.get('jwtToken');
        const userId = searchParams.get('userId');
        if(token===null || userId===null){
            router.push('/auth/login');
        }
        localStorage.setItem('token', token!);
        localStorage.setItem('userId', userId!);
        console.log(`Received token: ${token}`);
        // perform token verification and store it in local storage or session storage
        // then redirect to dashboard page
        router.push('/dashboard');
    })
    return (
        <p>Confirming token</p>
    )
}