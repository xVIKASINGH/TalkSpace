import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto"      style={{ 
        fontSize: "0.9rem", 
        backgroundColor: "#4B4B4B",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%"
      }}>
    <div className="container">
      <p>© 2025 TalkSpace. All rights reserved.</p>
    </div>
  </footer>
  )
}

export default Footer