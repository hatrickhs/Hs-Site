import React, { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

import Navbar from './customer/componants/Navbar';
import customeTheme from './Theme/customeTheme';

import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/Product';
import Review from './customer/pages/Review/Review';
import Cart from './customer/pages/Cart/Cart';
import CheckOut from './customer/pages/CheckOut/CheckOut';
import Account from './customer/pages/Account/Account';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDeskboard/SellerDashboard';
import AdminDashboard from './admin/Pages/Dashboard/AdminDashboard';
import Auth from './customer/pages/Auth/Auth';
import PaymentSuccess from './customer/pages/PaymentSuccess';
import OrderDetails from './customer/pages/Account/OrderDetails';

import store, { useAppDispatch, useAppSelector } from './State/Store';
import { fetchUserProfile, logout } from './State/seller/AuthSlice';
import Wishlist from './customer/WishList/Wishlist';
import { fetchSellerProfile } from './State/seller/sellerSlice';
import { createHomeCategory } from './State/customer/customerSlice';
import WriteReviewModal from './customer/pages/Review/WriteReviewModal';
import ProductDetails from './customer/pages/PageDetails/ProductDetails';
import SearchPage from './customer/componants/SearchPage';
import ProtectedRoute from "./Routes/ProductRoutes";
import InactivityModal from './customer/pages/Auth/InactivityModal';
import DealTable from './admin/Pages/HomePage/DealTable';
import CreateDealForm from './admin/Pages/HomePage/CreateDealForm';
import Deal from './customer/pages/Home/Deal/Deal';
import DealDetails from './customer/pages/PageDetails/DealDetails';



function App() {
  const dispatch = useAppDispatch();
  const seller = useAppSelector(state => state.seller);
  const auth = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation()
  const { orderId } = useParams();


  const [modalOpen, setModalOpen] = useState(false);
  let inactivityTimer: NodeJS.Timeout;
  let modalTimer: NodeJS.Timeout;

  const INACTIVITY_LIMIT = 15 * 60 * 1000;
  const MODAL_RESPONSE_LIMIT = 10 * 60 * 1000;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(modalTimer);

    inactivityTimer = setTimeout(() => {
      setModalOpen(true);

      // start modal response timer
      modalTimer = setTimeout(() => {
        handleLogout();
      }, MODAL_RESPONSE_LIMIT);
    }, INACTIVITY_LIMIT);
  };

  const handleLogout = () => {
    setModalOpen(false);
    dispatch(logout(navigate));
  };

  const handleYes = () => {
    setModalOpen(false);
    resetTimer();
  };

  const handleNo = () => {
    handleLogout();
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(modalTimer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  useEffect(() => {
    dispatch(createHomeCategory());
  }, [dispatch]);

  useEffect(() => {
    const sellerJwt = localStorage.getItem("seller_jwt");
    if (sellerJwt) {
      dispatch(fetchSellerProfile(sellerJwt));
    }
  }, []);

  useEffect(() => {
    const customerJwt = auth.jwt || localStorage.getItem("customer_jwt");
    if (customerJwt) {
      dispatch(fetchUserProfile({ jwt: customerJwt }));
    }
  }, [auth.jwt]);




  return (
    <div className="p-0 m-0 bg-transparent">
      <ThemeProvider theme={customeTheme}>
        <Navbar />

        <InactivityModal open={modalOpen} onYes={handleYes} onNo={handleNo} />

        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/products/:category" element={<Product key={location.pathname} />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/reviews/:productId" element={<Review />} />
          <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
          <Route path="/deal-details/:categoryId/:name/:productId" element={<DealDetails />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/account/order/:orderId/:orderItemId" element={<OrderDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/seller/*" element={<SellerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/products/:productId/review" element={<WriteReviewModal />} />
          <Route path="/deal/:dealId/review" element={<WriteReviewModal />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<ProtectedRoute allowedRole="ROLE_CUSTOMER"><Cart /></ProtectedRoute>} />
          <Route path="/deal-table" element={<DealTable />} />
          <Route path="/create-deal" element={<CreateDealForm />} />
          <Route path="/deals/:id" element={<Product />} />
          <Route path="/Deal-details/:categoryId/:name/:productId/:section" element={<ProductDetails />} />
        </Routes>
      </ThemeProvider>
    </div>

  );
}

export default App;
