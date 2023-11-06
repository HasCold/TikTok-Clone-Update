'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BiLoaderCircle, BiSolidCloudUpload } from 'react-icons/bi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { PiKnifeLight } from 'react-icons/pi';
import { useUser } from '../context/user';
import { useGeneralStore } from '../stores/general';
import useCreatePost from '../hooks/useCreatePost';
import { useProfileStore } from '../stores/profile';
import UploadLayout from '../layouts/UploadLayout';

interface UploadError {
    type: string,
    message: string,
  }
  
  const page = () => {
    
    const router = useRouter();
    const contextUser = useUser();

    let {user, token} = useGeneralStore();
    let {currentProfile} = useProfileStore();
    let [fileDisplay, setFileDisplay] = useState<string>('');
    let [caption, setCaption] = useState<string>('');
    let [file, setFile] = useState<File | null>(null);
    let [error, setError] = useState<UploadError | null>(null);
    let [isUploading, setIsUploading] = useState<boolean>(false);
 
  useEffect(() => {
    if(!user) router.push('/');
  }, [contextUser]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.files);  

      const files = e.target.files;

      if(files && files.length){
        const file = files[0];
        const fileUrl = URL.createObjectURL(file);  // Convert the file into readable URL so that we can pass it into the video tag src

        setFileDisplay(fileUrl);  // We can read it in the file Display
        setFile(file);  // Save the file 
      }
    }

    const clearVideo = () => {
      setFileDisplay("");
      setFile(null);
    }

    const discard = () => {
      setFileDisplay("");
      setFile(null);
      setCaption("")
    }

    const validate = () => {
      setError(null);
      let isError = false;

      if(!file){
        setError({type: "File", message: "A video is required"})
        isError = true;
      }else if(!caption){
        setError({type: "caption", message: "A caption is required"})
        isError = true;
      }
      return isError
    }

    const createNewPost = async () => {
      let isError = validate();
      if(isError) return
      if(!file || !user) return
      setIsUploading(true);
    
      try {
          await useCreatePost(file, currentProfile?._id, caption, token);
          router.push(`/profile/${currentProfile?._id}`)
          setIsUploading(false);
      } catch (error) {
        console.warn(error);
        setIsUploading(false);
        alert(error);
      }
    
    }

    return (
    <>
    <UploadLayout>
      <div className="w-full mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 md:px-10 px-4">
        <div>
          <h1 className='text-[23px] font-semibold'>Upload video</h1>
          <h2 className='text-gray-400 mt-1'>Post a video to your account</h2>
        </div>

        <div className='mt-8 md:flex gap-6'>
          {!fileDisplay ? (
              <label
              htmlFor="fileInput"
              className='
              md:mx-0
              mx-auto
              mt-4
              mb-6
              flex 
              flex-col 
              items-center 
              justify-center 
              w-full 
              max-w-[260px] 
              h-[470px] 
              text-center 
              p-3 
              border-2 
              border-dashed 
              border-gray-300 
              rounded-lg 
              hover:bg-gray-100 
              cursor-pointer
              '
              >
              <BiSolidCloudUpload />
              <p className="mt-4 text-[17px]">Select video to upload</p>
              <p className="mt-1.5 text-gray-500 text-[13px]">Or drag and drop a file</p>
              <p className="mt-12 text-gray-400 text-sm">MP4</p>
              <p className="mt-2 text-gray-400 text-[13px]">Up to 30 minutes</p>
              <p className="mt-2 text-gray-400 text-[13px]">Less than 2 GB</p>
              
              <label
              htmlFor="fileInput"
              className="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#F02C56] rounded-sm cursor-pointer"
              >
                Select File
              </label>

              <input 
              type="file"
              id='fileInput'
              onChange={onChange}
              hidden
              accept='.mp4, .webm, .mkv, .avi'
              />

              </label>
          ) : (
              <div 
              className="
              md:mx-0
              mx-auto
              mt-4
              md:mb-12
              mb-16
              flex 
              items-center 
              justify-center 
              w-full 
              max-w-[260px] 
              h-[540px] 
              p-3 
              rounded-2xl
              cursor-pointer
              relative
              "
              >
                {isUploading ? (
                  <div className="absolute flex items-center justify-center z-20 bg-black h-full w-full rounded-[50px] bg-opacity-50">
                    <div className='mx-auto flex items-center justify-center gap-1'>
                    <BiLoaderCircle className="animate-spin" color="#F12B56" size={30} />
                    <div className='text-white font-bold'>Uploading...</div>
                    </div>
                  </div>
                ) : (
                  null)}

              <img className='absolute z-20 pointer-events-none' src="/images/mobile-case.png" />
              
              <img className='absolute right-4 bottom-6 z-20' width="90" src="/images/tiktok-logo-white.png"  />
              
              <video // These self closing tags are the tags where the opening and closing tags are combined into a single tag. They are used for elements that don't contain any content or child elements. 
              autoPlay
              loop
              muted
              className='absolute rounded-xl object-cover z-10 p-[13px] w-full h-full'
              src={fileDisplay}  // file URL 
              />

              <div className="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray-300">
                  <div className='flex items-center truncate'>
                  <AiOutlineCheckCircle size="16" className="min-w-[16px]" />
                  <p className='text-[11px] pl-1 truncate text-ellipsis'>
                  {file ? file.name : ""}
                  </p>
                  </div>

                  <button onClick={() => clearVideo()} className='text-[11px] ml-2 font-bold'>
                    Change
                  </button>
              </div>

              </div>
          )}

            <div className="mt-4 mb-6">
              <div className="flex bg-[#F8F8F8] py-4 px-6">
                  <div>
                      <PiKnifeLight className="mr-4" size="20"/>
                  </div>

                  <div className="text-semibold text-[15px] mb-1.5">Divide videos and edit</div>
                  <div className="text-semibold text-[13px] text-gray-400">
                  You can quickly divide videos into multiple parts, remove redundant parts and turn landscape videos into portrait videos
                  </div>


                <div className="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
                    <button className="px-8 py-1.5 text-white text-[15px] bg-[#F02C56] rounded-sm">
                        Edit
                    </button>
                </div>                  
                </div>

                <div className='mt-5'>
                  <div className='flex items-center justify-between'>
                    <div className='mb-1 text-[15px]'>Captions</div>
                    <div className='text-gray-400 text-[12]'>{caption.length}/150</div>
                  </div>
                  <input 
                  maxLength={150}
                  type="text"
                  className='
                  w-full
                  border-2
                  p-2.5
                  rounded-md
                  focus:outline-none
                  focus:bg-gray-200
                  '
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div className='flex gap-3'>
                  <button
                  disabled={isUploading}
                  onClick={() => discard()}
                  className="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm"
                  >
                    Discard
                  </button>

                  <button
                  disabled={isUploading}
                  onClick={() => createNewPost()}
                  className="px-10 py-2.5 mt-8 border text-[16px] text-white bg-[#F02C56] rounded-sm"
                  >
                  {isUploading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : "Post"}
                  </button>
                </div>
              
              {error ? (
                <div className='text-red-600 mt-4'>
                  {error.message}
                </div>
              ) : (
                null
              )}
            
            </div>
        </div>
      </div>
    </UploadLayout>
    </>
  )
}

export default page