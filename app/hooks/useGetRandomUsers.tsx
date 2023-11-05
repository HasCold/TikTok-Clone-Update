
const useGetRandomUsers = async (token: string | null) => {

        try {
            const res = await fetch("/api/profile/profileUsers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
        });
            
        const data = await res.json();
        return data;
        } catch (error: any) {
            throw error;
        }
    }
    
export default useGetRandomUsers;