'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiLoaderCircle } from 'react-icons/bi';
import { BsChatDots, BsTrash3 } from 'react-icons/bs';
import { ImMusic } from 'react-icons/im';
import ClientOnly from '../ClientOnly';
import { AiFillHeart } from 'react-icons/ai';
import { useLikeStore } from '@/app/stores/like';
import { useCommentStore } from '@/app/stores/comment';
import { useGeneralStore } from '@/app/stores/general';
import toast from 'react-hot-toast';
import moment from 'moment';
import useCreateLike from '@/app/hooks/useCreateLike';
import useDeleteLike from '@/app/hooks/useDeleteLike';
import useIsLiked from '@/app/hooks/useIsLiked';
import useDeletePostById from '@/app/hooks/useDeletePostById';

type paramType = {
    profileId: string;
    postId: string;
}

type postTypes = {
    _id?: string;
    originalName?: string;
    fileName?: string;
    text?: string;
    createdAt?: string;
    profile_id: {
      _id: string;
      user_id: string;
      name: string;
      image: string;
    }
}

interface CommentHeaderProps {
    post: postTypes;
    params: paramType;
}

const CommentsHeader: React.FC<CommentHeaderProps> = ({post, params}) => {
  
  let {setLikesByPost, likesByPost } = useLikeStore();
  let {commentsByPost, setCommentsByPost} = useCommentStore();
  let {setIsLoginOpen, user, token} = useGeneralStore();
  
  const router = useRouter();
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [isDeleteing, setIsDeleteing] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  
  useEffect(() => {
    setCommentsByPost(params?.postId, token);
    setLikesByPost(params?.postId, token);
  }, [post]);
  
  useEffect(() => {
    hasUserLikePost()
  }, [likesByPost]);
  
  const hasUserLikePost = () => {
      if(likesByPost.length < 1 || !user?.user_id){
        setUserLiked(false);
        return;
      }

      let res = useIsLiked(user._id, params.postId, likesByPost);  // In res we will get true or false
      setUserLiked(res ? true : false);
  }

  const like = async () => {
    try {
      setHasClickedLike(true);
      
      toast.promise(
        useCreateLike(user?._id, params?.postId, token),
        {
          loading: 'Loading...',
          success: <b>Like Success!</b>,
          error: <b>Could not like</b>
        }

      )
      setLikesByPost(params.postId, token);
      setHasClickedLike(false);
    } catch (error: any) {
        toast.error(error);
        console.warn(error);
        setHasClickedLike(false);   
    }
  }

  const unlike = async (id: string | undefined) => {
    try {
      setHasClickedLike(true);
      
      toast.promise(
        useDeleteLike(id, token),
         {
           loading: 'Loading...',
           success: <b>Unlike Success!</b>,
           error: <b>Could not Unlike.</b>,
         }
       );
      setLikesByPost(params.postId, token);
      setHasClickedLike(false);
    } catch (error: any) {
        toast.error(error);
        console.warn(error);
        setHasClickedLike(false);   
    }
  }
  
  const likeOrUnlike = () => {
    if(!user) return setIsLoginOpen(true);

    let res = useIsLiked(user?._id, params.postId, likesByPost);  // In res we will get either true or false;

    if(!res){  // NOT True 
      like();  // That means there is no like;
    }else{
      likesByPost.forEach(like => {  // This means that will true we will unlike it
        if(user?.user_id && user._id === like.profile_id && like.post_id === params.postId){
            unlike(like?._id)
        }
      })
    }
  }

  const deletePost = async () => {
    let res = confirm("Are you sure, you want to delete this post?"); 
    if(!res) return;

    setIsDeleteing(true);

    try {
      toast.promise(
        useDeletePostById(params?.postId, post?.fileName, token),
        {
          loading: 'Loading...',
          success: <b>Deleted Successfully!</b>,
          error: <b>Could not delete.</b>,
        }
      );

      router.push(`profile/${params?.profileId}`);
      setIsDeleteing(false);
    } catch (error: any) {
      console.warn(error);  
      toast.error(error);
      setIsDeleteing(false);
    }
  }
  
  // {console.log(post.profile_id._id);}  

  return (
    <>
  <div className='flex items-center justify-between px-8'>
    <div className='flex items-center'>
      <Link href={`/profile/${post?.profile_id._id}`}>
        {post?.profile_id.image ? (
          <img className='rounded-full lg:mx-0 mx-auto' width="40" src={post?.profile_id.image} />
        ) : (
          <div className='w-[40px] h-[40px] bg-gray-200 rounded-full' />
        )}
      </Link>

      <div className="ml-3 pt-0.5">
      <Link 
          href={`/profile/${post?.profile_id._id}`} 
          className="relative z-10 text-[17px] font-semibold hover:underline"
      >
          {post?.profile_id.name}
      </Link>

      <div className="relative z-0 text-[13px] -mt-5 font-light">
          {post?.profile_id.name}
          <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5 ">.</span>
          <span className="font-medium">{moment(post?.createdAt).calendar()}</span>
      </div>
      </div>
    </div>

    {user?.user_id === post?.profile_id.user_id ? (
      <div>
        {isDeleteing ? (
          <BiLoaderCircle className='animate-spin' size="25" />
        ) : (
          <button disabled={isDeleteing} onClick={() => deletePost()}>
            <BsTrash3 className='cursor-pointer' size="25" />
          </button>
        )}
      </div>
    ) : null}
  </div>

  <p className="px-8 mt-4 text-sm">{post?.text}</p>

<p className="flex item-center gap-2 px-8 mt-4 text-sm font-bold">
    <ImMusic size="17"/>
    original sound - {post?.profile_id.name}
</p>

    <div className="flex items-center px-8 mt-8">
                <ClientOnly>
                    <div className="pb-4 text-center flex items-center">
                        <button 
                            disabled={hasClickedLike}  // if hasCliecklike is true disabled the button
                            onClick={() => likeOrUnlike()} 
                            className="rounded-full bg-gray-200 p-2 cursor-pointer"
                        >
                            {!hasClickedLike ? (
                                <AiFillHeart color={likesByPost.length > 0 && userLiked ? '#ff2626' : ""} size="25"/>
                            ) : (
                                <BiLoaderCircle className="animate-spin" size="25"/>
                            )}
                        </button>
                        <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
                            {likesByPost.length}
                        </span>
                    </div>
                </ClientOnly>

                <div className="pb-4 text-center flex items-center">
                    <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                        <BsChatDots size={25} />
                    </div>
                    <span className="text-xs pl-2 text-gray-800 font-semibold">
                      {commentsByPost.length}
                    </span>
                </div>
    </div>
    </>
  )
}

export default CommentsHeader