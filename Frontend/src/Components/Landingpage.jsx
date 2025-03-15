import React from 'react'
import { Link } from 'react-router-dom';
function Landingpage() {
  return (
    <div className="container-fluid p-0 position-relative">
      <div className="vh-100">
        <img 
          src="/background.png" 
          className="img-fluid w-100 h-100" 
          alt="background" 
          style={{ objectFit: "cover" }} 
        />
      </div>
      
        
      <div 
        className="position-absolute " 
        style={{ 
          top: "20%", 
          left: "10%", 
          marginBottom: "2rem",
          zIndex: 1 
        }}
      >
       <h1 style={{color:"white",marginTop:"3.5rem"}}> Connect with your loved ones</h1>
       <h4 style={{marginTop:"1rem",color:"gray"}}>Cover a distance with TalkSpace</h4>
       <button type="button" class="btn btn-warning mt-2 text-black ">
        <Link to="signup" style={{textDecoration:"none" ,color:"black"}}>Get Started</Link>
       </button>
      </div>
      <div 
        className="position-absolute" 
        style={{ 
          top: "20%", 
          right: "5%", 
          marginBottom: "2rem",
          zIndex: 1 
        }}
      >
        <img 
          src="/mobile.png" 
          className="img-fluid" 
          alt="Right Side Image"
          style={{ 
            maxWidth: "1000px", 
            width: "100%",
            marginRight: "2rem",
            marginBottom: "2rem",
          }}  
        />
      </div>
    </div>
  )
}

export default Landingpage;
