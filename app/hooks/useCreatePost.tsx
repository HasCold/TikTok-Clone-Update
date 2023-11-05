
const useCreatePost = async (file: File, profileId: string | undefined, caption: string, token: string | null) => {
    
    try {

        const formData = new FormData();
        formData.append("video", file);
        formData.append("Caption", caption);

        if(!token) throw new Error("You are not authenticated");
        if(!profileId) throw new Error("userId is missing");

        const res = await fetch(`/api/post/${profileId}/videoUpload`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();        

    } catch (error) {
        console.warn(error);
        throw error;
    }
}

export default useCreatePost