import './App.css'
import Navbar from './Components/Navbar'
import Landingpage from './Components/Landingpage'
import SignupPage from './Components/SignupPage'
import Footer from './Components/Footer'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './Components/LoginPage'
import Home from './Components/Home'

function AppContent() {  
  const location = useLocation(); 

  return (
    <>
      {location.pathname !== '/home' && <Navbar />} 

      <Routes>
        <Route path='/' element={<Landingpage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
