import { Like } from "../types";

const useIsLiked = (profileId: string, postId: string | undefined, likes: Array<Like>) => {

  let res: Like[] = [];

  likes.forEach((like) => {
    if(like.post_id === postId && like.profile_id === profileId) res.push(like);
  });

  if(typeof res === undefined) return
  return res.length > 0;
}

export default useIsLiked;