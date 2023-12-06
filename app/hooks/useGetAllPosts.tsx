
const useGetAllPosts = async (page: number) => {
    try {
        const res = await fetch(`/api/post/getAllPosts?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

export default useGetAllPosts;