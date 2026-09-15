import ChatHistoryItems from "./ChatHistoryItems"
import {OpenAI} from "./ChatGPTIcon";
import { 
  MagnifyingGlassIcon, 
  SidebarSimpleIcon, 
  PlusIcon, 
  ImageIcon, 
  BooksIcon, 
  FolderIcon, 
  CodeIcon, 
  DotsThreeIcon, 
  GiftIcon 
} from "@phosphor-icons/react"

function SideBar({ setChatData,setActiveChat, chatData }) {
    
    
    return (
        <div>
            {/* <button class="open-btn">X</button> */}
            <div className="sidebar">
            <div className="top-logos">
                <div className="left-logos">
                    <OpenAI size={23} color="#ffffff" />
                </div>
                <div className="right-logos">
                    <MagnifyingGlassIcon size={20} color="white"/>
                    <SidebarSimpleIcon size={20} color="white"/>
                </div>
            </div>

            <div className="sidebar-scrollable-content">
                <div className="chats-imgs-librarys">
                    <div className="new-chat" onClick={() => setActiveChat(null)}>
                            <PlusIcon size={20}/> <p>New Chat</p> 
                    </div>
                    <div>
                        <ImageIcon size={20}/> <p>Images</p>
                    </div>
                    <div>
                        <BooksIcon size={20}/> <p>Library</p>
                    </div>
                    <div>
                        <FolderIcon size={20}/> <p>Projects</p>
                    </div>
                    <div>
                        <CodeIcon size={20}/> <p>Codex</p>
                    </div>
                    <div>
                        <DotsThreeIcon size={20}/> <p>More</p>
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
                           <GiftIcon size={16}/>
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