import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Post, PostType, PostWithProfile } from '../types';
import useGetPostsByProfileId from '../hooks/useGetPostsByProfileId';
import useGetPostById from '../hooks/useGetPostById';
import useGetAllPosts from '../hooks/useGetAllPosts';

interface PostStore {
    allPosts: PostWithProfile | null;
    postsByUser?: Post[] | Error ;
    postById: PostType | null;
    setAllPosts: (page: number) => void;
    setPostsByUser: (profileId: string, token: string | null) => void;
    setPostById: (postId: string, token: string | null) => void;
}

export const usePostStore = create<PostStore>()( 
    devtools(
        persist(
            (set) => ({
                allPosts: null,
                postsByUser: [],
                postById: null,

                setAllPosts: async (page) => {
                    const result = await useGetAllPosts(page)
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