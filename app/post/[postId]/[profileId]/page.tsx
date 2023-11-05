'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import ClientOnly from '@/app/components/ClientOnly';
import CommentsHeader from '@/app/components/post/CommentsHeader';
import Comments from '../../../components/post/Comments';
import { usePostStore } from '@/app/stores/post';
import { useLikeStore } from '@/app/stores/like';
import { useCommentStore } from '@/app/stores/comment';
import { useGeneralStore } from '@/app/stores/general';

type PostPageTypes = {
    profileId: string;
    postId: string;
}

interface ParamType {
    params: PostPageTypes;
}

const page: React.FC<ParamType> = ({params}) => {
const router = useRouter();  
 
const {token} = useGeneralStore();
let {postById, postsByUser, setPostById, setPostsByUser} = usePostStore();
let {setLikesByPost} = useLikeStore();
let {setCommentsByPost} = useCommentStore()

useEffect(() => { 
    setPostById(params.postId, token);
    setCommentsByPost(params.postId, token); 
    setLikesByPost(params.postId, token)
    setPostsByUser(params.profileId, token); 
}, []);

// const postById = {
//     id: "123",
//     user_id: "456",
//     video_url: "/beach.mp4",
//     text: 'this is some text',
//     created_at: 'date here',
//     profile_id: {
//       _id: "1234"
//       user_id: '456',
//       name: 'User 1',
//       image: 'https://placehold.co/100',
//     }
// }
const loopThroughPostsUp = () => {
    Array.isArray(postsByUser) ? (
        postsByUser.forEach((post: any) => {
            if(post._id > params.postId){
                router.push(`/post/${post?._id}/${params.profileId}`);
            }
        })
    ) : null
}

const loopThroughPostsDown = () => {
    Array.isArray(postsByUser) ? (        
        postsByUser.forEach((post: any) => {
            if(post._id < params.postId){
                router.push(`/post/${post._id}/${params.profileId}`);
            }
        }) 
        ) : null
}

 return (
    <>
    <div 
    id='PostPage'
    className='lg:flex justify-between w-full h-screen bg-black overflow-auto'
    >   
        <div className='lg:w-[calc(100%-540px)] h-full relative'>
            <Link
            href={`/profile/${params?.profileId}`}
            className="absolute text-white z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
            >
            <AiOutlineClose size="27" />
            </Link>

            <div>
                <button
                className="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
                onClick={() => loopThroughPostsUp()}
                >
                    <BiChevronUp size="30" color='#FFFFFF' />
                </button>

                <button
                className="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
                onClick={() => loopThroughPostsDown()}
                >
                    <BiChevronDown size="30" color='#FFFFFF' />
                </button>
            </div>

            <img 
                className="absolute z-20 top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto" 
                width="45" 
                src="/images/tiktok-logo-small.png"
            />

            <ClientOnly>
                {postById?.fileName ? (
                    <video
                    className='fixed object-cover w-full my-auto z-[0] h-screen'
                    src={`${process.env.SERVER_POST_URL}/${postById?.fileName}`}
                    />
                ) : null}
        
        <div className='bg-black bg-opacity-70 lg:min-w-[480px] z-10 relative '>
                {postById?.fileName ? (
                    <video
                    autoPlay // To start a video automatically
                    controls // The controls attribute adds video controls, like play, pause, and volume.
                    loop  // the audio/video should start over again when finished
                    muted  // Sets or returns whether the audio/video is muted or not
                    className='h-screen mx-auto'
                    src={`${process.env.SERVER_POST_URL}/${postById?.fileName}`}
                    />
                    ) : null} 
        </div>
            </ClientOnly>
        
        </div>

    <div 
    id='InfoSection'
    className="lg:max-w-[550px] relative w-full h-full bg-white"
    >
        <div className='py-7'>
            <ClientOnly>
                {postById?.originalName ? (
                    <CommentsHeader post={postById} params={params}/>
                ) : null}
            </ClientOnly>

            <Comments params={params} />
        </div>
    </div>

    </div>
    </>
  )
}

export default page