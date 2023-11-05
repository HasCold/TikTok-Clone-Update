
const useUpdateProfileImage = async (id: string, newImageURL: string | undefined | Error, token: string | null) => {
  
  try {

    const res = await fetch(`/api/profile/${id}/updateImage`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({newImageURL})
    });

    const data = res.json();

  } catch (error: any) {
    console.error(error);
    throw new error;    
  }
}

export default useUpdateProfileImage;