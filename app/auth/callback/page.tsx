import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'


const AuthCallbackPage = async () => {
    // Authentication
    const auth = await onAuthenticateUser();

    console.log(auth.status);

    if(auth.status === 200 || auth.status === 201){
        return redirect(`/dashboard/${auth.user?.WorkSpace[0].id}`)
    }

    if(auth.status === 400 || auth.status === 500 || auth.status === 404){
        return redirect('/auth/sign-in')
    }

    // if account doesnot exist, create account in db
}

export default AuthCallbackPage