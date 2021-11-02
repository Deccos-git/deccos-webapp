import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import deleteIcon from '../images/icons/delete-icon.png'
import settingsIcon from '../images/icons/settings-icon.png'
import { useState, useContext } from "react"
import { Auth } from '../StateManagment/Auth';
import { db } from "../firebase/config"

const Reaction = ({message}) => {
    const [authO] = useContext(Auth)
    const [showOptions, setShowOptions] = useState('none')

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()

    let numberOfReactions = ""

        if(message.Thread.length === 0){
            numberOfReactions = `Bekijk 0 reacties`
        } else if (message.Thread.length === 1){
            numberOfReactions = `Bekijk ${message.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${message.Thread.length} reacties`
        }

    const updateRoute = () => {

        history.push(`/${client}/MessageDetail/${message.ID}`)
        
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const linkInText = (message) => {
    
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        const links = message.Message.match(urlRegex)
    
        if(links != null){
    
            const newText = message.Message.replace(links[0], `<a href="${links}", target="_blank">${links}</a>`)
    
            return newText
    
        } else {
    
            return message.Message
        }
    
    }

    const toggleOptions = () => {
        if(showOptions === "none"){
            setShowOptions("flex")
        } else if(showOptions === "flex"){
            setShowOptions("none")
        }
    }

    const optionsClass = (message) => {
        if(message.User === authO.UserName){
            return "reaction-options-container"
        } else if (message.User != authO.UserName)  {
            return "hide-message-options"
        }
    }

    const deleteMessage = (e) => {
        const id = e.target.dataset.id 

        db.collection('Messages')
        .doc(id)
        .delete()
    }

    return (
        <div className='reaction-container'>
            <div className="reaction-inner-container" key={message.ID}>
                <div className="auth-photo-container">
                    <img src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink}/>
                </div>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <p className="auth-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                        <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-container">
                        <div className="massage" dangerouslySetInnerHTML={{__html:linkInText(message)}}></div>
                    </div>
                    <div className="like-container">
                        <p className="like-counter">Aantal bijdragen aan doelen: {message.Contributions.length}</p>
                        < LikeBar message={message} />
                    </div>
                    <div className="button-container">
                        <button className="reaction-button" onClick={updateRoute}>{numberOfReactions}</button>
                    </div>
                    < ReactionBar message={message} />
                </div>
            </div>
            <div className={optionsClass(message)}>
                <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                <div style={{display: showOptions}}>
                    <div className='delete-message-container'>
                        <img className="notifications-icon-message" data-id={message.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reaction
