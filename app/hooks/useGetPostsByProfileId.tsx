
const useGetPostsByProfileId = async (profileId: string, token: string | null) => {

    try {

        const res = await fetch(`api/post/${profileId}/getVideos`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }, 
        });

        const data = await res.json();
        
        return data.data;
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

export default useGetPostsByProfileId;