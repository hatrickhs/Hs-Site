
// import React, { useEffect } from "react";
// import OrderItemCard from "./OrderItemCard";
// import { useAppDispatch, useAppSelector } from "../../../State/Store";
// import { fetchUserOrderHistory } from "../../../State/customer/orderSlice";

// const Orders = () => {
//   const dispatch = useAppDispatch();
//   const { orders, loading } = useAppSelector((state) => state.order);

//   const jwt = localStorage.getItem("jwt") || "";

//   useEffect(() => {
//     if (jwt) dispatch(fetchUserOrderHistory(jwt));
//   }, [dispatch, jwt]);

//     const safeOrders = Array.isArray(orders) ? orders : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         Loading orders...
//       </div>
//     );
//   }

//   if (!safeOrders || safeOrders.length === 0) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         No orders found.
//       </div>
//     );
//   }

//   return (
//     <div className="text-sm min-h-screen px-4">
//       <div className="pb-5">
//         <h1 className="font-semibold text-lg">All Orders</h1>
//         <p className="text-gray-500">from anytime</p>
//       </div>

//       <div className="space-y-4">
//         {orders
//           .filter(
//             (order) => order.orderItems && order.orderItems.length > 0
//           )
//           .map((order) => (
//             <div
//               key={order.id}
//               className="border rounded-lg p-3 bg-gray-50"
//             >
//               {/* Order Header */}
//               <div className="mb-2">
//                 <p className="text-gray-500 text-sm">
//                   Order ID: {order.id}
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   Date:{ order.orderDate}
//                   {order.orderDate
//                     ? new Date(order.orderDate).toLocaleString()
//                     : "—"}
//                 </p>
//               </div>

//               {/*  Order Items */}
//               {order.orderItems.map((item: any) => (
//                 <OrderItemCard
//                   key={item.id}
//                   order={order}
//                   item={item}
//                   jwt={jwt}
//                 />
//               ))}
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;


import React, { useEffect } from "react";
import OrderItemCard from "./OrderItemCard";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchUserOrderHistory } from "../../../State/customer/orderSlice";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.order);

  const jwt = localStorage.getItem("jwt") || "";

  useEffect(() => {
    if (jwt) dispatch(fetchUserOrderHistory(jwt));
  }, [dispatch, jwt]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading orders...
      </div>
    );
  }

  if (safeOrders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No orders found.
      </div>
    );
  }

  return (
    <div className="text-sm min-h-screen px-4">
      <div className="pb-5">
        <h1 className="font-semibold text-lg">All Orders</h1>
        <p className="text-gray-500">from anytime</p>
      </div>

      <div className="space-y-4">
        {safeOrders
          .filter((order: any) => order.orderItems?.length > 0)
          .map((order: any) => (
            <div key={order.id} className="border rounded-lg p-3 bg-gray-50">
              
              <div className="mb-2">
                <p className="text-gray-500 text-sm">
                  Order ID: {order.id}
                </p>
                <p className="text-gray-500 text-sm">
                  Date:{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "—"}
                </p>
              </div>

              {order.orderItems?.map((item: any) => (
                <OrderItemCard
                  key={item.id}
                  order={order}
                  item={item}
                  jwt={jwt}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;