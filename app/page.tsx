'use client'

import MainLayout from "./layouts/MainLayout";
import ClientOnly from "./components/ClientOnly";
import { usePostStore } from "./stores/post";
import { useEffect, useMemo } from "react";
import PostMain from "./components/PostMain";

export default function Home() {
  let {allPosts, setAllPosts, setPostsByUser, postsByUser} = usePostStore();
  
  useEffect(() => {
    setAllPosts()
  }, []);

  const MemoizedPostMainComponents = useMemo(() => {
    return allPosts.map((post, index) => (
      <PostMain post={post} key={index} />
    ));
  }, [allPosts, setPostsByUser]);

  return (
    <>
    <MainLayout>
    <div className="mt-[80px] w-[calc(100%-90px)] max-w-[690px] ml-auto"> 
      <ClientOnly>
        {/* {allPosts.map((post, index) => (
        <PostMain post={post} key={index}/>
        ))} */}
        {MemoizedPostMainComponents}
      </ClientOnly>
    </div>
    </MainLayout>
    </>
  )
}
