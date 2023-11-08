
const useGetUserLikedPost = async (profileId: string, token: string | null) => {
  try {
        if(!token) return new Error("You are not authenticated");

        const res = await fetch(`/api/like/userLikedPost/${profileId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }) 

        const data = await res.json();
        return data.userLikePost;

  } catch (error) {
    console.warn(error);
    throw error
  }
}

export default useGetUserLikedPost;