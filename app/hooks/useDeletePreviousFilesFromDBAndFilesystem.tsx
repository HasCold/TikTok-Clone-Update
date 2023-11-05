import { Profile } from "../types";


const useDeletePreviousFilesFromDBAndFilesystem = async (imageFileName: string, currentProfile: Profile | null, token: string | null) => {
        
    try {

       const res = await fetch(`/api/uploads/images/allDeleted?userId=${currentProfile?._id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({imageFileName})
       });

       if(!res.ok) throw new Error("File name cannot be found");
       
    } catch (error) {
       console.log(error); 
    }
}

export default useDeletePreviousFilesFromDBAndFilesystem