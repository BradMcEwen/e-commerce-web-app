import { useState, useEffect } from 'react'; 
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

function OrderList() {
  const [orders, setOrders] = useState([]);
  

  useEffect( () => {
    const FetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/orders")
      setOrders(response.data);
      } catch (error){
        console.log(error)
      }
    
    }
    FetchOrders();
  }, [orders])
  
  
  return (
    <Container>
      <h3>Orders for Product ID: {productId}</h3>
      <ListGroup>
        {orders.map((order) => (
          <ListGroup.Item key={order.order_id}>
            <div>Order ID: {order.order_id}</div>
            <div>Order Date: {order.order_date}</div>
            <div>Customer ID: {order.customer_id}</div>
            <div>Products: {order.products.map((p) => p.name).join(', ')}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default OrderList;