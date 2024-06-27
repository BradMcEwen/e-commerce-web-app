import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

import style from './OrderForm.module.css';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [orderDate, setOrderDate] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products');
        setProducts(response.data);
      } catch (error) {
        alert('Error fetching products');
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/orders', { customerId, orderDate, products: selectedProducts });
      alert('Order placed successfully');
    } catch (error) {
      alert('Error placing order');
    }
  };

  const handleProductChange = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCustomerId">
        <Form.Label>Customer ID</Form.Label>
        <Form.Control type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formOrderDate">
        <Form.Label>Order Date</Form.Label>
        <Form.Control type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="formProducts">
        <Form.Label>Products</Form.Label>
        {products.map((product) => (
          <Form.Check
            key={product.product_id}
            type="checkbox"
            label={product.name}
            value={product.product_id}
            onChange={() => handleProductChange(product.product_id)}
          />
        ))}
      </Form.Group>
      <Button className={`${style.button} btn btn-primary w-100`} variant="primary" type="submit">
        Place Order
      </Button>
    </Form>
  );
};

export default OrderForm;
