import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
      <Route path={"/signin"} element={<Signin />}></Route>
      <Route path={"/Signup"} element={<Signup />}></Route>
    </Routes> 
  </div>
 )
}

export default App
