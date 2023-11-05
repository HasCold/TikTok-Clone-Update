import { useUser } from '@/app/context/user';
import useDeleteComment from '@/app/hooks/useDeleteComment';
import { useCommentStore } from '@/app/stores/comment';
import { useGeneralStore } from '@/app/stores/general';
import { CommentWithProfile } from '@/app/types';
import moment from 'moment';
import Link from 'next/link';
import React from 'react'
import {useState} from 'react';
import toast from 'react-hot-toast';
import { BiLoaderCircle } from 'react-icons/bi';
import { BsTrash3 } from 'react-icons/bs';

interface SingleCommentProps {
    params: {profileId: string; postId: string;};
    comment: CommentWithProfile;
}

const SingleComment: React.FC<SingleCommentProps> = ({comment, params}) => {
    
    const contextUser = useUser();
    let {setCommentsByPost} = useCommentStore();
    const {user, token} = useGeneralStore();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const deleteThisComment = async () => {
        let res = confirm("Are you sure ! you want to delete this comment"); // window.confirm() instructs the browser to display a dialog with an optional message, and to wait until the user either confirms or cancels the dialog.
        if(!res) return

        try {
            setIsDeleting(true);
            await useDeleteComment(comment?._id, token);
            setCommentsByPost(params?.postId, token);
            setIsDeleting(false);
            toast.success("Comment Deleted !")
        } catch (error) {
            console.warn(error);
            toast.error("Could not delete comment");
        }
    }
  
    return (
    <>
     <div id="SingleComment" className="flex items-center justify-between px-8 mt-4">
        <div className="flex items-center relative w-full">
            <Link href={`/profile/${comment.profile_id._id}`}>
                <img 
                    className="absolute top-0 rounded-full lg:mx-0 mx-auto" 
                    width="40" 
                    src={comment.profile_id.image}
                />
            </Link>
            <div className='ml-14 pt-0.5 w-full'>
                <div className='text-[18px] font-semibold flex items-center justify-between'>
                <span className="flex items-center">
                    {comment?.profile_id?.name} - 
                    <span className="text-[12px] text-gray-600 font-light ml-1">
                        {moment(comment?.createdAt).calendar()}
                    </span>
                </span>

                {user?.user_id === comment.profile_id.user_id ? (
                    <button 
                    disabled={isDeleting}
                    onClick={() => deleteThisComment()}
                    >
                        {isDeleting ? <BiLoaderCircle className="animate-spin" color="#E91E62" size="20"/>
                            : <BsTrash3 className="cursor-pointer" size="25"/>
                        }
                    </button>
                ) : null}
                </div>
                <p className='text-[15px] font-light'>{comment?.comment}</p>
            </div>

        </div>
    </div>
    </>
  )
}

export default SingleComment