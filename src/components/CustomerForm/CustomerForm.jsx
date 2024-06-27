import { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal';

import axios from 'axios'; 

//internal import
import style from './CustomerForm.module.css';

function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  // useParams allows us to grab parameters from our url
  // in this case our edit-customers/:id url endpoint takes in a parameter :id so we are grabbing that from the url to use
  // console.log(id)
  const [validated, setValidated] = useState(false); //by settingn this equal to default of false its saying DON'T show the validation feedback
  const [show, setShow] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("Success!");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })
  
  function handleChange(event){
    console.log(event.target)
    
    const { name, value } = event.target; //deconstructuring our event.target to grab the name & value key/value pairs
    // doing the same thing as above
    // const name = event.target.name;
    // const value = event.target.value; 
    console.log(name, value)
    setFormData({ ...formData, [name]: value }) //updating formData based on the changes to the input
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
            // in axios the order of the arguments is 
              // 1st = url,
              // 2nd = body,
              // 3rd = { headers, params }
            try {
              const response = await axios.put(`http://127.0.0.1:5000/customers/${id}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }
                )
            
              console.log(response)
              setMessage(`Successfully Updated Customer: ${formData.name}`)
              // alert(`Updated Customer: ${formData.name}`)
              } catch(error) {
                console.log(error)
                setMessageType("Error")
                setMessage("Error Updating User to the Server. Please Try Again")
              }
          } else {
            
                  try {
                  const response = await axios.post(`http://127.0.0.1:5000/customers`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  )
                  
                  console.log(response)
                  setMessage(`Successfully Added Customer: ${formData.name}`)
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
    navigate('/customers');
  }
  
  return (
    <Container>
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="border border-white rounded p-4">
      <h3>Add/Edit Customers</h3>
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
        htmlFor="email"
        label="Email"
        className="mb-3 text-dark"
      >
        <Form.Control type="email" id="email" name="email" pattern="[\w.]+@[\w]+[.][a-z]{2,}" placeholder="Email here" onChange={handleChange} required/>
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">Please Enter a Valid Email</Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        htmlFor="phone"
        label="Phone"
        className="mb-3 text-dark"
      >
        <Form.Control type="text" id="phone" name="phone" pattern="[\d]{10}" placeholder="Phone here" onChange={handleChange} required/>
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">Please Enter a Valid 10 Digit Phone #</Form.Control.Feedback>
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
  
  //-----------------------------WITHOUT BOOTSTRAP-------------------------------
  
  
  // return (
  //   <form onSubmit={handleSubmit} className={style.form}>
  //     <h3>Add/Edit Customers</h3>
  //     <div className={style["form-group"]}>
  //       <label htmlFor="name" className={style.label}>Name:</label>
  //       <input type="text" id="name" name="name" placeholder="Name here" className={style.input} onChange={handleChange}/>
  //     </div>
  //     <div className={style["form-group"]}>
  //       <label htmlFor="email" className={style.label}>Email:</label>
  //       <input type="text" id="email" name="email" pattern="[\w.]+@[\w]+[.][a-z]{2,}" placeholder="Email Here" className={style.input} onChange={handleChange}/>
  //     </div>
  //     <div className={style["form-group"]}>
  //       <label htmlFor="phone" className={style.label}>Phone:</label>
  //       <input type="text" id="phone" name="phone" pattern="[\d]{10}" placeholder="Phone Here" className={style.input} onChange={handleChange}/>
  //     </div>
  //     <button type="submit" className={style.button}>Submit</button>
  //   </form>
  // )
}

export default CustomerForm
