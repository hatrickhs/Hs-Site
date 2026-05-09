
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/Pages/Sellers/SellersTable'
import Coupon from '../admin/Pages/Coupon/Coupon'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import GridTable from '../admin/Pages/HomePage/GridTable'
import ElectronicTable from '../admin/Pages/HomePage/ElectronicTable'
import ShopByCategoryTable from '../admin/Pages/HomePage/ShopByCategoryTable'
import Deal from '../admin/Pages/HomePage/Deal'
import AdminAccount from '../admin/AdminAccount'
import AddCategoryModal from '../admin/Pages/HomePage/AddCategoryModal'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>

             <Route path='/' element={<SellersTable/>}/> 
             <Route path='/coupon' element={<Coupon/>}/> 
             <Route path='/add-coupon' element={<AddNewCouponForm/>}/> 
             <Route path='/home-grid' element={<GridTable/>}/> 
             <Route path='/electronics-category' element={<ElectronicTable/>}/> 
             <Route path='/shop-by-category' element={<ShopByCategoryTable/>}/> 
             <Route path='/deals' element={<Deal/>}/> 
             <Route path='/account' element={<AdminAccount/>}/>
             <Route path='/add-category' element={<AddCategoryModal/>}/>

        </Routes>
    </div>
  )
}

export default AdminRoutes