import { DotsThreeIcon, PencilSimpleIcon,  TrashIcon } from "@phosphor-icons/react"
import { useState } from "react"


function ChatHistoryItems ({setActiveChat, chatData, setChatData}) {
    
    const [menuOpenId, setMenuOpenId] = useState(null)
    const [renameingId, setRenamingId] = useState(null)
    const [renameValue, setRenameValue] = useState("")

    const handleDelete = (id) => {
        setChatData(chatData.filter((chat) => chat.id !== id))
        setMenuOpenId(null)
    }

    // in the input the current name will be there
    const startRename = (chat) => {
        setRenamingId(chat.id)
        setRenameValue(chat.title)
        setMenuOpenId(null)
    }


    //changes only the title, like the id will be untouched
    const confermRename = (id) => {
        if (renameValue.trim()) {
            setChatData(chatData.map((chat) =>
            chat.id === id ? {...chat, title: renameValue} : chat
            ))
        }
        setRenamingId(null)
    }

    return (
        <div className="chat-histories">
            <h2>Recent</h2>

            <div id="sidbar-titles">
                {chatData.map((chat) => (
                    <div key={chat.id} className="chat-title-wrapper">
                        {renameingId === chat.id ? (
                            <input type="text"
                                className="rename-input"
                                autoFocus
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={() => confermRename(chat.id)}
                                onKeyDown={(e) => e.key === "Enter" && confermRename(chat.id)}
                                
                            />
                        ) : (
                            <div onClick={() => setActiveChat(chat.id)} className="chat-history-item">
                                
                                <p>{chat.title}</p>
                                <DotsThreeIcon
                                size={18}
                                weight="bold"
                                className="chat-dots"
                                onClick={(e)=> {
                                    console.log(e)
                                    e.stopPropagation()
                                    setMenuOpenId(menuOpenId === chat.id ? null : chat.id)
                                }}
                                />
                            </div>
                        )}
                        {menuOpenId === chat.id && (
                            <div className="chat-dropdown-menu">
                                <div onClick={()=>startRename(chat)}>
                                    <PencilSimpleIcon size={14}/> <p>Rename</p>
                                </div>
                                <div  onClick={() => handleDelete(chat.id)}>
                                        <TrashIcon size={14} color="rgb(243, 54, 54)"/> <p className="delete-btn">Delete</p>
                                </div>
                               
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )

}
export default ChatHistoryItems