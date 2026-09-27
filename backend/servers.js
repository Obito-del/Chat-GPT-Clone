//import ChatHistoryItems from "../src/components/ChatHistoryItems.jsx";

const express = require('express');
const cors = require('cors');
// const http = require('http');   
const fs = require('fs');
const path = require('path');
const ollama = require('ollama').default;

const { chatHistory, myDetailedConvo } = require('./data/ChatHistory.js');

//import { chatHistory, myDetailedConvo } from './data/ChatHistory.js'

const conversationsFile = path.join(__dirname, 'data', 'conversations.json');

let conversations = [];

if (fs.existsSync(conversationsFile)) {
    conversations = JSON.parse(fs.readFileSync(conversationsFile, 'utf8'));
}

// helper function
function saveConversations() {
    fs.writeFileSync(
        conversationsFile,
        JSON.stringify(conversations, null, 2)
    );
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'ChatGPT clone is running in the background' });
});

app.get('/conversations', (req, res) => {
    const oldConversations = chatHistory.items.map((chat) => ({
        id: chat.id,
        title: chat.title,
        messages: []
    }));

    res.json([
        ...conversations,
        ...oldConversations
    ]);
});

app.post('/conversations', (req, res) => {
    const { title } = req.body;

    const newConversation = {
        id: Date.now().toString(),
        title: title || "New Chat",
        messages: []
    };

    conversations.unshift(newConversation);

    saveConversations();

    res.json(newConversation);
})


// app.post('/conversations', (req, res) => {

//     // console.log(req.body)
//     const newPost = { 
//         id : Date.now().toString(),
//         title: req.body.messages,
//         text: req.body.messages
//     }
//     chatHistory.items.unshift(newPost)
//     // console.log(chatHistory.items)
//     res.json(newPost)

// // const localChat = chatData.find((chat) => chat.id === id && chat.text);
// //     if(localChat) {
// //       setActiveChat(localChat)
// //       return;
// //     }
// })

app.post('/chat', async (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    const { model, message, chatId } = req.body || {};

    const conversation = conversations.find(
        (chat) => chat.id === chatId
    );

    if (!conversation) {
        return res.status(404).json({
            error: 'Conversation not found'
        });
    }

    const userMessage = message[message.length - 1];

    // Save user's message
    conversation.messages.push({
        role: userMessage.role,
        content: userMessage.content
    });

    // Tell the frontend we are sending a stream
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const stream = await ollama.chat({
            model: model,
            messages: message,
            stream: true
        });
    let assistantContent = '';

    for await (const part of stream) {
        if (part.message?.content) {
            assistantContent += part.message.content;
        }

        res.write(JSON.stringify(part) + '\n');
    }

    conversation.messages.push({
        role: "assistant",
        content: assistantContent
    });

    saveConversations();

    res.end();

} catch (err) {
    console.error('Error fetching Ollama response:', err);

    if (!res.headersSent) {
        res.status(500).json({
            error: 'Failed to fetch Ollama response'
        });
    } else {
        res.end();
    }
}
});

    // try {
    //     const ollamaRes = await fetch(`https://localhost:11434/api/chat`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ 
    //             model: model,
    //             messages: message,
    //             // makes it wait and send back one complete JSON object instead
    //             steam: false   
    //         })
    //     });

    //     const data = await ollamaRes.json();
    //     res.json(data.message);


    // } catch (error) {
    //     console.error('Error fetching Ollama response:', error);
    //     res.status(500).json({ error: 'Failed to fetch Ollama response' });
    // }


//  const chats = req.body;
//     console.log("new API", chats)
    
//  res.json();



app.get('/conversations/:id', (req, res) => {

    const { id } = req.params;

    console.log("REQUESTED CHAT ID:", id);

    // 1. Check newly created/saved conversations
    const conversation = conversations.find(
        (chat) => chat.id === id
    );

    if (conversation) {
        console.log("FOUND NEW CONVERSATION:", conversation);
        return res.json(conversation);
    }

    // 2. Check old detailed conversations
    const detailed = myDetailedConvo.find(
        (chat) => chat.conversation_id === id
    );

    if (detailed) {
        console.log("FOUND OLD DETAILED CONVERSATION:", detailed);
        return res.json(detailed);
    }

    // 3. Check old basic conversations
    const basic = chatHistory.items.find(
        (chat) => chat.id === id
    );

    if (basic) {
        console.log("FOUND OLD BASIC CONVERSATION:", basic);
        return res.json({
            id: basic.id,
            title: basic.title,
            messages: []
        });
    }

    console.log("CONVERSATION NOT FOUND:", id);

    return res.status(404).json({
        error: "Conversation not found"
    });
        // const { id } = req.params;
        // const detailed = myDetailedConvo.find(
        //     (chat) => chat.conversation_id === id 
        // );
        // if (detailed) {
        //     return res.json(detailed);
        // }
        
        // const basic = chatHistory.items.find((chat) => chat.id === id);
        
        // if(basic) {
        //     return res.json(basic);
        // }
        
        
        // res.status(404).json({error: 'Conversation not found'})
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})