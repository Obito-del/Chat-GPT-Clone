import ChatHistoryItems from "./ChatHistoryItems"
import {OpenAI} from "./ChatGPTIcon";
import { 
  MagnifyingGlass, 
  SidebarSimple, 
  Plus, 
  Image, 
  Books, 
  Folder, 
  Code, 
  DotsThree, 
  Gift 
} from "@phosphor-icons/react"

function SideBar({ setChatData,setActiveChat, chatData }) {
    
    return (
        <div>
                <div className="sidebar">
            <div className="top-logos">
                <div className="left-logos">
                    <OpenAI size={23} color="#ffffff" />
                </div>
                <div className="right-logos">
                    <MagnifyingGlass size={20} color="white"/>
                    <SidebarSimple size={20} color="white"/>
                </div>
            </div>

            <div className="sidebar-scrollable-content">
                <div className="chats-imgs-librarys">
                    <div className="new-chat" onClick={() => setActiveChat(null)}>
                            <Plus size={20}/> <p>New Chat</p> 
                    </div>
                    <div>
                        <Image size={20}/> <p>Images</p>
                    </div>
                    <div>
                        <Books size={20}/> <p>Library</p>
                    </div>
                    <div>
                        <Folder size={20}/> <p>Projects</p>
                    </div>
                    <div>
                        <Code size={20}/> <p>Codex</p>
                    </div>
                    <div>
                        <DotsThree size={20}/> <p>More</p>
                    </div> 
                </div>


                <ChatHistoryItems setActiveChat = {setActiveChat} chatData={chatData} setChatData={setChatData}/>

                <div className="userAccount">
                    <div className="pfp-name-container">
                         <div className="pfp-name">
                            <p className="pfp">OU</p>
                            <div className="two-txt">
                                <p className="userName">Obito Uchiha</p>
                                <p className="status">Free</p>
                            </div>
                            
                        </div>
                    </div>
                       
                    <div className="claimOffer">
                       
                        <button> 
                           <Gift size={16}/>
                            <p>Claim Offer</p>
                        </button>
                    </div>
                </div>
                
            </div>
            
        </div>
        </div>
    )
}

export default SideBar