import { LoggedUser, User } from "../types";

interface getUserProps {
    tokenRevalidate: string | null,
    loggedUser: LoggedUser | null,
    setUser: (val: User | null) => void,
}

const getUserByID = async ({
    tokenRevalidate, loggedUser, setUser
}: getUserProps): Promise<void> => {

    try {
        if (!tokenRevalidate) {
            // Handle the case where token or loggedUser._id is missing
            throw new Error("Token is missing");
        } if(!loggedUser){
            throw new Error("Logged userId is missing");
        }

        const res = await fetch(`/api/profile/profileInfo?userId=${loggedUser._id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${tokenRevalidate}` 
            },  // In GET request method req.body should not included.
        });

        const data = await res.json();
        const {user_id, image, bio, name, _id} = data.getProfile;
        setUser({user_id, image, bio, name, _id});

    } catch (error: any) {
        setUser(null);
        throw error;
    }
};


export default getUserByID;