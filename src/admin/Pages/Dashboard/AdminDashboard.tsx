import React, { useEffect } from 'react'

import AdminRoutes from '../../../Routes/AdminRoutes'
import AdminDrawerList from '../../../componant/AdminDrawerList'
import { useAppDispatch } from '../../../State/Store'
import { fetchHomeCategories } from '../../../State/admin/adminSlice'

const AdminDashboard = () => {
  const toggleDrawer = () => {}
  const dispatch = useAppDispatch();

  useEffect(()=>{
dispatch(fetchHomeCategories())
  },[])

  return (
     <div>
            <div className='lg:flex lg:h-[90vh]'>

                <section className='hidden lg:block h-full'>
                    <AdminDrawerList toggleDrawer={toggleDrawer}/>
                </section>
                <section className='p-10 w-full lg:w-[80%] overflow-y-auto'>
                    <AdminRoutes/>
                </section>

            </div>

        </div>
  )
}

export default AdminDashboard