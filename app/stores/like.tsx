import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Like } from '../types';
import useGetLikesByPostId from '../hooks/useGetLikesByPostId';
// import useGetLikesByPostId from '../hooks/useGetLikesByPostId';
  
interface LikeStore {
    likesByPost: Like[];
    setLikesByPost: (postId: string, token: string | null) => void;
}

export const useLikeStore = create<LikeStore>()( 
    devtools(
        persist(
            (set) => ({
                likesByPost: [],

                setLikesByPost: async (postId: string, token) => {
                    const result = await useGetLikesByPostId(postId, token)
                    set({ likesByPost: result });
                },
            }),
            { 
                name: 'store', 
                storage: createJSONStorage(() => localStorage) 
            }
        )
    )
)