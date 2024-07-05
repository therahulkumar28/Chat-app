import { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import SearchBarSkeleton from "../skeleton/SearchBarSkeleton";
import { ChatContext } from "../context/ChatProvider";

interface SearchUser {
  _id: string;
  username: string;
  pic: string;
  email:string;
}

interface SidebarProps {
  onClose: () => void;
}

const SearchBar: React.FC<SidebarProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo.token;
  const { setSelectedChat , chats , setChats} = useContext(ChatContext)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleChat = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/chat/`,
        { userId }, // userId should be wrapped in an object
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(!chats.find((c) => c._id === response.data._id)) setChats([response.data , ...chats])
      // Assuming response.data is the new chat, add it to the existing chats
      setSelectedChat(response.data);
      onClose()
    } catch (error) {
      console.error("Error creating chat", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (searchQuery.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/user/params?search=${searchQuery}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchQuery('')
      setSearchResults([]);
    }
  };

  return (
    <div className="fixed inset-0 flex">
      <div className="relative w-96 bg-white text-black shadow-lg z-50">
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <div className="flex items-center space-x-2 relative cursor-auto">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-2 py-1 text-black rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <button onClick={handleSearch} className="px-2 py-1 text-black bg-blue-300 rounded hover:bg-blue-500">
              Search
            </button>
          </div>
          <button
            className="text-gray-600 font-extrabold hover:text-gray-900"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <SearchBarSkeleton/>
          ) : (
            searchResults.length === 0 && searchQuery.length >=2 ? (
              <div className="flex justify-center items-center text-blue-200 ">No Result found</div>
            ) : ( 
              searchResults.map((result) => (
                <div key={result._id} onClick={()=>{handleChat(result._id)}} className="p-2 flex items-center hover:bg-gray-200 cursor-pointer">
                  <img
                    src={result.pic}
                    alt={result.username}
                    className="w-12 h-12 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-bold"><span className="text-blue-300 font-extrabold">User: </span>{result.username}</div>
                    <div className="font-bold "><span className="text-blue-300 font-extrabold">Email: </span>{result.email}</div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
    </div>
  );
};

export default SearchBar;
