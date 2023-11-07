'use client'

import React, { useEffect, useMemo } from 'react'
import MainLayout from '@/app/layouts/MainLayout'
import ClientOnly from '@/app/components/ClientOnly'
import { BsPencil } from 'react-icons/bs'
import { useUser } from '@/app/context/user'
import { usePostStore } from '@/app/stores/post'
import { useProfileStore } from '@/app/stores/profile'
import { useGeneralStore } from '@/app/stores/general'
import { useImageStore } from '@/app/stores/image'
import dynamic from 'next/dynamic'

interface ProfilePageProps {
  params: {id: string}
}

const Profile: React.FC<ProfilePageProps> = ({params}) => {
  const contextUser = useUser();
  let {postsByUser, setPostsByUser} = usePostStore();  
  let {setCurrentProfile, currentProfile} = useProfileStore();
  let {isEditProfileOpen, setIsEditProfileOpen, user, token} = useGeneralStore();
  let {setCurrentImage, currentImage} = useImageStore(); 

  useEffect(() => {
    // setCurrentProfile(user?.user_id, token);
    setCurrentProfile(params?.id, token)
    setPostsByUser(params?.id, token);
    setCurrentImage(params?.id, token);
}, [setCurrentImage, setCurrentProfile]);

// import PostUser from '@/app/components/profile/PostUser'
const PostUser = useMemo(() => dynamic(() => import("@/app/components/profile/PostUser"), {ssr: false}), [postsByUser, setPostsByUser])

const MemoizedPostByUserComponent = useMemo(() => {
  return Array.isArray(postsByUser) ? (  // Array.isArray()  --> Return boolean   
  postsByUser.map((post, index) => (
    <PostUser key={index} post={post} />            
    ))) : null 
}, [postsByUser, setPostsByUser, currentProfile]);


  return (    
    <>
     <MainLayout>
    
    <div className="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">
      <div className='flex w-[calc(100vw-230px)]'>
        <ClientOnly>
          {currentImage ? (
            <img className='w-[120px] h-[120px] min-w-[120px] rounded-full' src={`${process.env.IMAGES_PORT_URL}/${currentImage?.fileName}`} alt="logo" />
          ) : (
            <div className="min-w-[150px] h-[120px] bg-gray-200 rounded-full" />
          )}
        </ClientOnly>

        <div className='ml-5 w-full'>
            <ClientOnly>
              {currentProfile?.name ? (
                <div>
                  <p className='text-[30px] font-bold truncate'>{currentProfile?.name}</p>
                  <p className='text-[18px] truncate'>{currentProfile?.name}</p>
                </div>
              ) : (
                <div className="h-[60px]" />
              )}
            </ClientOnly>
        
        {user?._id === params?.id ? (
          <button 
          onClick={() => setIsEditProfileOpen(isEditProfileOpen = !isEditProfileOpen)}
          className='flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100'
          >
            <BsPencil className='mt-0.5 mr-1' />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
          className='flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white sm font-semibold bg-[#F02C56]'
          >
            Follow
          </button>
        )}
        </div>
      </div>

      <div className='flex items-center pt-4'>
          <div className='mr-4'>
              <span className='font-bold'>10K</span>
              <span className='text-gray-500 font-light text-[15px] pl-1.5'>Following</span>
          </div>
          <div className='mr-4'>
              <span className='font-bold'>44K</span>
              <span className='text-gray-500 font-light text-[15px] pl-1.5'>Followers</span>
          </div>
      </div>
      
      <ClientOnly>
        <p className="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
          {currentProfile?.bio}
        </p>
      </ClientOnly>

      <ul className="w-full flex items-center pt-4 border-b">
          <li className="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">Videos</li>
          <li className="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">Liked</li>
      </ul>

      <ClientOnly>
        <div className='mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3'>
        {MemoizedPostByUserComponent}
            </div>
            </ClientOnly>
            
            </div>
     </MainLayout>
    </>
  )
}

export default Profile;