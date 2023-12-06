'use client'

import React, { useEffect, useState } from 'react'
import { usePostStore } from '../stores/post';

const Pagination = () => {

    let {allPosts, setAllPosts} = usePostStore();
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number | undefined>(0);

    useEffect(() => {
        setAllPosts(page);
        setPageCount(allPosts?.pagination[0].Pages || 0);
    }, [page])

    const handlePrevBtn = () => {
      setPage(() => {
        if(page === 1) return page;
        return page - 1;
      })
    }
    
    const handleNextBtn = () => {
      setPage(() => {
        if(page === pageCount) return page;
        return page + 1;
      })
    }

  return (
    <>
    { pageCount !== undefined && pageCount > 0 ? ( 

    <div className='flex justify-center items-center py-3'>
    <div className='flex'>
    <button
    onClick={() => handlePrevBtn()}
    className='bg-gray-100 rounded-lg w-[10vw] font-semibold hover:bg-gray-200 border-4 hover:border-pink-600'
    type='button'>
      Prev
    </button>

    {
    // pageCount.toString().split("").map(Number)
      Array(pageCount).fill(null).map((element, index) => {
        return (
          <>
          <button
          onClick={() => setPage(index + 1)}
          className={`${page === index + 1 ? `bg-[#006CFD] text-white` : 'bg-gray-100 text-black hover:bg-gray-200'} rounded-md w-[10vw] font-semibold`}
          >
            {index + 1}
          </button>
          </>
        )
      })
    }

    <button 
    onClick={() => handleNextBtn()}
    className='bg-gray-100 rounded-lg w-[10vw] font-semibold hover:bg-gray-200 border-4 hover:border-pink-600'
    type="button">
      Next
    </button>
      </div>
    </div>
      ) : null
  }
    </>
  )
}

export default Pagination;