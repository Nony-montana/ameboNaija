import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import WriteYourStory from './pages/WriteYourStory'
const App = () => {
  return (
    <>

    <Navbar/>

    <Routes>
      <Route index element={<Home/>}/>

      <Route path='/write-story' element={<WriteYourStory/>}/>
    </Routes>

     
   



    </>
  )
}

export default App