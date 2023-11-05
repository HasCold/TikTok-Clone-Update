
const useDeleteLike = async (likeId: string, token: string | null) => {
  
  try {

    const res = await fetch("/api/like/deleteLike", {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({likeId})
    });

    const data = await res.json();
  } catch (error) {
    console.log(error);
    throw error
  }
}

export default useDeleteLike;