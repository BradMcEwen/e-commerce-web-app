import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import axios from 'axios'; 
import OrderList from '../OrderList/OrderList';
import OrderForm from '../OrderForm/OrderForm';

// useNavigate allows us to navigate to certain Routes we have defined
// very similar to Link however we can use this in any element

//internal import

function ProductList() {
  const navigate = useNavigate(); 
  const [ products, setProducts ] = useState([]);
  const [ selectedProductId, setProductId] = useState(null);
    
    // making an API call as soon as we enter the page
    // we want to grab the Customer Information from the server right away & display it!
    useEffect( () => {
      // Similate fetching data from an API
      // alert('Component is Mounted')
      console.log('Component is Mounted')
      
      async function fetchProducts(){
        try {
          const response = await axios.get("http://127.0.0.1:5000/products")
          setProducts(response.data); //assigning it to state management using useState
        } catch (error){
          console.log(error)
        }
        
      }
      
      
      fetchProducts();
      
      
      // alert('Component is Unmounted')
    }, []); //empty dependency list means this will run as soon as the componnent mounts to DOM but not after
    
    // this useEffect only gets called based on the changes to the selectedCustomerId variable
    useEffect( () => {
      if (selectedProductId !== null){
        alert(`New product selected: ID ${selectedProductId}`)
      }
    }, [selectedProductId]);
    
    function handleProductId(id){
      setProductId(id);
    }
    
    async function handleDeleteProduct(id){
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/products/${id}`)
        console.log(response)
        
        let currentProducts = [ ...products ]
        currentProducts = currentProducts.filter( product => product.product_id != id)
        setProducts(currentProducts)
        
        // window.location.reload()
      } catch(error){
        console.log(error)
      }
    }
    
  return (
    <Container className="border border-white rounded p-4 w-75">
      <h3>Products</h3>
      <ListGroup>
        {products.map( (product) => (
            <Container key={product.product_id} className="mb-3">
              <ListGroup.Item onClick={ () => handleProductId(product.product_id)} className="li rounded border mb-2">{product.name}</ListGroup.Item>
              <Button onClick={ () => navigate(`/edit-products/${product.product_id}`)} variant="outline-info" size="sm">Edit</Button>
              <Button onClick={ () => handleDeleteProduct(product.product_id)} variant="outline-danger" size="sm" className="ms-2">Delete</Button>
            </Container>
        ))}
      </ListGroup>
      {selectedProductId && (<>
      <OrderForm products={products} />
      <OrderList productId={selectedProductId} />
      </>
      )}
    </Container>
  )
}

export default ProductList