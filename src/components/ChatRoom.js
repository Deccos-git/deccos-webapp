import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBarGroup from "./MessageBarGroup"
import emailIcon from '../images/icons/email-icon.png'
import { db } from "../firebase/config"
import { useEffect, useContext, useState} from "react"
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import { client } from "../hooks/Client";
import MenuStatus from "../hooks/MenuStatus";
import { useHistory } from "react-router-dom"

const ChatRoom = () => {
    const [showSendMail, setShowSendMail] = useState("none")

    const [authO] = useContext(Auth)
    const route = Location()[3]
    const menuState = MenuStatus()

    const chats = useFirestoreID("Chats", route)
    const messages = useFirestoreMessages("Messages", route)
    const compagny = useFirestore("CompagnyMeta")

    const history = useHistory()
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };

    let userID = ""
    let userName = ""
    let email = ""
    let room = ""

    const messageClass = (message) => {
        if(message.User === authO.UserName){
            return "auth-message"
        } else if (message.User != authO.UserName)  {
            return "user-message"
        }
    }

    // Define name of chatpartner
    chats && chats.forEach(chat => {
        const members = chat.Members

        room = chat.ID

        members && members.forEach(member => {
            if(authO.ID != member){
                userID = member
            }
        })
    })

    const chatPartners = useFirestoreID("Users", userID)

    chatPartners && chatPartners.forEach(partner => {
        userName = partner.UserName
        email = partner.Email
    })

    let communityName = ""
    let logo = ""

    compagny && compagny.forEach(comp => {
        communityName = comp.CommunityName
        logo = comp.Logo
    })

    const sendAsMail = (e) => {
        e.target.innerHTML = "Verstuurd"

        db.collection("Email").doc().set({
            to: [email],
            cc: "info@Deccos.nl",
            message: {
            subject: `${userName} heeft je een bericht gestuurd in jullie chat.`,
            html: `Hallo ${authO.UserName}, </br></br>

                ${userName} heeft je een bericht gestuurd in jullie chat.</br></br>

                Bekijk het bericht <a href="https://www.deccos.co/${client}/ChatRoom/${room}"><u>hier</u></a>.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${userName}`,
            Emailadres: email,
            Type: "Chat"
              }     
          }); 
    }

    const emailOptions = () => {
        if(showSendMail === "none"){
            setShowSendMail("flex")
        } else if(showSendMail === "flex"){
            setShowSendMail("none")
        }
    }

    const users = useFirestoreID("Users", userID)

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="group-container" style={{display: menuState}}>
                {users && users.map(user => (
                    <div className="chat-header">
                        <div>
                            <img className="user-image" src={user.Photo} alt="" data-id={user.ID} onClick={profileLink} /> 
                        </div>
                        <div className="header-title-container">
                            <h2>Chat met</h2>
                            <h2 className="user-image" key={user.ID} data-id={user.ID} onClick={profileLink}>{user.UserName}</h2> 
                        </div>
                    </div>
                ))}
                <div className="chat-screen">
                {messages && messages.map(message => (
                    <div className={messageClass(message)} key={message.ID}>
                        <div className="sender-meta-container">
                            <img className="sender-photo" src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink}/>
                            <p className="sender-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                            <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <div className="send-as-mail-container">
                            <img className="notifications-icon-message" data-message={message.Message} src={emailIcon} alt="" onClick={emailOptions}/> 
                            <div style={{display: showSendMail}}>
                                <button onClick={sendAsMail}>Verstuur bericht als email</button>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{__html:message.Message}}></div>
                    </div>
                ))}
                <MessageBarGroup route={route} auth={authO} />
                </div>
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
