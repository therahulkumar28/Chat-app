import  { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignin = async (e:any) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
  
      const response = await axios.post(
        'http://localhost:3000/api/user/signin',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Response:', response.data);
      
    } catch (error) {
      console.error('Axios error:', error);
  
      if (error) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };
  

  return (
    <div className="mx-auto p-5 bg-gray rounded my-5">
      <form onSubmit={handleSignin}>
        <label className="block mb-2">
          Enter Your Email:
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full mt-1 p-1.5 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
          Enter Your Password:
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full mt-1 p-1.5 border border-gray-300 rounded"
          />
        </label>

        <button type="submit" className="bg-teal w-full text-white px-4 py-2 mt-3 rounded">
          Signin
        </button>

        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default Login;
