import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './Home/LandingPage'
import Header from './Home/components/Header'
import Contact from './Home/Contact'
import Pets from './Home/Pets'
import Products from './Home/Products'
import Pnf from './Home/components/Pnf'
import UserReg from './auth/UserReg'
import PetReg from './auth/PetReg'
import About from './Home/About'
import AdminDashboard from './admin/AdminDashboard'
import PetOwnerProfile from './owner/PetOwnerProfile'
import PetOwnerLogin from './owner/PetOwnerLogin'
import AdoptionRequests from './Home/AdoptionRequests'
import ProductReg from './admin/ProductReg'
import OrderSuccess from './Home/OrderSuccess'







function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/register' element={<UserReg/>}/>
      <Route path='/login' element={<UserReg/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/pets' element={<Pets/>}/>
      <Route path='/products' element={<Products/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/petreg' element={<PetReg/>}/>
      <Route path='/ordersuccess' element={<OrderSuccess/>}/>
      <Route path='/*' element={<Pnf/>}/>

      {/* admin */}
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/productreg' element={<ProductReg/>}/>

      {/* owner */}
            <Route path='/owner/profile' element={<PetOwnerProfile/>}/>
            <Route path='/owner/login' element={<PetOwnerLogin/>}/>
            <Route path='/adoption/request' element={<AdoptionRequests/>}/>



      


    </Routes>
    
      
    </>
  )
}

export default App
