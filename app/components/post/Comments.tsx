import React, {Suspense, useEffect, useState} from 'react'
import ClientOnly from '@/app/components/ClientOnly';
import SingleComment from './SingleComment';
import { BiLoaderCircle } from 'react-icons/bi';
import { useCommentStore } from '@/app/stores/comment';
import { useGeneralStore } from '@/app/stores/general';
import toast from 'react-hot-toast';
import { useProfileStore } from '@/app/stores/profile';
import useCreateComment from '@/app/hooks/useCreateComment';

interface CommmentsProps {
    params: {
        profileId: string;
        postId: string;
    }
}

const Comments: React.FC<CommmentsProps> = ({params}) => {

    let {commentsByPost, setCommentsByPost } = useCommentStore();
    let {setIsLoginOpen, user, token} = useGeneralStore();
    let {currentProfile, setCurrentProfile} = useProfileStore();

    const [comment, setComment] = useState<string>('');
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

//     "success": true,
//     "getPostById": [
//      {
//       "_id": "6539558da847827965d18f22",
//       "post_id": "653518ad4ed7a33c1d156d39",
//       "profile_id": {
//           "_id": "6522ba4f0d79bc61101ecad1",
//           "user_id": "6522ba4f0d79bc61101ecacf",
//           "image": "https://www.pexels.com/photo/white-clouds-1450355",
//           "name": "Hasan"
//       },
//       "comment": "Nice video bro! May Allah bless you",
//       "createdAt": "2023-10-25T17:51:09.193Z",
//       "updatedAt": "2023-10-25T17:51:09.193Z",
//       "__v": 0
// },

const addComment = async () => {
    if(!user) return setIsLoginOpen(true);

    try {
        setIsUploading(true);

        await useCreateComment(user._id, params?.postId, comment, token);
        setComment("");
        setCommentsByPost(params?.postId, token);
        setIsUploading(false);

        toast.success("Comment Added !");

    } catch (error: any) {
        toast.error(error);
        console.warn(error);
    }
}

  return (
    <>
    <div 
    id="Comments" 
    className="relative bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
    >
        <div className="pt-2"/>

        <ClientOnly>
        {commentsByPost.length < 1 ? (
            <div className='text-center mt-6 text-xl text-gray-500 '>No comments...</div>
        ): (
            <div>
                <Suspense fallback={<p className='text-center'>Comments Load...</p>}>
                {commentsByPost.map((comment, index) => (
                    <SingleComment key={index} comment={comment} params={params} />
                    ))}
                </Suspense>
            </div>
        )}
        </ClientOnly>
        <div className="mb-28" />
    </div>

    <div 
    id='CreateComment'
    className="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
    >
    <div 
        className={`
            bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]
            ${inputFocused ? 'border-2 border-gray-400' : 'border-2 border-[#F1F1F2]'}
        `}
    >
        <input 
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onChange={e => setComment(e.target.value)}  // when the input changes we set the comment and then turn in to the value 
        value={comment || ""} // gets the updated comment
        className="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg" 
        type="text"
        placeholder="Add comment..."
        />
    </div>
    {!isUploading ? (
        <button
        disabled={!comment} // if there is no comment then the button will disabled
        onClick={() => addComment()}
        className={`
        font-semibold text-sm ml-5 pr-1
        ${comment ? 'text-[#F02C56] cursor-pointer' : 'text-gray-400'}
        `}
        >
        Post
        </button>
    ) : (
        <BiLoaderCircle className="animate-spin" color="#E91E62" size="20" />
    )}
    </div>
    </>
  )
}

export default Comments