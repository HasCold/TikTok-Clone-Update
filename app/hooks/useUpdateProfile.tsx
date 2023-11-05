
const useUpdateProfile = async(_id: string, name: string, bio: string, token: string | null) => {

  try {

    if (!token || !_id) {
        // Handle the case where token or loggedUser._id is missing
        throw new Error("Token or _id is missing");
    }else if(!name || !bio){
        throw new Error("Please fill the name and bio field");
    }
    
    const res = await fetch(`/api/profile/${_id}/updateProfile`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({name, bio})
    });

    const data = await res.json();
    
  } catch (error) {
    console.warn(error);
    throw error
  }
}

export default useUpdateProfile