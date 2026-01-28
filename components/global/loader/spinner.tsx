import React from 'react'

type Props = {
    color?: string
}

const Spinner = ({color}: Props) => {
  return (
    <div role='status'>
        <svg 
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg">
         {/* <!-- The path attribute 'd' defines a circle using arc commands (M, a) --> */}
            <path 
                d="M 50,50 m 0,-45 a 45,45 0 1,1 0,90 a 45,45 0 1,1 0,-90"
                fill={color || '#ffff'}
            />
        
        </svg>
    </div>
  )
}

export default Spinner