import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define the User interface according to your needs
interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}
const defaultState = {
  user: {
    id: '',
    name: '',
    email: ''
  },
  setUser: () => {}
} as ChatContextType;

// Create the context with a default value of undefined
export const ChatContext = createContext<ChatContextType>(defaultState);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo: User = JSON.parse(userInfo);
      setUser(parsedUserInfo);
      navigate('/');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
