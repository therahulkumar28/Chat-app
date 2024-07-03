import  { useState, useContext } from "react";
import { ChatContext } from "../context/ChatProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

const Appbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(ChatContext);

  return (
    <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
      {/* Left: Search Box */}
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 text-black rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Middle: App Name */}
      <div className="text-xl font-bold">Talkative</div>

      {/* Right: Menu */}
      <div className="relative">
        <button
          className="flex items-center space-x-2  focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
           <FontAwesomeIcon icon={faUser} />
          <span>{user.name}</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <div
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => { setModalOpen(true); setMenuOpen(false); }}
            >
              Profile
            </div>
            <div className="p-2 hover:bg-gray-200 cursor-pointer">
              Logout
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[30%] h-[60%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-black font-bold">User Profile</h2>
              <button
                className="text-gray-600 font-extrabold hover:text-gray-900"
                onClick={() => setModalOpen(false)}
              >
               X
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/96"
                alt="Profile"
                className="w-48 h-48 rounded-full mb-4"
              />
              <div className="text-lg font-bold">{user.name}</div>
              <div className="text-gray-600">{user.email}</div>
              <div className="mt-4 text-center">
                <p className="text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appbar;
