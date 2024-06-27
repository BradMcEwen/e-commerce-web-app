import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        alert('Error fetching order details');
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>No orders</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order Date: {order.orderDate}</p>
      <p>Customer ID: {order.customerId}</p>
      <h3>Products:</h3>
      <ul>
        {order.products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
