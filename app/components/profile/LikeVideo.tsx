import { userLikedPost } from '@/app/types';
import React, {useEffect} from 'react'
import { BiErrorCircle } from 'react-icons/bi';
import { SiSoundcharts } from 'react-icons/si';

interface LikeVideoProps{
  post: userLikedPost;
}

const LikeVideo: React.FC<LikeVideoProps> = ({post}) => {

  useEffect(() => {
    const video = document.getElementById(`video-${post?.post_id._id}`) as HTMLVideoElement;

    setTimeout(() => {
      video.addEventListener("mouseenter", () => video.play());
      video.addEventListener("mouseleave", () => video.pause());
    }, 50);

  }, [])

  return (
    <>
    <div className='cursor-pointer'> 
        <video
        id={`video-${post?.post_id._id}`}
        className='aspect-[3/4] brightness-90 hover:brightness-[1.1] object-cover ml-4 rounded-md ' 
        loop
        muted
        src={`${process.env.SERVER_POST_URL}/${post.post_id.fileName}`}
        />
    <div className='px-1'>
        <p className='text-gray-700 text-[15px] pt-1 break-words ml-4'>
          {post?.post_id.text}
        </p>
      </div>
      
      <div className='flex items-center gap-1 ml-4 text-gray-600 font-bold text-xs'>
          <SiSoundcharts size="15" />
          3%
          <BiErrorCircle size="16" />
        </div>
        </div>

    </>
  )
}

export default LikeVideo