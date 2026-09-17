//import ChatHistoryItems from "../src/components/ChatHistoryItems.jsx";
const express = require('express');
const cors = require('cors');
const { chatHistory, myDetailedConvo } = require('./data/ChatHistory.js');
//import { chatHistory, myDetailedConvo } from './data/ChatHistory.js'


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'ChatGPT clone is running in the background' });
});

app.get('/conversations', (req, res) => {
    res.json(chatHistory.items);
});

app.post('/conversations', (req, res) => {

    // console.log(req.body)
    const newPost = { 
        id : Date.now().toString(),
        title: req.body.messages,
        text: req.body.messages
    }
    chatHistory.items.unshift(newPost)
    // console.log(chatHistory.items)
    res.json(newPost)

// const localChat = chatData.find((chat) => chat.id === id && chat.text);
//     if(localChat) {
//       setActiveChat(localChat)
//       return;
//     }
})

app.post('/chat', (req, res) => {
 const chats = req.body;
    console.log("new API", chats)
    
 res.json();

})

app.get('/conversations/:id', (req, res) => {
    const { id } = req.params;
    const detailed = myDetailedConvo.find(
        (chat) => chat.conversation_id === id 
    );
    if (detailed) {
        return res.json(detailed);
    }

    const basic = chatHistory.items.find((chat) => chat.id === id);

    if(basic) {
        return res.json(basic);
    }

    
    res.status(404).json({error: 'Conversation not found'})

})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})