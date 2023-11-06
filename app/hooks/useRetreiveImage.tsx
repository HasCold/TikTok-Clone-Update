
const useRetreiveImage = async (profileId: string | undefined, token: string | null) => {
  try {
    if(!profileId || !token) return new Error("Id or token is missing");

    const res = await fetch(`/api/uploads/getImage/${profileId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();
    return data.imageData;

  } catch (error) {
    console.warn(error);
    throw error;
  }
}

export default useRetreiveImage