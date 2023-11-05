
const useGetCommentByPostId = async (postId: string | undefined, token: string | null) => {
  
  try {
    
    const res = await fetch(`/api/comment/getComment/${postId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data.getPostById;

  } catch (error: any) {
    console.warn(error);
    throw new Error(error)
  }
}

export default useGetCommentByPostId;