'use client'
import { useGeneralStore } from "../stores/general";
import AuthOverlay from "./AuthOverlay";
import ClientOnly from "./ClientOnly";
import EditProfileOverlay from "./profile/EditProfileOverlay";

const AllOverlay = () => {
    let {isLoginOpen, isEditProfileOpen} = useGeneralStore();  
  
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