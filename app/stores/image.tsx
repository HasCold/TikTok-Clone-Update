import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface ImageStore {
    currentImage: null;
}

export const useImageStore = create<ImageStore>()(
    devtools(
        persist(
            (set) => ({
                currentImage: null,

                setCurrentImage: async (profileId: string) => {
                    const result = await getUserImage(profileId);
                    set({currentImage: result})
                }
            }),
            {
                name: "store",
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)