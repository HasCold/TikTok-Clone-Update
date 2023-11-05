import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Post, PostWithProfile } from '../types';
import useGetPostsByProfileId from '../hooks/useGetPostsByProfileId';
import useGetPostById from '../hooks/useGetPostById';
import useGetAllPosts from '../hooks/useGetAllPosts';

interface PostStore {
    allPosts: PostWithProfile[];
    postsByUser?: Post[] | Error ;
    postById: PostWithProfile | null;
    setAllPosts: () => void;
    setPostsByUser: (profileId: string, token: string | null) => void;
    setPostById: (postId: string, token: string | null) => void;
}

export const usePostStore = create<PostStore>()( 
    devtools(
        persist(
            (set) => ({
                allPosts: [],
                postsByUser: [],
                postById: null,

                setAllPosts: async () => {
                    const result = await useGetAllPosts()
                    set({ allPosts: result });
                },
                setPostsByUser: async (profileId: string, token) => {
                    try{
                        const result = await useGetPostsByProfileId(profileId, token)
                        set({ postsByUser: result });
                    }catch(error: any){
                        set({postsByUser: error});
                    }
                },
                setPostById: async (postId: string, token) => {
                    const result = await useGetPostById(postId, token)
                    set({ postById: result })
                },
            }),
            { 
                name: 'store', 
                storage: createJSONStorage(() => localStorage) 
            }
        )
    )
)