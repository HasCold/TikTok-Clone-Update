import { CommentWithProfile, Like } from "../types";
import useDeleteComment from "./useDeleteComment";
import useDeleteLike from "./useDeleteLike";
import useGetCommentByPostId from "./useGetCommentByPostId";
import useGetLikesByPostId from "./useGetLikesByPostId";

const useDeletePostById = async (postId: string, fileName: string | undefined, token: string | null) => {

    try {

        const likes: Like[] = await useGetLikesByPostId(postId, token);  // Delete all the likes from this post id 
        likes.forEach(async like => await useDeleteLike(like?._id, token));

        const comments: CommentWithProfile[] = await useGetCommentByPostId(postId, token);  // Delete comments from this postId
        comments.forEach(async comment => await useDeleteComment(comment._id, token));

        const res = await fetch(`/api/post/deletePostById?postId=${postId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({fileName})
        });

        const data = await res.json();

    } catch (error: any) {
        console.error(error);
        throw new error;
    }
}

export default useDeletePostById;