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
    className={`${page === 1 ? 'opacity-0' : ''} bg-gray-100 rounded-lg xl:w-[6.5vw] lg:w-[8vw] md:w-[6.5vw] sm:w-[5.5vw] font-semibold hover:bg-gray-200 border-4 hover:border-pink-600`}
    type='button'>
      Prev
    </button>

    <div className='mx-0.5'/>
    {
    // pageCount.toString().split("").map(Number)
    // Array.from({length: pageCount}).map((_, index) => (
      
      Array(pageCount).fill(null).map((_, index) => ( 
        <div key={index}>
            <button
            onClick={() => {
              setPage(index + 1)
            }}
            className={`${page === index + 1 ? `bg-[#006CFD] text-white rounded-lg max-[550px]:w-[5.5vw] xl:w-[2.1vw] lg:w-[3.5vw] md:w-[3vw] sm:w-[3vw] h-[5vh] align-middle` : 'align-middle rounded-lg max-[550px]:w-[5.5vw] xl:w-[2.1vw] lg:w-[3.5vw] md:w-[3vw] sm:w-[3vw] bg-gray-100 text-black hover:bg-gray-200'} rounded-md w-[2.1vw] h-[5vh] font-semibold`}
            >
                  {index + 1}
            </button> 
            </div>
        ))    
  }

    <div className='mx-0.5'/>

    <button 
    onClick={() => handleNextBtn()}
    className={`${page === pageCount ? 'opacity-0' : ''} bg-gray-100 rounded-lg xl:w-[6.5vw] lg:w-[8vw] md:w-[6.5vw] sm:w-[5.5vw] font-semibold hover:bg-gray-200 border-4 hover:border-pink-600`}
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