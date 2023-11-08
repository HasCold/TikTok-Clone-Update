'use client'
import dynamic from "next/dynamic";
import { useGeneralStore } from "../stores/general";
import AuthOverlay from "./AuthOverlay";
import ClientOnly from "./ClientOnly";
import { useMemo } from "react";

const AllOverlay = () => {
  let {isLoginOpen, isEditProfileOpen, isForgetPassword} = useGeneralStore();  
  
  // import EditProfileOverlay from './profile/EditProfileOverlay';
  const EditProfileOverlay =  useMemo(() => dynamic(() => import('./profile/EditProfileOverlay'), {ssr: false}), []);
  
  // import ForgotPassword from './auth/ForgotPassword';
  const ForgotPassword = useMemo(() => dynamic(() => import('./auth/ForgotPassword'), {ssr: false}), []);
  
  return (
    <>
    <ClientOnly>
      {isLoginOpen ? <AuthOverlay /> : null}
      {isForgetPassword ? <ForgotPassword /> : null}
      {isEditProfileOpen ? <EditProfileOverlay /> : null}
    </ClientOnly>
    </>
  ) 
}

export default AllOverlay;