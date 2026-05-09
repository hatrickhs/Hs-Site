import React, { useState } from 'react'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
const navigate = useNavigate();

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='relative w-full max-w-md rounded-xl shadow-lg overflow-hidden'>
  
  <img 
    className="w-full" 
    src="https://as1.ftcdn.net/jpg/03/50/08/88/1000_F_350088816_Tij0DA1LnXPXT1kFc5PsZrCeQOCyIlSb.jpg" 
    alt="HS STORE" 
  />

 
  <h1 className='absolute top-7 left-1/2 transform -translate-x-1/2 text-black font-bold text-1xl right-1/8'>
    HS STORE
  </h1>



        <div className='mt-8 px-10 p-8'>
         {isLogin ? <LoginForm from={location.state?.from || "/"} /> : <RegisterForm />}

          <div className='flex items-center gap-1 justify-center mt-5'>
            <p>{isLogin && "Don't"} have Account</p>
            <Button size='small' onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Create Account" : "login"}</Button>

          </div>
        </div>

      </div>

    </div>
  )
}

export default Auth