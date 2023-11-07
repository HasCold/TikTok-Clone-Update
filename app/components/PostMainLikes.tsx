// We use this component as a wrapper component around other things that might get error if we get a hydration mismatch
'use client'

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { AiFillHeart } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaCommentDots, FaShare } from 'react-icons/fa';
import { useGeneralStore } from '../stores/general';
import { useUser } from '../context/user';
import useGetCommentByPostId from '../hooks/useGetCommentByPostId';
import useGetLikesByPostId from '../hooks/useGetLikesByPostId';
import useIsLiked from '../hooks/useIsLiked';
import useCreateLike from '../hooks/useCreateLike';
import useDeleteLike from '../hooks/useDeleteLike';

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

interface Like {
  _id: string;
  profile_id: string;
  post_id: string;
  likedUser: boolean;
}

interface Comment {
  id: string,
  user_id: string,
  post_id: string,
  text: string,
  created_at: string,
}

const PostMainLikes: React.FC<PostProfileProps> = (
  {post}
) => {

  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const router = useRouter();
  let {setIsLoginOpen, user, token} = useGeneralStore();
  const contextUser = useUser();

  useEffect(() => {
    getAllLikesByPost();                                                                                                         
    getAllCommentsByPost();
  }, [post])

  useEffect(() => {
    hasUserLikesPost();  // we are gonna check that likes get updated  or the user changes 
  }, [likes, contextUser])

  const getAllCommentsByPost = async () => {
    let result = await useGetCommentByPostId(post?._id, token);
    setComments(result);
  }

  const getAllLikesByPost = async () => {
    let result = await useGetLikesByPostId(post?._id, token);
    setLikes(result);
  }

  const hasUserLikesPost = () => {
    if(!contextUser) return

    if(likes?.length < 1 || !user?.user_id){
      setUserLiked(false);
      return;
    }

    let res = useIsLiked(user?._id, post?._id, likes);
    setUserLiked(res ? true : false);
  }

  const like = async () => {
    setHasClickedLike(true)
    await useCreateLike(user?._id, post?._id, token);
    await getAllLikesByPost()
    hasUserLikesPost()
    setHasClickedLike(false)
}

const unlike = async (id: string) => {
    setHasClickedLike(true)
    await useDeleteLike(id, token);
    await getAllLikesByPost()
    hasUserLikesPost()
    setHasClickedLike(false)
}

const likeOrUnlike = () => {
    if (!user) {
        setIsLoginOpen(true)
        return
    }
    let res = useIsLiked(user?._id, post?._id, likes)

    if (!res) {
        like()
    } else {
        likes.forEach((like: Like) => {
            if (user?._id === like?.profile_id && like?.post_id === post?._id) {
                unlike(like?._id) 
            }
        })
    }
}

  return (
    <>
    <div id={`PostMainLikes-${post?._id}`} className='relative mr-[75px]'>
      <div className='absolute bottom-0 pl-2'>
        <div className='pb-4 text-center'>
          <button 
          disabled={hasClickedLike}
          onClick={() => likeOrUnlike()}
          className="rounded-full bg-gray-200 p-2 cursor-pointer"
          >
              {!hasClickedLike ? (
                <AiFillHeart color={likes?.length > 0 && userLiked ? '#ff2626' : ''}  size="25" />
                ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
          </button>
          <span className='text-xs text-gray-800 font-semibold'>
                  {likes?.length}
          </span>
        </div>

        <button 
        onClick={() => router.push(`/post/${post?._id}/${post?.profile_id?._id}`)}
        className='text-center pb-4'
        >
          <div className='rounded-full bg-gray-200 p-2 cursor-pointer'>
              <FaCommentDots size="25" />
          </div>
          <span className='text-xs text-gray-800 font-semibold'>
                  {comments?.length}
          </span>
        </button>

        
        <button className='text-center pb-4'>
          <div className='rounded-full bg-gray-200 p-2 cursor-pointer'>
              <FaShare size="25" />
          </div>
          <span className='text-xs text-gray-800 font-semibold'>
              55
          </span>
        </button>
      </div>      
    </div>
    </>
  )
}

export default PostMainLikes;
