import {create} from "zustand";
import {persist, devtools, createJSONStorage} from "zustand/middleware";
import { LoggedUser, RandomUsers} from "../types";
import useGetRandomUsers from "../hooks/useGetRandomUsers";
import { User } from '../types/index';

interface GeneralStore{
    isLoginOpen: boolean,
    isEditProfileOpen: boolean,
    randomUsers: RandomUsers[],
    user: User | null ,
    loggedUser: LoggedUser | null,
    token: string | null,
    isForgetPassword: boolean,
    setIsForgetPassword: (val: boolean) => void,
    setUser: (val: User | null) => void,
    setIsLoginOpen: (val: boolean) => void,
    setIsEditProfileOpen: (val: boolean) => void,
    setRandomUsers: (val: string | null) => void,
    setLoggedUser: (val: LoggedUser | null) => void,
    setToken: (val: string | null) => void,
}

export const useGeneralStore = create<GeneralStore>()(
    devtools(
        persist(
            (set) => ({
                isLoginOpen: false,
                isEditProfileOpen: false,
                randomUsers: [],
                user: null,
                loggedUser: null,
                token: null,
                isForgetPassword: false,

                setIsForgetPassword: (val: boolean) => set({isForgetPassword: val}),
                setIsLoginOpen: (val: boolean) => set({isLoginOpen: val}),
                setIsEditProfileOpen: (val: boolean) => set({isEditProfileOpen: val}),
                setRandomUsers: async (val: string | null) => {
                    const result = await useGetRandomUsers(val)
                    set({randomUsers: result}) 
                },
                setUser: async (val: User | null) => {
                    const actualVal = await val;
                    set({user: actualVal});
                }, 
                setLoggedUser: async (val: LoggedUser | null) => {
                    const actualVal = await val
                    set({loggedUser: actualVal})
                },
                setToken: (val: string | null) => set({token: val})
            }),
            {
                name: "store",
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)