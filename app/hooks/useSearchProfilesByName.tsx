
const useSearchProfilesByName = async (name: string, token: string | null) => {

  try {

    const res = await fetch(`/api/profile/searchNames?search=${name}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    return data.getSearchNames
    
  } catch (error) {
    console.warn(error);
    throw error
  }
}

export default useSearchProfilesByName;