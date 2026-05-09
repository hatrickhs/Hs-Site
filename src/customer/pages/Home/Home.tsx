import React from 'react'
import ElectricCategory from '../ElectricCategory'
import CategoryGrid from '../CategoryGrid/CategoryGrid'
import Deal from './Deal/Deal'
import ShopByCategory from './ShopByCategory/ShopByCategory'
import { Button } from '@mui/material'
import { Storefront } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'



const Home = () => {

  const navigate = useNavigate();
  
  return (
    <>

      <div className='space-y-5 lg:space-y-10 relative pb-20'>

        <ElectricCategory />
        <CategoryGrid />


        <div className='pt-20'>
        
            <h1 className="text-xl lg:text-3xl font-bold text-center mb-5 text-primary-color">
        TODAY'S DEALS
      </h1>
          <Deal />
        </div>

        <section className='py-25'>
          <h1 className="text-xl lg:text-3xl font-bold text-center mb-10 mt-20 text-primary-color">
            SHOP BY CATEGORY</h1>
          <ShopByCategory />
        </section>

        <section className=' lg:px-20 relative h-[350px] lg-h[450px] object-cover'>
          <img className='w-full h-full' 
          src="https://media.istockphoto.com/id/1349972547/photo/cool-offer-happy-young-lady-sitting-in-armchair-pointing-aside-at-free-space-against-white.jpg?s=612x612&w=0&k=20&c=CcInSOltXIf0E6R3GBJOoctIHHAYVTKLOm_DaK1ZfCk="
            alt="" />
          <div className='absolute top-1/2 left-4 lg:left-[15rem] transform -translate-y-1/2 font-=semibold lg:text-4xl spacy-y-3'>
            <div className='words'>
              <h1> Sell Your Product</h1>
              <p className='text-lg md:text-2xl'>with  <span className='logo'>Hs Store</span></p>

              <div className='pt-6 flex justify-center'>
                <Button onClick={() => navigate("/become-seller")} startIcon={<Storefront />} variant='contained' size='large'>
                  Become Seller
                </Button>
              </div>
            </div>


          </div>
        </section>



      </div>

    </>
  )
}

export default Home