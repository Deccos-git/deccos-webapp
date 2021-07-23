import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups, useFirestoreID } from "./../firebase/useFirestore";

const ChatGroups = ({auth}) => {

    const chats = useFirestoreChatsGroups("Chats", auth.ID)

    let chatPartnerID = ""

    chats && chats.forEach(chat => {
        const members = chat.Members
        members.forEach(member => {
            if(auth.ID != member){
                chatPartnerID = member
            }
        })
    })

    const chatPartners = useFirestoreID("Users", chatPartnerID)

    console.log(chatPartners)

    return (
            <div className="main">
                <LeftSideBar />
                <div className="list">
                    <h2>Chats</h2>
                    {chatPartners && chatPartners.map(chatPartner => (
                        <div className="chats-overview-container">
                            <img src={chatPartner.Photo} alt="" />
                            <p className="chat-overview-username">{chatPartner.UserName}</p>
                            {chats && chats.map(chat => (
                                <p>{chat.Messages} berichten</p>
                            ))}
                        </div>

                    ))}
                    <h2>Groepen</h2>
                </div>
                <RightSideBar />
            </div>
    )
}

export default ChatGroups