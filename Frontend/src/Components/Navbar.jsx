import axios from 'axios';
import React, { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'

function Navbar() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate=useNavigate();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/checkAuth", { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true); 
        
        } else {
          console.log("Logout failed:", response.data.message);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.log("Not authenticated:", error.message);
      }
    };

    checkAuth();
  }, []);
  const handleLogout=async()=>{
    try {
    const response= await  axios.post("http://localhost:3000/logout",null,{withCredentials:true})
    if(response.status==201){
      setIsAuthenticated(false);
      navigate("/");
    }else{
      console.log("Logout failed:", response.data.message);
    }
    } catch (error) {
      console.log(error);
    }
  }
  return (
   <>
    <nav className="navbar navbar-expand-lg bg-white bg-body-tertiary border-bottom" style={{ backgroundColor: "transparent" }}>
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <i className="fa-solid fa-video" style={{ width: "85%", marginLeft: "2rem" }}></i> 
        </Link>

        <h3>TalkSpace</h3>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
        {!isAuthenticated ? (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/home">Join as Guest</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/signup">Register</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item mx-3 ">
                <Link className="nav-link" to="/home">Room</Link>
                </li>
                <li className="nav-item mx-3">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              
              </ul>
            )}
        </div>
      </div>
    </nav>
   </>
  )
}

export default Navbar;
