
const useGetPostById = async (id: string, token: string | null) => {

  try {

    const res = await fetch(`/api/post/getPostById?postId=${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json();
    return data.singlePost;

  } catch (error) {
    console.warn(error);
    throw error;
  }
}

export default useGetPostById