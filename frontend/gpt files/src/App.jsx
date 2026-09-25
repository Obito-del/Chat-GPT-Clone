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

  const [isLoading, setIsLoading] = useState(false);
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
// changed 
    fetch(`${API_URL}/conversations/${id}`)
    .then((res) => res.json())
    .then((data) => setActiveChat(data))
    .catch((err) => console.error('Failed to fetch conversations:', err))
  }


  
const handleSend = async () => {
  const userMessage = message.trim();
  // if the user typed an empty string the if statment run which make it the code below not to run
  if(!userMessage) return; 

  let chatId = activeChat?.id;
  let chatTitle = activeChat?.title;

  if(!activeChat) {
    
    const response = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: userMessage
      })
    });

    const data = await response.json();
    chatId = data.id;
    chatTitle = data.title;
  }

console.log("active chat",activeChat)
setIsLoading(true);
// this is the updated version of response2
const previousMessages = activeChat?.messages || [];

const conversationMessages = [
  ...previousMessages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text
  })),
  {
    role: "user",
    content: userMessage
  }
];
console.log("SENDING TO BACKEND:", {
  model: "llama3.2:3b",
  message: conversationMessages
});

const response2 = await fetch(`${API_URL}/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "llama3.2:3b",
    message: conversationMessages,
    chatId: chatId
  })
});

      //  const response2 = await fetch(`${API_URL}/chat`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       model: "llama3.2:3b",
      //       message: [{ role: "user", content: userMessage }],
      //       title: chatTitle
      //     }),
      // });


  const aiData = await response2.json();
  console.log("ai data",aiData)
  
  setIsLoading(false)
    setActiveChat((prev) => ({
    id: chatId,
    title: chatTitle,
    messages: [
      // by default prev is undefined but since there is ? preve become an empty string
      ...(prev?.messages || []),
      {id: chatId + Date.now(), sender: 'user', text: userMessage},
      {id: chatId + Date.now(), sender: 'assistant', text: aiData.content}
    ]
  }));

  handleData();
  if(!activeChat) 
    setMessage("");
    
    };
  //   handleData();
  // setMessage("");

  
  //   const userMessage = message.trim();

  //   const response = await fetch(`${API_URL}/conversations`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ messages: userMessage })
  // });
  // const data = await response.json();

  // const response2 = await fetch(`${API_URL}/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     model: "llama3.2:3b",
  //     message: [{role: "user", content: userMessage}]
  //   }),
 
 
  // const response = await fetch(`${API_URL}/conversations`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ messages: message })


  // });

  // const aiData = await response2.json();
  // console.log(aiData);

  // setActiveChat({
  //   id: data.id, 
  //   title: userMessage, 
  //   messages: [
  //     {id: data.id + '-user', sender: 'user', text: userMessage},
  //     {id: data.id + '-assistant', sender: 'assistant', text: aiData.content}

  //   ]


  
//   const response2 = await fetch(`${API_URL}/chat`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       chat: message,
//       model: "llama3.2:3b",
//       message: [
//         {
//           role: "user",
//           content: message
//         }
//       ]
//     }),

//   })
    

//   console.log(response2)



//   const data = await response.json();
//   console.log(data);
//   setActiveChat({id: data.id, title: message, text:message});
//   handleData();  // Refresh the chat list after sending a message

  
//   setMessage("");  // ← clear the input
// };


  return (
  <div className='app-container'>

    <SideBar setActiveChat = {handleChatSelect} chatData={chatData} setChatData={setChatData}/>
    <ChatSection handleSend={handleSend} activeChat={activeChat} messages={message} setMessage={setMessage} chatData={chatData} setChatData={setChatData} isLoading={isLoading} />
  </div>
  )
}

export default App
