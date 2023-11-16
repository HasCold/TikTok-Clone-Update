"use client"

import React, {useState} from 'react'
import { BiLoaderCircle } from 'react-icons/bi';
import TextInput from '../TextInput';
import { AiOutlineClose } from 'react-icons/ai';
import { useGeneralStore } from '@/app/stores/general';
import { useUser } from '@/app/context/user';
import toast from 'react-hot-toast';

interface showErrorObject {
    type?: string;
    message?: string
}

const ForgotPassword = () => {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string | ''>('');
    const [error, setError] = useState<showErrorObject | null>(null);
    const [message, setMessage] = useState<boolean>(false);
    let {setIsForgetPassword, isForgetPassword, setIsLoginOpen} = useGeneralStore();
    const contextUser = useUser();

    const showError = (type: string) => {
        if(error && Object.entries(error).length > 0 && error.type === type){
            return error.message;
        }
    }

    const validate= () => {
        let isError = false;
        const regExp =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!email){
            setError({type: "string", message: "An email is required"})
            isError = true;
        }else if(!regExp.test(email)){
            setError({type:"email", message: "Invalid email"});
            isError = true;
        }

        return isError;
    }

    const resetPasswordLink = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        let isError = validate();
        if(isError) return 
        if(!contextUser) return

        try {
            setLoading(true)
            const res = await fetch("/api/auth/sendpasswordLink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email})
            });
            
            const data = await res.json();
            
            if(data.success){
                setEmail("");
                setMessage(true);
                toast.success("Password reset link has been sent")

                setTimeout(() => {
                    setIsLoginOpen(false);
                    setIsForgetPassword(false);
                }, 60000);  // 60,000 miliseconds = 60 seconds = 1 min 
            }else{
                toast.error(data.message)
            }
            setLoading(false)
        } catch (error: any) {
            toast.error("Invalid User");
            console.warn(error);
        }
    }

  return (
    <div 
    className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
    <div className='relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg'>

    <div className='w-full flex justify-end'>
            <button 
            onClick={() => setIsForgetPassword(isForgetPassword = !isForgetPassword)}
            className="p-1.5 rounded-full bg-gray-100">
                <AiOutlineClose size="26"/>
            </button>
            </div>

        <h1 className="text-center text-[28px] mb-4 font-bold">Forgot Password</h1>

        <h3 className="text-center text-[19px] mb-4 font-medium">Enter Your Email</h3>

    {message ? <p className='text-green-700 font-semibold text-center py-2 pb-2'>Password reset link send successfully to your email !</p> : ""}

    <div className="px-6 pb-2">
         <TextInput 
             string={email}
             placeholder="Please enter your email address"
             onUpdate={setEmail}
             inputType="email"
             error={showError('email')}
         />
     </div>

     <div className="px-6 pb-2 mt-6">
    <button 
        disabled={loading}
        onClick={(e) => resetPasswordLink(e)}
        className={`
            flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm
            ${(!email) ? 'bg-gray-400 text-white-500' : 'bg-[#F02C56]'}
        `}
    >
        {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Send'}
    </button>
    </div>
    </div>

    </div>
  )
}

export default ForgotPassword;