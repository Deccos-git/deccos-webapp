
import {useFirestoreMessages, useFirestore, useFirestoreSubscriptionsChannelGroup} from "../../firebase/useFirestore"
import GetLink from '../../hooks/GetLink'
import { useContext, useState, useEffect } from 'react';
import emailIcon from '../../images/icons/email-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import Location from "../../hooks/Location"
import { Auth } from '../../StateManagment/Auth';
import { client } from '../../hooks/Client';
import { db } from "../../firebase/config"
import { useHistory } from "react-router-dom"
import MessageBarGroup from "./MessageBarGroup"
import deleteIcon from '../../images/icons/delete-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";

const ChatScreen = ({group}) => {
    const [authO] = useContext(Auth)
    const [showOptions, setShowOptions] = useState('none')
    const [showSendMail, setShowSendMail] = useState("none")
    const [selectedEmailUser, setSelectedEmailUser] = useState("")
    const [logo, setLogo] = useState('')
    const [communityName, setCommunityName] = useState('')

    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const route = Location()[3]
    const history = useHistory()
    ScrollToTop()

    const messages = useFirestoreMessages("Messages", route)
    const members = useFirestoreSubscriptionsChannelGroup(route)
    const compagnies = useFirestore("CompagnyMeta")

    useEffect(() => {

        compagnies && compagnies.forEach(comp => {
            const communityName = comp.CommunityName
            const logo = comp.Logo

            setCommunityName(communityName)
            setLogo(logo)
        })

    },[compagnies])

    const messageClass = (message) => {
        if(message.User === authO.UserName){
            return "auth-message"
        } else if (message.User != authO.UserName)  {
            return "user-message"
        }
    }

    const optionsClass = (message) => {
        if(message.User === authO.UserName){
            return "message-options-container"
        } else if (message.User != authO.UserName)  {
            return "hide-message-options"
        }
    }

    const toggleOptions = () => {
        if(showOptions === "none"){
            setShowOptions("flex")
        } else if(showOptions === "flex"){
            setShowOptions("none")
        }
    }

    const emailOptions = () => {
        if(showSendMail === "none"){
            setShowSendMail("block")
        } else if(showSendMail === "block"){
            setShowSendMail("none")
        }
}

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

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
            members && members.forEach(member => {

                memberMailArray.push(member.UserEmail)
            })
        } else {
            memberMailArray.push(member)
        }

        setSelectedEmailUser(memberMailArray)
    }

    const deleteMessage = (e) => {
        const id = e.target.dataset.id 

        db.collection('Messages')
        .doc(id)
        .delete()
    }


    return(
        <div className="chat-screen">
            {messages && messages.map(message => (
                <div className={messageClass(message)} key={message.ID}>
                    <div className="sender-meta-container">
                        <img className="sender-photo" src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink} />
                        <p className="sender-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                        <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div dangerouslySetInnerHTML={{__html:GetLink(message)}}></div>
                    <div className={optionsClass(message)}>
                        <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                        <div className='message-options-inner-container' style={{display: showOptions}}>
                            <div className="send-as-mail-container">
                                <img className="notifications-icon-message" src={emailIcon} alt="" onClick={emailOptions}/>
                                <div style={{display: showSendMail}}>
                                    <button data-id={group.ID} data-username={message.User} data-room={group.Room} onClick={sendAsMail}>Verstuur bericht als email</button>
                                    <select name="" id="" onChange={emailMemberHandler}>
                                        <option value="">-- Selecteer --</option>
                                        <option value="everybody">Iedereen</option>
                                        {members && members.map(member => (
                                            <option value={member.UserEmail}>{member.UserName}</option>
                                        ))}
                                    </select>
                                </div>
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

export default ChatScreen