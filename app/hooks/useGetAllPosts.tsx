
const useGetAllPosts = async () => {
    try {
        const res = await fetch("/api/post/getAllPosts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        return data.multiplePosts;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

export default useGetAllPosts;