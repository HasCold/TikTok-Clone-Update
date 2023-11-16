"use client"

import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import TextInput from '@/app/components/TextInput';
import { useGeneralStore } from '@/app/stores/general';
import React, { useEffect, useState } from 'react'
import Icon from 'react-icons-kit';

interface showErrorObject {
  type: string;
  message: string;
}

const page = () => {

  const {setIsLoginOpen, setIsForgetPassword} = useGeneralStore();
  const [type, setType] = useState<string>("password");
  const [error, setError] = useState<showErrorObject | null>(null);
  const [password, setPassword] = useState<string | "">("");
  const [icon, setIcon] = useState(eyeOff)

  useEffect(() => {
    setIsLoginOpen(false);
    setIsForgetPassword(false);
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

  return (
    <>
      <div className=''>
        <div>
          <h1>Enter Your New Password</h1>
        </div>

      <form>
      <div>
        <label htmlFor="new_password">New Password</label>
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

      </form>
      </div>
    </>
  )
}

export default page;