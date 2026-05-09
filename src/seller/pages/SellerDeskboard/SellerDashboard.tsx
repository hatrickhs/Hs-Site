import React from 'react'
import SellerDrawerList from '../../Componants/SellerDrawerList/SellerDrawerList'
import SellerRouts from '../../../Routes/SellerRouts'

const SellerDashboard = () => {

    const toggleDrawer =() => {}
    return (
        <div>
            <div className='lg:flex lg:h-[90vh]'>

                <section className='hidden lg:block h-full'>
                    <SellerDrawerList toggleDrawer={toggleDrawer}/>
                </section>
                <section className='p-10 w-full lg:w-[80%] overflow-y-auto'>
                    <SellerRouts/>
                </section>

            </div>

        </div>
    )
}

export default SellerDashboard