"use client"

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmTokenComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('jwtToken');
        const userId = searchParams.get('userId');
        
        if (token === null || userId === null) {
            router.push('/auth/login');
            return;
        }
        
        localStorage.setItem('token', token!);
        localStorage.setItem('userId', userId!);
        console.log(`Received token: ${token}`);
        
        // Redirect to dashboard page
        router.push('/dashboard');
    }, [searchParams, router]);

    return (
        <p>Confirming token...</p>
    );
}

export default function ConfirmToken() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ConfirmTokenComponent />
        </Suspense>
    );
}
