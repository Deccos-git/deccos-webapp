import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages, useFirestoreUser } from "../../firebase/useFirestore"
import MessageBarGroup from "./MessageBarGroup"
import emailIcon from '../../images/icons/email-icon.png'
import { db } from "../../firebase/config"
import { useEffect, useContext, useState} from "react"
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import { client } from "../../hooks/Client";
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import GetLink from '../../hooks/GetLink'
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";

const ChatRoom = () => {
    const [showSendMail, setShowSendMail] = useState("none")
    const [showOptions, setShowOptions] = useState('none')

    const [authO] = useContext(Auth)
    const route = Location()[3]
    const menuState = MenuStatus()
    ScrollToTop()

    const chats = useFirestoreID("Chats", route)
    const messages = useFirestoreMessages("Messages", route)
    const compagny = useFirestore("CompagnyMeta")

    const history = useHistory()
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };

    let userID = ""
    let userName = ""
    let email = ""
    let room = ""

    const redirect = () => {
        chats && chats.forEach(chat => {
            if(!chat.Members.includes(authO.ID)){
                history.push(`/${client}/`)
            }
        })
    }

    redirect()

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

    const chatPartners = useFirestoreUser(userID)

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
            subject: `${authO.UserName} heeft je een bericht gestuurd in jullie chat.`,
            html: `Hallo ${userName}, </br></br>

                ${authO.UserName} heeft je een bericht gestuurd in jullie chat.</br></br>

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

    const optionsClass = (message) => {
        if(message.User === authO.UserName){
            return "message-options-container"
        } else if (message.User != authO.UserName)  {
            return "hide-message-options"
        }
    }

    const emailOptions = () => {
        if(showSendMail === "none"){
            setShowSendMail("flex")
        } else if(showSendMail === "flex"){
            setShowSendMail("none")
        }
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const deleteMessage = (e) => {
        const id = e.target.dataset.id 

        db.collection('Messages')
        .doc(id)
        .delete()
    }

    const toggleOptions = () => {
        if(showOptions === "none"){
            setShowOptions("flex")
        } else if(showOptions === "flex"){
            setShowOptions("none")
        }
    }

    const ChatScreen = () => {
        return(
            <div className="chat-screen">
            {messages && messages.map(message => (
                <div className={messageClass(message)} key={message.ID}>
                    <div className="sender-meta-container">
                        <img className="sender-photo" src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink}/>
                        <p className="sender-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                        <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div dangerouslySetInnerHTML={{__html:GetLink(message)}}></div>
                    <div className={optionsClass(message)}>
                        <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                        <div className='message-options-inner-container' style={{display: showOptions}}>
                            <img className="notifications-icon-message" data-message={message.Message} src={emailIcon} alt="" onClick={emailOptions}/> 
                            <div style={{display: showSendMail}}>
                                <button className='send-as-mail-button' onClick={sendAsMail}>Verstuur bericht als email</button>
                            </div>
                            <div className='delete-message-container'>
                                <img className="notifications-icon-message" data-id={message.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <MessageBarGroup route={route} auth={authO} />
            </div>
        )
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="chat-container" style={{display: menuState}}>
                {chatPartners && chatPartners.map(user => (
                    <div className="chat-header" key={user.ID}>
                        <div>
                            <img className="user-image" src={user.Photo} alt="" data-id={user.ID} onClick={profileLink} /> 
                        </div>
                        <div className="header-title-container">
                            <p>Chat met</p>
                            <h2 className="user-image" key={user.ID} data-id={user.ID} onClick={profileLink}>{user.UserName}</h2> 
                        </div>
                    </div>
                ))}
               <ChatScreen/>
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
