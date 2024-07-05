import './App.css'
import ChatProvider from './context/ChatProvider'
import Chatpage from './pages/Chatpage'
import Homepage from './pages/Homepage'
import {  Route, Routes } from 'react-router-dom'
function App() {


  return (
    
      <ChatProvider>

      
        <Routes>

          <Route path="/" element={<Homepage />} />
          <Route path='/chat' element={<Chatpage />} />

        </Routes>
   
      </ChatProvider>


  )
}

export default App
