import { create } from "zustand";
import { CommentWithProfile} from "../types";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import useGetCommentByPostId from "../hooks/useGetCommentByPostId";


interface CommentStore {
    commentsByPost: CommentWithProfile[];
    setCommentsByPost: (postId: string, token: string | null) => void
}

export const useCommentStore = create<CommentStore>()(
    devtools(
        persist(
            (set) => ({
                commentsByPost: [],

                setCommentsByPost: async (postId: string, token) => {
                    const result = await useGetCommentByPostId(postId, token)
                    set({commentsByPost: result})
                }
            }),
            {
                name: "store",
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)