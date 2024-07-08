import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatProvider";

const ChatBox = () => {
  const { selectedChat } = useContext(ChatContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="hidden md:flex items-center justify-center h-full">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen md:flex">
      <div className="flex-shrink-0 bg-gray-200 p-4 flex items-center justify-between">
        <div className="font-bold text-lg">{selectedChat.chatName}</div>
        {selectedChat.isGroupChat && (
          <div className="text-sm text-gray-500">Group Chat</div>
        )}
      </div>
      <div className="flex-grow p-4 overflow-auto bg-gray-100">
        {/* Messages will go here */}
        {selectedChat.users.map((user, index) => (
          <div key={user._id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className="bg-white p-2 rounded shadow mb-2 max-w-xs">
              <div className="font-bold text-sm">{user.username}</div>
              <div className="text-sm">Sample message...</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-shrink-0 p-4 bg-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
