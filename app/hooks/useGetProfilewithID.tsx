
const getProfilewithID = async (profileId: string | undefined, token: string | null) => {

    try {

        const res = await fetch(`/api/profile/getProfileInfo?profileId=${profileId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` 
            },  // In GET request method req.body should not included.
        });

        const data = await res.json();
        return data.getProfile;

    } catch (error: any) {
        console.warn(error);
        throw error;
    }
}

export default getProfilewithID;