import { 
    CaretDown,
    Gift,
    LockKey,
    NotePencil,
    Plus,
    Microphone,
    ArrowUp
} from "@phosphor-icons/react"


function ChatSection ({ handleSend, activeChat, messages, setMessage, chatData, setChatData }) {
   // console.log(chatData)
    //console.log("Active Chat Data:", activeChat);
    const message = []

    if (activeChat && activeChat.mapping) {
        //it cahnges the dictionary (UUID node IDs) to standard JavaScript array to looop through them
        Object.values(activeChat.mapping).forEach((item) => {
            //loop through every single node conversations 
            if (item.message && item.message.content && item.message.content.parts) {
                message.push({
                    id: item.id,
                    sender: item.message.author.role === "user" ? "user" : "assistant",
                    text: item.message.content.parts[0]
                })
            }
        })
    } else if (activeChat && activeChat.text) {
        message.push({
            id: activeChat.id,
            sender: 'user',
            text: activeChat.text
        })
    }
    return (
        <div className="chat-section">
            <header>
                <div className="left-header">
                <p>{activeChat ? activeChat.title : "ChatGPT"}</p>
                    <CaretDown size={14} weight="bold" color="white" />
                </div>

                <div className="middle-header">
                <button className="btn-1">
                    <Gift size={18} weight="fill" />
                    <p>Free offer</p>
                </button>
                <button className="btn-2">Chat</button>
                <button className="btn-3">
                    <LockKey size={14} weight="fill" color="rgba(169, 169, 169, 1)"/>
                    <p>Work</p>
                </button>
                </div>

                <div className="right-header">
                <NotePencil size={20} color="white" />
                </div>
            </header>

            <div className="AI-user-input">
                {activeChat ? (
                    <div className="chat-conversation-body">
                        {message.map((msg) => (
                            <div key={msg.id} className={`message-item ${msg.sender}`}>
                                <strong>{msg.sender === "user" ? "You" : "ChatGPT"}</strong>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="AI-input">
                    <h2>Hey there, What's on your mind</h2>
                    </div>
                )}
                    

                <div className="user-input">
                <div className="span-class">
                    <div className="div-2">
                    <div className="plus-input">
                        <Plus size={23} className="img-1" weight="bold" color="white"/>
                        <input type="text" placeholder="Ask anything..." value={messages} onChange={(e) => setMessage(e.target.value)}/>
                    </div>

                    <div className="mic-sound">
                        <Microphone size={20} className="img-2" color="white" />
                        <div className="img-3" onClick={handleSend} onKeyDown={(e) => e.key === 'Enter' && handleSend()}>
                        <ArrowUp size={16} weight="bold"/>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
    </div>

    )
    
}

export default ChatSection