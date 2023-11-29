"use client"

import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import TextInput from '@/app/components/TextInput';
import { useGeneralStore } from '@/app/stores/general';
import React, { useEffect, useState } from 'react'
import Icon from 'react-icons-kit';
import { BiLoaderCircle } from 'react-icons/bi';
import { useParams } from 'next/navigation';
import { useUser } from '@/app/context/user';

interface showErrorObject {
  type: string;
  message: string;
}

interface ResetPasswordProps {
  params: {
    id: string;
    token: string;
  }
}

const resetPassword: React.FC<ResetPasswordProps> = ({params}) => {

  const {setIsLoginOpen, setIsForgetPassword} = useGeneralStore();
  const [type, setType] = useState<string>("password");
  const [error, setError] = useState<showErrorObject | null>(null);
  const [password, setPassword] = useState<string | "">("");
  const [icon, setIcon] = useState(eyeOff);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const {id, token} = useParams();
  const contextUser = useUser();

  useEffect(() => {
    setIsLoginOpen(false);
    setIsForgetPassword(false);
    contextUser?.forgotPassword(params.id, params.token);
  }, []);

  const showError = (type: string) => {
    if(error && Object.entries(error).length > 0 && error.type === type){
        return error.message;
    }
  }

  const handleTogglePassword = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if(type === "password"){
      setType('text');
      setIcon(eye);
    }else{
      setType('password');
      setIcon(eyeOff);
    }
  }

  const validate = () => {
    let isError = false;

    if(!password){
      setError({type: "password", message: "A password is required"});
      isError = true;
    }else if(password.length < 6){
      setError({type: 'password', message: 'The password needs to be longer'})
      isError = true;
    }

    return isError;
  } 

  return (
    <>
    <div className='max-w-[1500px] flex justify-center items-center'>
      <div className='bg-slate-100 h-[70vh] w-[80vw] flex flex-col justify-center items-center mt-[15vh] rounded-md shadow-2xl hover:brightness-110 2xl:w-[60vw] lg:w-[60vw] md:w-[80vw] sm:w-[80vw] '>
        <div className='font-bold lg:text-[50px] md:text-[40px] sm:text-[30px] text-blue-900 mb-14 text-[25px]'>
          <h1>Enter Your New Password</h1>
        </div>

      <form>
      <div className='w-[72vw] lg:w-[40vw] md:w-[50vw] sm:w-[50vw] -mt-6'>
        <label 
        htmlFor="new_password"
        className='font-semibold text-[18px]'
        >
        New Password</label>
        <div className='flex mt-2'>
        <TextInput
        placeholder='Enter password'
        string={password}
        onUpdate={setPassword}
        inputType={type}
        error={showError('password')}
        />
      <button className='cursor-pointer ml-2' onClick={(e) => handleTogglePassword(e)}>
            <Icon icon={icon} size={25}/>
      </button>
        </div>

      <button
      disabled={isloading}
      className={`bg-blue-900 text-white font-bold w-[calc(100%-32px)] flex justify-center items-center mt-3 rounded-md py-3 ${password ? 'hover:bg-blue-700' : ""}`}
      >
      {isloading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Send'}
      </button>
      
      </div>

      </form>
      </div>
    </div>
    </>
  )
}

export default resetPassword;