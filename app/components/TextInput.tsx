import React from 'react'

interface TextInputProps {
    string: string;
    placeholder: string;
    onUpdate: (newValue: string) => void;
    inputType: string;
    error: string | undefined;
}

const TextInput: React.FC<TextInputProps> = ({
    string,
    placeholder,
    onUpdate,
    inputType,
    error,
}) => {
  return (
    <>
        <input 
        placeholder={placeholder}
        type={inputType}
        value={string || ''}
        className="
        block
        w-full
        bg-[#F1F1F2]
        text-gray-800
        border
        border-gray-300
        rounded-md
        py-2.5
        px-3
        focus:outline-none
        "
        onChange={(e) => onUpdate(e.target.value)}
        autoComplete="off"
        />

        <div className='text-red-500 text-[14px] font-semibold'>
        {error ? (error) : null}
        </div>
    </>
  )
}

export default TextInput