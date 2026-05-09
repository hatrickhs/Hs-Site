import React, { useState } from 'react'
import SellerAccountForm from './SellerAccountForm';
import SellerLoginForm from './SellerLoginForm';
import { Button } from '@mui/material';

const BecomeSeller = () => {
    const[isLogin,setIsLogin]=useState(false);

    const handleShowPage=()=>{
        setIsLogin(!isLogin);
    }
  return (
    <div className='grid md:gap-10 grid-cols-3 min-h-screen'>
        <section className='lg:col-span-1 md:col-span-2 col-span-3  p-10 shadow-lg rounded-b-md'>

            {!isLogin?<SellerAccountForm/>:<SellerLoginForm/>}

            <div className='mt-10 space-y-2'>
                <h1 className='text-center text-sm font-medium'>have account</h1>
                <Button onClick={handleShowPage} fullWidth sx={{py:"11px"}} variant='outlined'>
                    {isLogin?"Register":"Login"}
                </Button>

            </div>

        </section>

        <section className='hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center'>

            <div className='lg:w-[70%] px-5 space-y-10'>
                <div className='space-y-2 font-bold text-center'>
                    <p className='text-2xl'>Join the Marketplace Revolution</p>
                    <p className='text-0lg text-primary-color'>Boost your sales today</p>

                </div >
                <div className='relative w-full h-full '>
                <img className='w-full h-full ' src="https://png.pngtree.com/thumb_back/fh260/background/20230625/pngtree-collection-of-t-shirts-in-3d-illustration-image_3669957.jpg" alt="" />
                <p className='absolute top-[50%] left-[70%] text-white px-4 py-1 rounded-md text-sm font-semibold text-[50px] shadow-md'>New</p>
           </div>
            </div>

        </section>

    </div>
  )
}

export default BecomeSeller