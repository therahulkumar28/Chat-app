import axios from "axios";
import { ChatContext } from "../context/ChatProvider";
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBarSkeleton from "../skeleton/SearchBarSkeleton";
import CreateGroupChatModal from "../components/CreateGroupChat";

const MyChats = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat,  chats, setChats } = useContext(ChatContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGroupChat = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    // Logic to handle creating group chat
    setIsModalOpen(false); // Close modal after creating group chat
  };
  const fetchChat = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;
      if(!token){
        navigate('/')
        return ;
      }
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/chat/`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming response.data is the new chat, add it to the existing chats
      setChats(response.data);

    } catch (error) {
      console.error("Error creating chat", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <div className="flex flex-col w-full md:w-[30%] lg:w-[25%]  min-h-screen border-r border-gray-300" >
        <div className="flex justify-between items-center h-16 p-2 w-full border-b border-gray-500 ">
        <div className="flex flex-wrap p-2">
          My Chats
        </div>
        <div className="flex flex-wrap p-2 bg-green-500 text-white cursor-pointer hover:bg-green-600" onClick={handleCreateGroupChat}>
        Create Group Chat +
      </div>
      <CreateGroupChatModal isOpen={isModalOpen} onClose={handleCloseModal} onCreate={handleCreate} />
      </div>
       <div className="flex flex-col   h-screen overflow-y-auto border-r border-gray-400">
    
      {loading ? (
        <div className="flex justify-center items-center h-full m-4"><SearchBarSkeleton/></div>
      ) : (

        chats.map((chat) => (
          <div
            key={chat._id}
            className={`flex items-center p-3 cursor-pointer border-b border-gray-300 hover:bg-gray-200 ${selectedChat === chat ? "bg-gray-300" : ""
              }`}
            onClick={() => setSelectedChat(chat)}
          >
            <img
              src={chat.isGroupChat ? chat.groupAdmin?.pic : chat.users[0].pic}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex flex-col">
              <span className="font-semibold">
                {chat.chatName}
              </span>
              <span className="text-sm text-gray-500">
                {chat.isGroupChat ? `Group: ${chat.users.map(user => user.username).join(", ")}` : `Chat with ${chat.users.map(user => user.username).join(", ")}`}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
   
  );
}

export default MyChats;
