import ChatBox from "../Miscllaneous/ChatBox"
import MyChats from "../Miscllaneous/MyChats"
import Appbar from "../components/Appbar"




const Chatpage = () => {
    
  return (
    <div className="flex flex-col">
      <div>

      <Appbar/>
      </div>
      <div className="flex ">
      <MyChats/>
      <ChatBox/>
      </div>
    </div>
  )
}

export default Chatpage