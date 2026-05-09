import React from 'react'
import ProfileFieldCard from '../../../componant/ProfileFieldCard'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import store, { useAppSelector } from '../../../State/Store'

const UserDetails = () => {
  const {auth} =useAppSelector(store=> store);
  const seller = useAppSelector(state => state.seller);

  const profile = auth.user || seller.profile;
  
  return (
    <div className='flex justify-center py-10'>
        <div className='w-full lg:w-[70%]'>
            <div className='flex items-center pb-3 justify-between'>
                <h1 className='text-2xl font-bold text-gray-600'>Personal Details</h1>

            </div>
<div className=''>
    <ProfileFieldCard keys='Name' value={profile?.fullName || profile?.sellerName || ""}/>
    <Divider/>
    <ProfileFieldCard keys='Email' value={profile?.email || ""}/>
    <Divider/>
   <ProfileFieldCard keys='Mobile' value={profile?.mobile || ""} />


</div>
        </div>

    </div>
  )
}

export default UserDetails