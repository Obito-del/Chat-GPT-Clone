//import ChatHistoryItems from "../src/components/ChatHistoryItems.jsx";

const express = require('express');
const cors = require('cors');
const http = require('http');   // ← this line was missing
const { chatHistory, myDetailedConvo } = require('./data/ChatHistory.js');
const { log } = require('console');
//import { chatHistory, myDetailedConvo } from './data/ChatHistory.js'


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'ChatGPT clone is running in the background' });
});

app.get('/conversation', (req, res) => {
    res.json(chatHistory.items);
});


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
    
    console.log("BODY RECIVED:", req.body);
    const {model, message, title} = req.body || {};
    
    if(!title && message?.length > 0) {
     const newPost = { 
        id : Date.now().toString(),
        title: message[0].content,
        text: req.body.message
    }
    chatHistory.items.unshift(newPost)
    }
   
    // console.log(chatHistory.items)
    // res.json(newPost)

    

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
                ollamaRes.on('data', (chunk) => (body += chunk));
                ollamaRes.on('end', () => {
                    const data = JSON.parse(body);
                    res.json({...data.message,title:message?.[0]?.content});
                });
            }
        
    );

    ollamaReq.on('error', (err) => {
        console.error('Error fetching Ollama response:', err);
        res.status(500).json({ error: 'Failed to fetch Ollama response' });
    });
    // stream flase make it appear in one box or chat
    ollamaReq.write(JSON.stringify({ model, messages: message, stream: false}));
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