import React from 'react'
import { Navigate } from 'react-router-dom';
function Home() {
  const token = localStorage.getItem("authToken");
 
  if(!token){
    return <Navigate to="/" />; 
  }
  return (
    <div className='container p-3'>
        <div className='mt-3 bg-gray text-center'><h2>TalkSpace: Your Gateway to Effortless Communication</h2></div>
     
        <div className='row p-3'>
            <div className='col-6 p-3'>
            <img 
             src="\logo3.png" 
            alt="TalkSpace Logo" 
            style={{ width: "80%", maxWidth: "700px" }} 
            className="img-fluid"
          />
            </div>
            <div className='col-6 mt-5 p-5'>
                <form action="">
                <div className="mb-3">
              <input 
                type="text" 
                className="form-control p-3" 
                placeholder="Enter meeting code." 
                style={{ borderRadius: "12px"}}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100 p-2 text-white"
              style={{ borderRadius: "8px", fontWeight: "bold" ,width:"10%"}}
            >
             JOIN
            </button>
                </form>
       
            </div>

        </div>
    </div>
  )
}

export default Home