
const useDeleteLike = async (likeId: string | undefined, token: string | null) => {
  
  try {

    const res = await fetch("/api/like/deleteLike?likeId="+likeId, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    const data = await res.json();
  } catch (error) {
    console.log(error);
    throw error
  }
}

export default useDeleteLike;