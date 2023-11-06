'use client';

import { HashLoader, PuffLoader } from "react-spinners";

const Loader = () => {
  return ( 
    <div
    className="
      h-[80vh]
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <HashLoader
        size={100}
        color="#d6366a"
      />
    </div>
   );
}
 
export default Loader;