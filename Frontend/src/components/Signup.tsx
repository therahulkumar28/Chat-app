import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pic, setPic] = useState<File | null>(null); 
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('username', name);
    formData.append('email', email);
    formData.append('password', password);
    if (pic) {
      formData.append('pic', pic);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/user/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('userInfo',response.data)
      console.log(response.data);
      navigate('/chat');
    } catch (error) {
      console.log('axios error', error);
    }
  };

  const handlePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPic(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto p-5 bg-gray rounded my-5">
      <form onSubmit={handleSignup}>
        <label className="block mb-2">
          Enter Your Name:
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full mt-1 p-1.5 border border-gray-300 rounded"
          />
        </label>
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
        <label className="block mb-2">
          Upload Your Pic:
          <input
            type="file"
            onChange={handlePicChange}
            className="block w-full mt-1 p-1.5 border border-gray-300 rounded"
          />
        </label>
        <button type="submit" className="bg-teal w-full text-white px-4 py-2 mt-3 rounded">
          Signup
        </button>
        <p className="mt-3 text-center">
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Signup;
