
const useCreateLike = async (profileId: string, postId: string | undefined, token: string | null) => {

  try {

    const res = await fetch(`/api/like/createLike/${profileId}?postId=${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    const data = await res.json();

  } catch (error: any) {
    console.log(error);
    throw new error;
  }
}

export default useCreateLike;