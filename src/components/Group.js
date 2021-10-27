import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBarGroup from "./rightSideBar/RightSideBarGroup"
import MessageBarGroup from "./MessageBarGroup"
import { useFirestoreID, useFirestoreMessages, useFirestore } from "../firebase/useFirestore"
import emailIcon from '../images/icons/email-icon.png'
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import { db } from "../firebase/config"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import GetLink from '../hooks/GetLink'
import GroupChannel from './GroupChannel'
import { client } from '../hooks/Client';

const Group = () => {
    const [authO] = useContext(Auth)
    const [showSendMail, setShowSendMail] = useState("none")
    const [selectedEmailUser, setSelectedEmailUser] = useState("")
    const [chatDisplay, setChatDisplay] = useState('flex')
    const [channelDisplay, setChannelDisplay] = useState('none')
    const [tabChat, setTabChat] = useState('active-tab')
    const [channelChat, setChannelTab] = useState('not-active-tab')

    const menuState = MenuStatus()
    const route = Location()[3]
    
    const groups = useFirestoreID("Groups", route)
    const messages = useFirestoreMessages("Messages", route)
    const compagny = useFirestore("CompagnyMeta")
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const history = useHistory()

    const messageClass = (message) => {
        if(message.User === authO.UserName){
            return "auth-message"
        } else if (message.User != authO.UserName)  {
            return "user-message"
        }
    }
    
    const emailOptions = () => {
            if(showSendMail === "none"){
                setShowSendMail("flex")
            } else if(showSendMail === "flex"){
                setShowSendMail("none")
            }
    }

    let communityName = ""
    let logo = ""

    compagny && compagny.forEach(comp => {
        communityName = comp.CommunityName
        logo = comp.Logo
    })

    const sendAsMail = (e) => {

        const room = e.target.dataset.room
        const userName = e.target.dataset.username
        const id = e.target.dataset.id
        e.target.innerHTML = "Verstuurd"

        db.collection("Email").doc().set({
            to: selectedEmailUser,
            cc: "info@Deccos.nl",
            message: {
            subject: `${userName} heeft je een bericht gestuurd in de groep ${room}.`,
            html: `Hallo ${authO.UserName}, </br></br>

                ${userName} heeft je een bericht gestuurd in de groep ${room}.</br></br>

                Bekijk het bericht <a href="https://www.deccos.co/${client}/Group/${id}"><u>hier</u></a>.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${userName}`,
            Emailadres: selectedEmailUser,
            Type: "Group"
              }     
          });
    }

    const emailMemberHandler = (e) => {
        const member = e.target.value

        const memberMailArray = []

        if(member === "everybody"){
            groups && groups.forEach(group => {
                // group.Members.forEach(member => {
                //     memberMailArray.push(member.Email)
                // })
            })
        } else {
            memberMailArray.push(member)
        }

        setSelectedEmailUser(memberMailArray)
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const showChat = () => {
        setChatDisplay('flex')
        setChannelDisplay('none')
        setTabChat('active-tab')
        setChannelTab('not-active-tab')
    }

    const showChannel = () => {
        setChatDisplay('none')
        setChannelDisplay('flex')
        setTabChat('not-active-tab')
        setChannelTab('active-tab')
    }

    const ChatScreen = () => {
        return(
            groups && groups.map(group => (
            <div className="chat-screen" style={{display: chatDisplay}}>
            {messages && messages.map(message => (
            <div className={messageClass(message)} key={message.ID}>
                <div className="sender-meta-container">
                    <img className="sender-photo" src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink} />
                    <p className="sender-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                    <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                </div>
                <div dangerouslySetInnerHTML={{__html:GetLink(message)}}></div>
                <div className="send-as-mail-container">
                    <img className="notifications-icon-message" src={emailIcon} alt="" onClick={emailOptions}/>
                    <div style={{display: showSendMail}}>
                        <button data-id={group.ID} data-username={message.User} data-room={group.Room} onClick={sendAsMail}>Verstuur bericht als email</button>
                        <select name="" id="" onChange={emailMemberHandler}>
                            <option value="">-- Selecteer --</option>
                            <option value="everybody">Iedereen</option>
                            {/* {group.Members.map(member => (
                                <option value={member.Email}>{member.UserName}</option>
                            ))} */}
                        </select>
                    </div>
                </div>
            </div>
            ))}
            <MessageBarGroup route={route} auth={authO} />
        </div>
            ))
        )
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            {groups && groups.map(group => (
            <div className="group-outer-container" key={group.ID} style={{display: menuState}}>
                <div className="group-container">
                    <div className="chat-header">
                        <h1>{group.Room}</h1>
                        <div className='group-navigation-container'>
                            <p className={tabChat} onClick={showChat}>Chat</p>
                            <p className={channelChat} onClick={showChannel}>Kanaal</p>
                        </div>
                    </div>
                    <ChatScreen />
                    <div style={{display: channelDisplay}}>
                        <GroupChannel />
                    </div>
                </div>
                <RightSideBarGroup group={group} route={route} /> 
            </div>
            ))}
        </div>
    )
}

export default Group