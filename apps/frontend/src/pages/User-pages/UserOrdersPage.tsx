import React, { useEffect, useState } from "react";

import OrdersPanel from "../../components/User-Components/User_Dashboard-Component/OrdersPanel";

import api from "../../api/client";

const UserOrdersPage: React.FC = () => {

  const [orders, setOrders] = useState<any[]>([]);

  // ============================================
  // FETCH ORDERS
  // ============================================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const userId = user.id;

        console.log("USER ID:", userId);

        const response = await api
          .get(`orders?userId=${userId}`)
          .json<any[]>();

        // ============================================
        // MAP API RESPONSE
        // ============================================

        const mappedOrders = response.map((order) => ({

          numericId: order.id,

          id: order.orderNumber,

          rawOrder: order,

          productImage:
            order.orderItems?.[0]?.product?.image || "",

          productName:
            order.orderItems?.[0]?.product?.name || "Product",

          orderDate:
            new Date(order.createdAt)
              .toLocaleDateString(),

          paymentMethod:
            order.paymentMethod,

          deliveryCharge:
            order.shippingCost,

          price:
            order.totalAmount,

          status:
            order.status === "delivered"
              ? "delivered"
              : order.status === "shipped"
              ? "on-deliver"
              : order.status === "cancelled"
              ? "cancelled"
              : "pending",
        }));

        setOrders(mappedOrders);

      } catch (error) {

        console.error(
          "Failed to fetch orders",
          error
        );
      }
    };

    fetchOrders();

  }, []);

  return (
    <OrdersPanel
      orders={orders}
      wishlist={[]}
    />
  );
};

export default UserOrdersPage;