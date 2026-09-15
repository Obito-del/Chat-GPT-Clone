//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
//import heroImg from './assets/hero.png'


import { useEffect, useState } from 'react';
import SideBar from './components/Sidebar'
import ChatSection from './components/ChatSection'

import './App.css'
//import { chatHistory, myDetailedConvo } from './data/ChatHistory';

const API_URL = 'http://localhost:3000';


function App() {
  //const [count, setCount] = useState(0)
  const [chatData, setChatData] = useState([])
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState(null);

  const handleData = () => {
    fetch(`${API_URL}/conversations`).then((res) => res.json())
    .then((data) => setChatData(data))
    .catch((err) => console.error('Failed to fetch conversations:', err));
  }

  useEffect(() => {
    handleData();
  }, []);


   const handleChatSelect = (id) => {
    
    //locally-typed chats live only in chatData, no in the backend
    console.log('Selected chat ID:', message);

    fetch(`${API_URL}/conversations/${id}`)
    .then((res) => res.json())
    .then((data) => setActiveChat(data))
    .catch((err) => console.error('Failed to fetch conversations:', err))
  }


const handleSend = async () => {
  const response = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: message })
  });
  handleData(); 
  const data = await response.json();
  console.log(data);
  setMessage("");  // ← clear the input
};


  return (
  <div className='app-container'>

    <SideBar setActiveChat = {handleChatSelect} chatData={chatData} setChatData={setChatData}/>
    <ChatSection handleSend={handleSend} activeChat = {activeChat} messages={message} setMessage={setMessage} chatData={chatData} setChatData={setChatData}/>
  </div>
  )
}

export default App
