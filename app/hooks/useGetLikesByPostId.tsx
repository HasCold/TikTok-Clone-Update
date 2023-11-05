
const useGetLikesByPostId = async (postId: string | undefined, token: string | null) => {

  try {

    const res = await fetch("/api/like/getLikesByPost?postId="+postId, {
       method: "GET",
       headers: {
        "Authorization": `Bearer ${token}`
       }
    });

    const data = await res.json();
    return data.getLikesByPost;
    
  } catch (error: any) {
    console.warn(error);
    throw error;
  }
}

export default useGetLikesByPostId;