
import React from "react";
import { IconButton, Avatar } from "@mui/material";
import { Close, ElectricBolt } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { OrderItem, Order } from "../../../State/types/orderType";
import { useAppDispatch } from "../../../State/Store";
import { removeOrderItem } from "../../../State/customer/orderSlice";
import { useNavigate } from "react-router-dom";

interface Props {
  item: OrderItem;
  order: Order;
  jwt: string;
}

const OrderItemCard: React.FC<Props> = ({ item, order, jwt }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // remove item
  const handleRemoveItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      removeOrderItem({
        orderId: order.id,
        orderItemId: item.id,
        jwt,
      })
    );
  };

  // safe date format
  const formattedDate = order.deliverDate
    ? new Date(order.deliverDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // image safe
  const getImage = () => {
    return (
      item.product?.images?.[0] ||
      item.deal?.images?.[0] ||
      "/placeholder.png"
    );
  };

  // title safe
  const getTitle = () => {
    return item.product?.title || item.deal?.name || "Product";
  };

  // seller safe 
  const getSeller = () => {
    return (
      item.product?.seller?.businessDetails?.businessName ||
      item.product?.seller?.sellerName ||
      item.deal?.seller?.businessDetails?.businessName ||
      item.deal?.seller?.sellerName ||
      "Seller"
    );
  };

  //status color helper
  const getStatusClass = () => {
    switch (order.orderStatus) {
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-500";
      case "SHIPPED":
        return "text-blue-500";
      default:
        return "text-primary-color";
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/account/order/${order.id}/${item.id}`)
      }
      className="relative cursor-pointer bg-white p-5 border rounded-md space-y-4"
    >
      {/* REMOVE ITEM */}
      <IconButton
        onClick={handleRemoveItem}
        size="small"
        className="absolute top-2 left-2"
      >
        <Close fontSize="small" className="text-red-500" />
      </IconButton>

      {/* HEADER */}
      <div className="flex items-center gap-5">
        <Avatar sx={{ bgcolor: teal[500] }}>
          <ElectricBolt />
        </Avatar>

        <div>
          <h1 className={`font-bold ${getStatusClass()}`}>
            {order.orderStatus || "PENDING"}
          </h1>

          <p>Arriving By {formattedDate}</p>
        </div>
      </div>

      {/* PRODUCT / DEAL */}
      <div className="p-5 bg-teal-50 flex gap-3">
        {/* IMAGE */}
        <img
          className="w-[70px] h-[70px] object-cover rounded"
          src={getImage()}
          alt={getTitle()}
        />

        {/* DETAILS */}
        <div className="space-y-2">
          <h1 className="font-bold">{getTitle()}</h1>
          {/* <p>{getTitle()}</p> */}

          <p>
            <strong>Size:</strong> {item.size || "FREE"}
          </p>

          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;