import React, { useState } from 'react';
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
  const [username,setusername]=useState('');
  const [password,setpassword]=useState('');
  const [showmodal,setshowmodal]=useState(null);
  const [responseMessage,setResponseMessage]=useState('');
  const [success,setsuccess]=useState(null);
  const navigate=useNavigate();
  const handlechange=(e)=>{
    const {name,value}=e.target;
    if(name==="username"){
      setusername(value);
    }else{
      setpassword(value);
    }
  }
  const handlesubmit=async(e)=>{
    e.preventDefault();
    const userdata={username,password};
    try {
     const response=await  axios.post("http://localhost:3000/login",userdata,{
        withCredentials:true
       })
       if(response.data){
        const {success,message}=response.data;
        if (success) {
          setResponseMessage(message || "Logged in successfully");
          setsuccess(true);

          
      
        } else {
          setResponseMessage(message || "Login failed. Please try again.");
          setsuccess(false); 
        }
        
        setshowmodal(true); 
       }
     
    } catch (error) {
      console.log(`here is your error before axios work ${error}`);
      setResponseMessage("Login failed. Please try again.");
      setsuccess(false);
      setshowmodal(true);
    }
  
  }
  const handleClose = () => {setshowmodal(false);
    if(success){
      navigate('/home');
    }
  
  };
  return (
    <div className="container mt-1 mb-5 p-4 " style={{ backgroundColor: "#F9F9F9" }}>
      <div className="row align-items-center">
        <div className="col-lg-6 text-center mt-3">
          <img 
             src="\couple-video-call-with-phone-free-vector.jpg" 
            alt="TalkSpace Logo" 
            style={{ width: "80%", maxWidth: "700px" }} 
            className="img-fluid"
          />
        </div>

        
        <div className="col-lg-6 mt-5 p-5">
          <h1 className="mb-4">Login now</h1>
          <form onSubmit={handlesubmit}>

            <div className="mb-3">
              <input 
                type="text" 
                className="form-control p-3" 
                placeholder="Enter your username" 
                name='username'
                value={username}
                onChange={handlechange}
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="mb-4">
              <input 
                type="password" 
                className="form-control p-3" 
                placeholder="Enter your password" 
                name='password'
                value={password}
                onChange={handlechange}
                style={{ borderRadius: "8px" }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 p-2 text-black"
              style={{ borderRadius: "8px", fontWeight: "bold" ,width:"25%"}}
            >
             Log in
            </button>
          </form>
        </div>
      </div>
      <Modal show={showmodal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Response from Server</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {responseMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginPage;
