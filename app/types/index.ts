export type User = {
    _id?: string;  // Profile Model id
    user_id?: string;  // User Model id
    name?: string;
    bio?: string;
    image?: string;
}

export type Profile = User 

export type LoggedUser = {
    _id?: string | null;
    name: string | null;
    image: string | null;
}

export interface UserContextTypes {
    profile: (_id: string, name: string, image: string | undefined) => Promise<void>; 
    logout: () => void;
    login: (email: string, password: string) => void;
    checkUser: () => Promise<void>
}

export type RandomUsers = Omit<Profile, "bio">

export interface Post {
    _id?: string | undefined;
    profile_id?: string | undefined;
    originalName?: string | undefined;
    fileName?: string | undefined;
    text?: string | undefined;
    createdAt?: string | undefined;
}

export type PostWithProfile = Omit<Post, "profile_id"> & {
    profile_id: {
        _id: string
        user_id: string;
        name: string;
        image: string;
    }
}

export interface Like {
    _id: string;
    profile_id: string;
    post_id: string;
    likedUser: boolean;
  }

export type CommentWithProfile = {
    _id: string;
    post_id: string;
    profile_id: {
        _id: string;
        user_id: string;
        name: string;
        image: string;
    };
    comment: string;
    createdAt: string;
} 

export type Image = Pick<Post, "_id" | "fileName">