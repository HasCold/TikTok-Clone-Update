
const useDeleteComment = async (commentId: string, token: string | null) => {

  try {
    
    const res = await fetch(`/api/comment/deleteComment?commentId=${commentId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }); // The DELETE method typically does not include a request body. Instead, the resource to delete is specified in the URL. 

    const data = await res.json();

  } catch (error: any) {
    console.warn(error);
    throw new error
  }
}

export default useDeleteComment