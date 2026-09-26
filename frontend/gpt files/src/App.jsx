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
    if(!id) {
      setActiveChat(null)
      return;
    }

  console.log('Selected chat ID:', id);

  fetch(`${API_URL}/conversations/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Conversation request failed: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Selected conversation:", data);
      setActiveChat(data);
    })
    .catch((err) => {
      console.error('Failed to fetch conversation:', err);
    });
};


  
const handleSend = async () => {
  const userMessage = message.trim();
  // if the user typed an empty string the if statment run which make it the code below not to run
  if(!userMessage) return; 
  setMessage("")

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
console.log("Privous MESSAGES:", previousMessages);


const conversationMessages = [
  ...previousMessages.map((msg) => ({
    role: msg.role,
    content: msg.content
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


const reader = response2.body.getReader();
const decoder = new TextDecoder();

let assistantContent = "";

setActiveChat((prev) => ({
  id: chatId,
  title: chatTitle,
  messages: [
    ...(prev?.messages || []),
    { role: "user", content: userMessage },
    { role: "assistant", content: "" }
  ]
}));
// new idea for AI

while (true) {
  const { value, done } = await reader.read();

  if (done) break;

  const chunk = decoder.decode(value, { stream: true });

  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const data = JSON.parse(line);

      if (data.message?.content) {
        assistantContent += data.message.content;

        setActiveChat((prev) => ({
          ...prev,
          messages: prev.messages.map((msg, index) =>
            index === prev.messages.length - 1
              ? {
                  ...msg,
                  content: assistantContent
                }
              : msg
          )
        }));
      }

    } catch (err) {
      console.error("Failed to parse stream chunk:", err);
    }
  }
}

setIsLoading(false);

console.log("Final AI response:", assistantContent);

handleData();

if (!activeChat) {
  setMessage("");
}
// ends here

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
