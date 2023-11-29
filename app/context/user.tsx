"use client";

import React, {createContext, useContext, useEffect, useState } from 'react'
import { LoggedUser, UserContextTypes } from '../types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import getUserByID from '../hooks/useGetProfileByUserId';
import { useGeneralStore } from '../stores/general';

const UserContext = createContext<UserContextTypes | null>(null);

const UserProvider = (
    {children}: {children: React.ReactNode}
    ) => {
        
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    let {setIsLoginOpen, setLoggedUser, loggedUser, setUser, setToken} = useGeneralStore();

    const checkUser = async () => {
        let parsedToken = localStorage.getItem("userInfo");
        if(parsedToken !== null){
            const tokenRevalidate: string = JSON.parse(parsedToken);
            getUserByID({tokenRevalidate, loggedUser, setUser});  
            return setIsLoginOpen(false);
        }else{
            return setIsLoginOpen(true);
        }
    }

useEffect(() => {
    checkUser()
}, []);

const profile = async (
    _id: string,
    name: string,
    image: string | undefined
) => {

    try {
    
        setLoading(true);
        const res = await fetch(`/api/profile`, {
          method: "POST",
          body: JSON.stringify({
            _id, name, image 
          }),
          headers : {
            "Content-type" : "application/json",
        }
          });
      
          const data = await res.json();          
          if(!data.success) return toast.error(data.message);
          await checkUser();
          toast.success(data.message);
          setLoading(false);    
          return data;
        
    } catch (error: any) {
        setLoading(false);
        return toast.error(error);
    }
}

const login = async (email: string, password: string) => {
    const res = await fetch(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email, password
        }),
        headers : {
          "Content-type" : "application/json",
        }
      });
  
      const data = await res.json();
      const {_id, name, image} = data;

    //   Clear the local storage and also set the token to null
      localStorage.clear();
      setLoggedUser(null);
      setToken(null);
      setUser(null);
      
      setLoggedUser({_id, name, image});  
      localStorage.setItem("userInfo", JSON.stringify(data.token));
      setToken(data.token);
      
      if(!data.success){
        setLoading(false);
        toast.error(data.message);
     }else{
        await checkUser();
        toast.success(data.message);
        window.location.reload();
    }    
}

const logout = async () => {
    try {
        setLoading(true);
        localStorage.clear();
        setUser(null);
        setLoggedUser(null);
        router.refresh();
        setLoading(false);
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
}

const userValid = async (id: string, token: string) => {
    try {
        const res = await fetch(`/api/auth/forgotPassword/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        
        if(data.status == 201){
            console.log("User valid");
        }else{
            toast.error("Invalid User!");
            router.push('/')
        }
    } catch (error) {
        console.error(error);
    }
}

const resetPassword = async (id: string, token: string, password: string, setPassword: Function, setMessage: Function) => {
    try {
        const res = await fetch(`/api/auth/resetPassword/${id}/${token}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({password})
        });

        const data = await res.json();

        if(data.success){
            setPassword("");
            toast.success(data.message);
            setMessage(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);  // 3000ms -->> 3 seconds
        }else{
            toast.error(data.message);
            router.push("/")
        }
        
    } catch (error) {
        toast.error("Failed to update the password !");
        throw error;
    }
}

    return(
        <UserContext.Provider value={{profile, logout, checkUser, login, userValid, resetPassword}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;

export const useUser = () => useContext(UserContext);
