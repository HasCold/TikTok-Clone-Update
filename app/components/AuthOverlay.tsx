'use client'

import React, {useState, useMemo} from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { useGeneralStore } from '../stores/general';
import dynamic from 'next/dynamic';

const AuthOverlay = () => {
  let {setIsLoginOpen, setIsForgetPassword, isForgetPassword} = useGeneralStore();
  let [isRegister, setIsRegister] = useState<boolean>(false);
  
  // import Login from './auth/Login';
  const Login = useMemo(() => dynamic(() => import('./auth/Login'), {ssr: false}), []);
  
  // import Register from './auth/Register';
  const Register = useMemo(() => dynamic(() => import('./auth/Register'), {ssr: false}), []);

  return (
    <>
    <div
    id="AuthOverlay" 
    className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
        <div className='relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg'>
            <div className='w-full flex justify-end'>
            <button 
            onClick={() => setIsLoginOpen(false)}
            className="p-1.5 rounded-full bg-gray-100">
                <AiOutlineClose size="26"/>
            </button>
            </div>

            {isRegister ? <Register /> : <Login />}

        <div className='flex flex-row-reverse pr-6 mt-2 text-[17px] hover:text-[#F02C56] underline cursor-pointer font-semibold' >
        <button 
        onClick={() => {
          setIsLoginOpen(false)
          setIsForgetPassword(isForgetPassword = !isForgetPassword)
        }}
        >
          {!isRegister ? <p>Forgot Password?</p> : null}
        </button>
        </div>

        <div  className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
          <span className='text-[14px] text-gray-600'>Don't have an account?</span>

          <button
          onClick={() => setIsRegister(isRegister = !isRegister)}  // Toggle Logic
          className='text-[14px] text-[#F02C56] font-semibold pl-1'
          >
            <span>{!isRegister ? "Register" : "log in"}</span>
          </button>
        </div>
        </div>
    </div>
    </>
  )
}

export default AuthOverlay