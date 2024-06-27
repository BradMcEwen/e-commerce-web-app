import { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal';

import axios from 'axios'; 

//internal import
import style from './ProductForm.module.css';

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [validated, setValidated] = useState(false); 
  const [show, setShow] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("Success!");
  const [formData, setFormData] = useState({
    name: "",
    price: ""
  })
  
  function handleChange(event){
    console.log(event.target)
    
    const { name, value } = event.target; 

    console.log(name, value)
    setFormData({ ...formData, [name]: value }) 
    console.log(formData)
  }
  
  async function handleSubmit(event){
    event.preventDefault();
    console.log(event);
    const form = event.target; 
    
    // checking to see if any validation comes back false & if this is an add-customer aka we don't an id
    if (form.checkValidity() === false && id === undefined){
      event.stopPropagation(); //stop the event from doing anything further
      setValidated(true); //so once we set this to true it WILL show the validation feedback
    } else {
          if (id) {
            try {
              const response = await axios.put(`http://127.0.0.1:5000/products/${id}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }
                )
            
              console.log(response)
              setMessage(`Successfully Updated Product: ${formData.name}`)
              } catch(error) {
                console.log(error)
                setMessageType("Error")
                setMessage("Error Updating User to the Server. Please Try Again")
              }
          } else {
            
                  try {
                  const response = await axios.post(`http://127.0.0.1:5000/products`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  )
                  
                  console.log(response)
                  setMessage(`Successfully Added Product: ${formData.name}`)
                  // alert(`Submitted Customer: ${formData.name}`)
                  
                } catch(error) {
                  console.log(error)
                  setMessageType("Error")
                  setMessage("Error Adding User to the Server. Please Try Again")
                }
        
          }
    
      setShow(true);
      
    }
  }
  
  function handleClose(){
    setShow(false);
    navigate('/products');
  }
  
  return (
    <Container>
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="border border-white rounded p-4">
      <h3>Add/Edit Products</h3>
      <FloatingLabel
        htmlFor="name"
        label="Name"
        className="mb-3 text-dark"
      >
        {/* determine why we can't adjust the Form.Control height with the size attribute */}
        <Form.Control type="text" size="sm" id="name" name="name" pattern="[A-Z][a-z]*\s{0,1}([A-Z][a-z]*)*"placeholder="Name here" onChange={handleChange} required/>
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">Please Enter a Valid Name</Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        htmlFor="price"
        label="Price"
        className="mb-3 text-dark"
      >
        <Form.Control type="text" id="price" name="price" pattern="[0-9]+[.][0-9]{2,}" placeholder="Price here" onChange={handleChange} required/>
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">Please Enter a Valid Price</Form.Control.Feedback>
      </FloatingLabel>
      
      <Button type="submit" className={`${style.button} btn btn-primary w-25`}>Submit</Button>
    </Form>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{messageType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
      </Modal>
    </Container>
  )

}

export default ProductForm