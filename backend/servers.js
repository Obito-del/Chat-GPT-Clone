//import ChatHistoryItems from "../src/components/ChatHistoryItems.jsx";

const express = require('express');
const cors = require('cors');
const http = require('http');   // ← this line was missing
const fs = require('fs');
const path = require('path');

const { chatHistory, myDetailedConvo } = require('./data/ChatHistory.js');
const { log, error } = require('console');
const { resolve } = require('dns');
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

    const ollamaReq = http.request(
        {
            hostname: 'localhost',
            port: 11434,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        },

        (ollamaRes) => {
            let body = '';

            ollamaRes.on('data', (chunk) => {
                body += chunk;
            });

            ollamaRes.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    const assistantMessage = data.message;

                    // Save AI response
                    conversation.messages.push({
                        role: assistantMessage.role,
                        content: assistantMessage.content
                    });

                    saveConversations();

                    res.json({
                        ...assistantMessage,
                        title: message?.[0]?.content
                    });

                } catch (err) {
                    console.error("Failed to process Ollama response:", err);

                    res.status(500).json({
                        error: "Failed to process Ollama response"
                    });
                }
            });
        }
    );

    ollamaReq.on('error', (err) => {
        console.error('Error fetching Ollama response:', err);

        res.status(500).json({
            error: 'Failed to fetch Ollama response'
        });
    });

    ollamaReq.write(
        JSON.stringify({
            model,
            messages: message,
            stream: false
        })
    );

    ollamaReq.end();
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


// there is always a better version of a code here is it below

const  { id } = req.params;

console.log("REQUESTED OLD CHAT ID:", id);
console.log("DETAILED MATCH:", myDetailedConvo.find(
    (chat) => chat.conversation_id === id
));

const detailed = myDetailedConvo.find(
    (chat) => chat.conversation_id === id
);

if (detailed) {
    return res.json(detailed);
}

res.status(404).json({
    error: "COnversation not found"
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

})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})