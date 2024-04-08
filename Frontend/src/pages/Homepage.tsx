import { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabClick = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
  };

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col'>
      <div className='bg-teal text-white text-center py-5 text-2xl'>
        Talk-A-Tive
      </div>
      <div className='mx-auto w-2/6 p-3 border border-gray-300 bg-gray-200 rounded mt-20'>
        <div className='flex justify-around mt-3'>
          <span
            className={`cursor-pointer ${
              activeTab === 'login'
                ? 'border-b-2 border-teal transition duration-300 ease-in-out'
                : ''
            }`}
            onClick={() => handleTabClick('login')}
          >
            Login
          </span>
          <span
            className={`cursor-pointer ${
              activeTab === 'signup'
                ? 'border-b-2 border-teal transition duration-300 ease-in-out'
                : ''
            }`}
            onClick={() => handleTabClick('signup')}
          >
            SignUp
          </span>
        </div>
        <div className="w-full">
          {activeTab === 'login' ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
