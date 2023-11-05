// We use this component as a wrapper component around other things that might get error if we get a hydration mismatch
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { AiFillHeart } from "react-icons/ai"
import { ImMusic } from "react-icons/im"
import PostMainLikes from './PostMainLikes';

interface PostMainProps{
  _id?: string;
  originalName?: string;
  fileName?: string;
  text?: string;
  createdAt?: string;
  profile_id: {
    _id: string
    user_id: string;
    name: string;
    image: string;
  },
}

interface PostProfileProps{
  post: PostMainProps
}

const PostMain: React.FC<PostProfileProps> = (
  {post}
) => {
  
  useEffect(() => {
    const video = document.getElementById(`video-${post?._id}`) as HTMLVideoElement;
    const postMainElement = document.getElementById(`PostMain-${post._id}`);

    // The Intersection Observer is a JavaScript API that allows you to watch for elements as they enter or exit the viewport (i.e., become visible or hidden in the user's browser window). It's commonly used for lazy loading images, infinite scrolling, and other dynamic page behaviors.

    if(postMainElement){
      let observer = new IntersectionObserver((entries) => {
        // if the video is in the screen so gonna play it otherwise pause it

        entries[0].isIntersecting ?  video.play() : video.pause();  // This callback receives an array of IntersectionObserverEntry objects, each representing one of the observed elements.
      }, {threshold: [0.6]});

      observer.observe(postMainElement);
    }
  }, [])

  return (
    <>
    <div id={`PostMain-${post._id}`} className='flex border-b py-6'>
      <div className='cursor-pointer'>
        <img className='rounded-full max-h-[60px]' width="60" src={post?.profile_id?.image}  />
      </div>

      <div className='pl-3 w-full px-4'>
        <div className='flex items-center justify-between pb-0.5'>
          <Link href={`/profile/${post?.profile_id?._id}`}>
            <span className='font-bold hover:underline cursor-pointer'>
                {post?.profile_id?.name}
            </span>
          </Link>

          <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
            Follow
          </button>
        </div>
        <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">{post.text}</p>
        <p className="text-[14px] text-gray-500 pb-0.5">#fun #cool #SuperAwesome</p>
        <p className="text-[14px] pb-0.5 flex items-center font-semibold">
        <ImMusic size="17"/>
          <span className="px-1">original sound - AWESOME</span>
          <AiFillHeart size="20"/>
        </p>

        <div className="mt-2.5 flex">
          <div
          className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
            <video 
            id={`video-${post._id}`}
            loop
            controls
            muted
            className="rounded-xl object-cover mx-auto h-full" 
            src={`${process.env.SERVER_POST_URL}/${post.fileName}`}
            />
            <img 
            className="absolute right-2 bottom-10" 
            width="90" 
            src="/images/tiktok-logo-white.png"
            />
            </div>
            
            <PostMainLikes post={post} />
            </div>
      </div>
    </div>
    </>
  )
}

export default PostMain;

// By using the Intersection Observer, you can efficiently manage and respond to elements entering or exiting the viewport without constantly monitoring scroll events or calculating positions manually. 