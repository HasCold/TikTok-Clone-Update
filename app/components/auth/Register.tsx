import React,{useState} from 'react'
import { useRouter } from 'next/navigation';
import { BiLoaderCircle } from 'react-icons/bi';
import TextInput from '../TextInput';
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

const Register = () => {
  
const contextUser = useUser();    
const router = useRouter();
const {setLoggedUser, setToken, setIsLoginOpen} = useGeneralStore();
    
const [loading, setLoading] = useState<boolean>(false);
const [name, setName] = useState<string | ''>('');
const [email, setEmail] = useState<string | ''>('');
const [password, setPassword] = useState<string | ''>('');
const [confirmPassword, setConfirmPassword] = useState<string | ''>('');
const [error, setError] = useState<ShowErrorObject | null>(null)
const [icon, setIcon] = useState(eyeOff);
const [type, setType] = useState<string>('password');
const [confirmType, setConfirmType] = useState<string>('password');
const [confirmIcon, setConfirmIcon] = useState(eyeOff);

const handleTogglePassword = () => {
    if(type === 'password'){
        setType("text");
        setIcon(eye)
    }else{
        setType("password");
        setIcon(eyeOff);
    }
}

const handleToggleConfirmPassword = () => {
    if(confirmType === 'password'){
        setConfirmType("text");
        setConfirmIcon(eye)
    }else{
        setConfirmType("password");
        setConfirmIcon(eyeOff);
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

    const regExp =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!name) {
        setError({ type: 'name', message: 'A Name is required'})
        isError = true
    } else if (!email) {
        setError({ type: 'email', message: 'An Email is required'})
        isError = true
    } else if (!regExp.test(email)) {
        setError({ type: 'email', message: 'The Email is not valid'})
        isError = true
    } else if (!password) {
        setError({ type: 'password', message: 'A Password is required'})
        isError = true
    // } else if (password.length < 10) {
    //     setError({ type: 'password', message: 'The Password needs to be longer'})
    //     isError = true
    } 
    else if (password != confirmPassword) {
    setError({ type: 'password', message: 'The Passwords do not match'})
        isError = true
    }
    return isError;

}

const submitHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    let isError = validate();
    let flag = false;

    if(isError) return;
    if(!contextUser) return;

    try {
        setLoading(true);

        if(!flag){
            flag = true;
            const res = await fetch(`/api/auth/register`, {
                method: "POST",
                body: JSON.stringify({
                    name, email, password, confirmPassword 
                }),
                headers : {
                    "Content-type" : "application/json",
                }
            });
            
            const data = await res.json();
            const {_id, image} = data;
            setLoggedUser({_id, image, name});
        
            setToken(data.token);  
            localStorage.setItem("userInfo", JSON.stringify(data.token));
            
            if(!data.success) return toast.error(data.message);
            // const loggedData = contextUser.loggedUser ?? {_id: "", name: "", image: ""}
            await contextUser.profile(_id, name, image);
            
            toast.success(data.message);

            flag = false;
        }

        // router.refresh();
        setLoading(false); 
        setIsLoginOpen(false);
        
        window.location.reload();
    } catch (error: any) {
        setLoading(false);
        return toast.error(error);
    }

}

  return (
    <>
    <div>
     <h1 className="text-center text-[28px] mb-4 font-bold">Register</h1>
     <div className="px-6 pb-2">
          <TextInput 
              string={name}
              placeholder="Name"
              onUpdate={setName}
              inputType="text"
              error={showError('name')}
          />
      </div>
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
      <div className="flex px-6 pb-2">
          <TextInput 
              string={confirmPassword}
              placeholder="Confirm Password"
              onUpdate={setConfirmPassword}
              inputType={confirmType}
              error={showError('confirmPassword')}
          />
           <button className='cursor-pointer ml-2' onClick={handleToggleConfirmPassword}>
            <Icon icon={confirmIcon} size={25}/>
          </button>
      </div>
 
      <div className="px-6 pb-2 mt-6">
     <button 
         disabled={loading}
         onClick={submitHandler} 
         className={`
             flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm
             ${(!name || !email || !password || !confirmPassword) ? 'bg-gray-400 text-white-500' : 'bg-[#F02C56]'}
         `}
     >
         {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Sign in'}
     </button>
     </div>
 
     </div>
     </>
  )
}

export default Register