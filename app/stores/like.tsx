import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Like, userLikedPost } from '../types';
import useGetLikesByPostId from '../hooks/useGetLikesByPostId';
import useGetUserLikedPost from '../hooks/useGetUserLikedPost';
// import useGetLikesByPostId from '../hooks/useGetLikesByPostId';
  
interface LikeStore {
    likesByPost: Like[];
    userLikedPost: userLikedPost | undefined;
    setUserLikedPost: (profileId: string, token: string | null) => void;
    setLikesByPost: (postId: string, token: string | null) => void;
}

export const useLikeStore = create<LikeStore>()( 
    devtools(
        persist(
            (set) => ({
                likesByPost: [],
                userLikedPost: undefined,

                setLikesByPost: async (postId: string, token) => {
                    const result = await useGetLikesByPostId(postId, token)
                    set({ likesByPost: result });
                },
                setUserLikedPost: async (profileId, token) => {
                    const result = await useGetUserLikedPost(profileId, token);
                    set({userLikedPost: result})
                }
            }),
            { 
                name: 'store', 
                storage: createJSONStorage(() => localStorage) 
            }
        )
    )
)