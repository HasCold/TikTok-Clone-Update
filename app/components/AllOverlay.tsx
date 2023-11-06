'use client'
import dynamic from "next/dynamic";
import { useGeneralStore } from "../stores/general";
import AuthOverlay from "./AuthOverlay";
import ClientOnly from "./ClientOnly";

const AllOverlay = () => {
  let {isLoginOpen, isEditProfileOpen} = useGeneralStore();  
  
  // import EditProfileOverlay from './profile/EditProfileOverlay';
  const EditProfileOverlay = dynamic(() => import('./profile/EditProfileOverlay'), {ssr: false});

  return (
    <>
    <ClientOnly>
      {isLoginOpen ? <AuthOverlay /> : null}
      {isEditProfileOpen ? <EditProfileOverlay /> : null}
    </ClientOnly>
    </>
  ) 
}

export default AllOverlay;