import axios from "axios";
import {  useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatProvider";

interface User {
  _id: string;
  username: string;
  email: string;
  pic: string;
}

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo.token;
  const {chats , setChats} = useContext(ChatContext)
  const handleSearch = async (e: string) => {
    setSearchQuery(e);
    if (!e) {
      setSearchResults([]);
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;
      if (!token) {
        navigate("/");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/user/params?search=${e}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUsers((prevUsers) => [...prevUsers, user]);
    setSearchQuery(""); // Clear search query after selecting a user
    setSearchResults([]); // Clear search results
  };

  const handleRemoveUser = (user: User) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((selectedUser) => selectedUser._id !== user._id)
    );
  };

  const handleCreateGroup = async () => {
    // Validate group name and selected users
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    // Proceed with group creation logic
    // Example: Send API request to create group with groupName and selectedUsers
    try {
        const response = await axios.post(
          `http://localhost:3000/api/chat/group`,
          {
            name: groupName,
            users: JSON.stringify(selectedUsers.map((u) => u._id))
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChats([response.data, ...chats]);
      } catch (error) {
        console.log(error);
      }
      
    onCreate();

    // Reset modal state
    setGroupName("");
    setSelectedUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Create Group Chat</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter group name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="AddUser" className="block text-sm font-medium text-gray-700">
            Add Users
          </label>
          <input
            onChange={(e) => handleSearch(e.target.value)}
            value={searchQuery}
            type="text"
            id="AddUser"
            name="AddUser"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add Users e.g. Rahul, Akash ..."
          />
          {/* Display search results */}
          {loading && <p>Loading...</p>}
          {searchResults.length > 0 && (
            <div className="mt-2">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className="p-2 flex items-center hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectUser(result)}
                >
                  <img
                    src={result.pic}
                    alt={result.username}
                    className="w-12 h-12 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-bold">
                      <span className="text-blue-300 font-extrabold">User: </span>
                      {result.username}
                    </div>
                    <div className="font-bold">
                      <span className="text-blue-300 font-extrabold">Email: </span>
                      {result.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Display selected users */}
        {selectedUsers.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Selected Users:</label>
            {selectedUsers.map((user) => (
              <div key={user._id} className="flex items-center mb-2">
                <img
                  src={user.pic}
                  alt={user.username}
                  className="w-12 h-12 rounded-full mr-2"
                />
                <div>
                  <div className="font-bold">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveUser(user)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
            onClick={handleCreateGroup}
          >
            Create
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
