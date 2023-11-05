import React, {useState} from 'react'
import TextInput from '../TextInput';
import { BiLoaderCircle } from 'react-icons/bi';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import { useUser } from '@/app/context/user';
import toast from 'react-hot-toast';
import { useGeneralStore } from '@/app/stores/general';


interface ShowErrorObject {
    type: string;
    message: string;
}

const Login = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string | ''>('');
    const [password, setPassword] = useState<string | ''>('');
    const [error, setError] = useState<ShowErrorObject | null>(null)
    const [icon, setIcon] = useState(eyeOff);
    const [type, setType] = useState<string>('password');

    const contextUser = useUser();
    const {setIsLoginOpen} = useGeneralStore();

    const handleTogglePassword = () => {
        if(type === 'password'){
            setType("text");
            setIcon(eye)
        }else{
            setType("password");
            setIcon(eyeOff);
        }
    }
    
    const showError = (type: string) => {
        if(error && Object.entries(error).length > 0 && error?.type === type){
            return error.message;
        }
    }

    const validate = () => {
        setError(null);
    let isError: boolean = false;

    if (!email) {
        setError({ type: 'email', message: 'An Email is required'})
        isError = true
    } else if (!password) {
        setError({ type: 'password', message: 'A Password is required'})
        isError = true
    }
    return isError;

    }

    const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        let isError = validate();
        if(isError) return;
        if(!contextUser) return;

        try {
            setLoading(true);
            await contextUser.login(email, password);
            setLoading(false);
            setIsLoginOpen(false);
        } catch (error: any) {
            setLoading(false);
            return toast.error(error);
        }
    }

 return (
    <>
   <div>
    <h1 className="text-center text-[28px] mb-4 font-bold">Log in</h1>
    <div className="px-6 pb-2">
         <TextInput 
             string={email}
             placeholder="Email Address"
             onUpdate={setEmail}
             inputType="email"
             error={showError('email')}
         />
     </div>
     <div className="flex px-6 pb-2">
         <TextInput 
             string={password}
             placeholder="Password"
             onUpdate={setPassword}
             inputType={type}
             error={showError('password')}
         />
        <button className='cursor-pointer ml-2' onClick={handleTogglePassword}>
            <Icon icon={icon} size={25}/>
        </button>

     </div>

     <div className="px-6 pb-2 mt-6">
    <button 
        disabled={loading}
        onClick={(e) => login(e)} 
        className={`
            flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm
            ${(!email || !password) ? 'bg-gray-400 text-white-500' : 'bg-[#F02C56]'}
        `}
    >
        {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Log in'}
    </button>
    </div>

    </div>
    </>
  )
}

export default Login