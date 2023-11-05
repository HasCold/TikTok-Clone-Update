
const useCreateComment = async (profileId: string | undefined, postId: string, comment: string, token: string | null) => {
    
    try {

        const res = await fetch(`/api/comment/createComment/${profileId}?posId=`+ postId, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({comment})
        });

        const data = await res.json();        

    } catch (error) {
        console.warn(error);
        throw error;
    }
}

export default useCreateComment;