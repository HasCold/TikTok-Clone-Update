import {create} from "zustand";
import {persist, devtools, createJSONStorage} from "zustand/middleware";
import { Profile } from "../types";
import getProfilewithID from "../hooks/useGetProfilewithID";

interface ProfileStore{
    currentProfile: Profile | null;
    setCurrentProfile: (userId: string | undefined, token: string | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
    devtools(
        persist(
            (set) => ({
                currentProfile: null,

                setCurrentProfile: async (userId: string | undefined, token) => {
                    const result = await getProfilewithID(userId, token);
                    set({currentProfile: result}) 
                },

            }),
            {
                name: "store",
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)