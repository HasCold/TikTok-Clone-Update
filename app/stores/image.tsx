import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Image } from "../types";
import useRetreiveImage from "../hooks/useRetreiveImage";

interface ImageStore {
    currentImage: Image | null | undefined;
    setCurrentImage: (profileId: string | undefined, token: string | null) => void
}

export const useImageStore = create<ImageStore>()(
    devtools(
        persist(
            (set) => ({
                currentImage: null,

                setCurrentImage: async (profileId, token) => {
                    const result = await useRetreiveImage(profileId, token);
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