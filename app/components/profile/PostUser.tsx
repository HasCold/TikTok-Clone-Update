import React, { useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from "next/link";
import {SiSoundcharts} from "react-icons/si"; 
import {BiErrorCircle} from "react-icons/bi"; 
import { Post } from '@/app/types';

interface PostUserTypes {
    post: Post
}

const PostUser: React.FC<PostUserTypes> = ({post}) => {
  
  useEffect(() => {
    const video = document.getElementById(`video-${post?._id}`) as HTMLVideoElement;   

    setTimeout(() => {
      video.addEventListener("mouseenter", () => {video.play()}) 
      video.addEventListener("mouseleave", () => {video.pause()}) 
    }, 50);
  
  }, [])
    
  return (
    <>
    <div className='relative brightness-90 hover:brightness-[1.1] cursor-pointer'>
      {!post?.originalName ? (
        <div className='absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black'>
          <AiOutlineLoading3Quarters className='animate-spin ml-1' size="80" color='#FFFFFF'/>
        </div>
      ) : (
        <Link href={`/post/${post._id}/${post.profile_id}`}>
          <video
          id={`video-${post._id}`}
          className="aspect-[3/4] object-cover ml-4 rounded-md"
          loop
          muted
          src={`${process.env.SERVER_POST_URL}/${post.fileName}`}
          />
        </Link>
        )}

        <div className='px-1'>
        <p className='text-gray-700 text-[15px] pt-1 break-words ml-4'>
          {post.text}
        </p>

        <div className='flex items-center gap-1 ml-4 text-gray-600 font-bold text-xs'>
          <SiSoundcharts size="15" />
          3%
          <BiErrorCircle size="16" />
        </div>
        </div>
    </div>
    </>
  )
}

export default PostUser