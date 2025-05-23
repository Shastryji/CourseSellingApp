import './App.css'
import Signin from './assets/Signin'
import {Routes, Route} from 'react-router-dom'
import Signup from './assets/Signup'


//adding react routers

function App() {
 return(
<div>
    <Routes>
      <Route path={"/addcourse"} element={<Add-Course/>}></Route>
      <Route path={"/purchased-courses"} element={<Purchased-Courses/>}></Route>
      <Route path={"/signin"} element={<Signin />}></Route>
      <Route path={"/Signup"} element={<Signup />}></Route>
    </Routes> 
  </div>
 )
}

export default App
