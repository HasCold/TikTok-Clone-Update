// We use this component as a wrapper component around other things that might get error if we get a hydration mismatch
'use client'

import React, { useEffect, useState } from 'react'

const ClientOnly = (
{children} : {children: React.ReactNode}
) => {
    
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

  return (
    <>
    {isClient ? <div>{children}</div> : null}
    </>
  )
}

export default ClientOnly