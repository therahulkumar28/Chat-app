import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define the User and Chat interfaces according to your needs
interface User {
  _id: string;
  username: string;
  email: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const defaultState: ChatContextType = {
  user: {
    _id: '',
    username: '',
    email: '',
    pic: '',
    createdAt: '',
    updatedAt: ''
  },
  setUser: () => {},
  chats: [],
  setChats: () => {},
};

// Create the context with a default value
export const ChatContext = createContext<ChatContextType>(defaultState);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultState.user);
  const [chats, setChats] = useState<Chat[]>(defaultState.chats);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo: User = JSON.parse(userInfo);
      setUser(parsedUserInfo);
      navigate('/');
    }
  }, []);

  return (
    <ChatContext.Provider value={{ user, setUser, chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
