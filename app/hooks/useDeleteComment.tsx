
const useDeleteComment = async (commentId: string, token: string | null) => {

  try {
    
    const res = await fetch("/api/comment/deleteComment", {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({commentId})
    })

    const data = await res.json();

  } catch (error: any) {
    console.warn(error);
    throw new error
  }
}

export default useDeleteComment